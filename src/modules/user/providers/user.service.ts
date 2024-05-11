import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import {
  AdminUpdateUserInput,
  CreateTeacherInput,
  FilterUserDto,
  GetUsersOutput,
} from '../../../admin/dto';
import {
  ChangePasswordInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from '../../../auth/dtos';
import { LoginInput } from '../../../auth/dtos/auth-login-input.dto';
import { MESSAGES } from '../../../common/constants/common';
import { AddressService } from '../../../modules/address/address.service';
import { CategoryService } from '../../../modules/category/category.service';
import { BaseApiResponse, BasePaginationResponse } from '../../../shared/dtos';
import { ROLES } from '../../../shared/enums';
import { UpdateProfileDto, UpdateUserInput, UserOutputDto } from '../dto';
import { User } from '../entities';
import { RoleService } from './role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private config: ConfigService,
    private readonly roleService: RoleService,
    private readonly addressService: AddressService,
    private readonly categoryService: CategoryService,
  ) {}

  public async adminGetUsers(
    filter: FilterUserDto,
  ): Promise<BaseApiResponse<BasePaginationResponse<GetUsersOutput>>> {
    const { limit, page, role } = filter;
    const builder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .andWhere('roles.id != 2');

    if (role)
      builder.andWhere('roles.role_name = :role_name', { role_name: role });
    if (page) builder.skip((page - 1) * limit);
    if (limit) builder.take(limit);

    builder.orderBy('user.createdAt', 'DESC');

    const [users, total] = await builder.getManyAndCount();
    const result = plainToInstance(GetUsersOutput, users, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: {
        listData: result,
        total,
        totalPage: Math.ceil(total / limit),
      },
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  public async adminUpdateUser(
    data: AdminUpdateUserInput,
  ): Promise<BaseApiResponse<GetUsersOutput>> {
    const { id } = data;
    const exist = await this.getUserByUserId(id);

    if (!exist)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    this.userRepository.merge(exist, data);

    const user = await this.userRepository.save(exist);
    const result = plainToInstance(GetUsersOutput, user, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: result,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 200,
    };
  }

  public async getUserByEmail(email: string): Promise<UserOutputDto> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return plainToInstance(UserOutputDto, user, {
      excludeExtraneousValues: true,
    });
  }

  public async getUserByUserId(_id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { _id },
      relations: ['roles', 'roles.permissions'],
    });

    return user;
  }

  public async getCurrentUser(
    _id: string,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    const user = await this.getUserByUserId(_id);

    const result = plainToInstance(UserOutputDto, user, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  public async create(data: RegisterInput): Promise<User> {
    const newData = plainToInstance(CreateTeacherInput, data);
    const userExist = await this.userRepository.findOne({
      where: {
        email: newData.email,
      },
    });
    if (userExist)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.EMAIL_EXISTS,
          code: 409,
        },
        HttpStatus.BAD_REQUEST,
      );

    const hash = bcrypt.hashSync(
      newData.password,
      this.config.get('saltRounds') || 7,
    );
    const role = newData.role
      ? await this.roleService.getRoleByName(ROLES.TEACHER)
      : await this.roleService.getRoleByName(ROLES.STUDENT);

    if (!role)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.ROLE_NOT_FOUND,
          code: 404,
        },
        HttpStatus.BAD_REQUEST,
      );
    return this.userRepository.save({
      ...newData,
      password: hash,
      roles: [role],
    });
  }

  public async validateUser(data: LoginInput): Promise<UserOutputDto> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND_USER,
          code: 404,
        },
        HttpStatus.BAD_REQUEST,
      );
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.UNAUTHORIZED,
          code: 401,
        },
        HttpStatus.BAD_REQUEST,
      );
    return plainToInstance(UserOutputDto, user, {
      excludeExtraneousValues: true,
    });
  }

  public async verifyEmail(
    data: VerifyEmailInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    const { id, code } = data;
    const user = await this.userRepository.findOne({
      where: { _id: id },
    });
    if (!user)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.UNAUTHORIZED,
          code: 401,
        },
        HttpStatus.BAD_REQUEST,
      );
    if (user.emailVerifyCode === code) {
      user.isVerifyEmail = true;
      user.emailVerifyCode = null;
    }
    await this.userRepository.save(user);
    const result = plainToInstance(UserOutputDto, user, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.VERIFY_SUCCESS,
      code: 200,
    };
  }

  public async resetPassword(
    data: ResetPasswordInput,
  ): Promise<BaseApiResponse<null>> {
    const { password, code, userId } = data;
    const user = await this.getUserByUserId(userId);
    if (!user)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND_USER,
          code: 404,
        },
        HttpStatus.BAD_REQUEST,
      );
    if (code !== user.emailVerifyCode)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.INVALID_CODE,
          code: 400,
        },
        HttpStatus.BAD_REQUEST,
      );
    const hash = await bcrypt.hash(
      password,
      this.config.get('saltRounds') || 7,
    );
    await this.update(userId, {
      password: hash,
      emailVerifyCode: null,
    });
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 200,
    };
  }

  public async changePassword(
    userId: string,
    data: ChangePasswordInput,
  ): Promise<BaseApiResponse<null>> {
    const { password, newPassword } = data;
    const user = await this.getUserByUserId(userId);
    if (!user)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND_USER,
          code: 404,
        },
        HttpStatus.BAD_REQUEST,
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.UNAUTHORIZED,
          code: 401,
        },
        HttpStatus.UNAUTHORIZED,
      );
    const hash = await bcrypt.hash(
      newPassword,
      this.config.get('saltRounds') || 7,
    );
    await this.update(userId, {
      password: hash,
    });
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 200,
    };
  }

  public async update(
    id: string,
    data: UpdateProfileDto,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    const user = await this.userRepository.findOne({
      where: {
        _id: id,
      },
    });
    if (!user)
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.NOT_FOUND_USER,
          code: 404,
        },
        HttpStatus.BAD_REQUEST,
      );
    this.userRepository.merge(user, data);
    const updated = await this.userRepository.save(user);
    // create user into realtime service
    const result = plainToInstance(UserOutputDto, updated, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 200,
    };
  }

  public async updateProfile(
    id: string,
    data: UpdateUserInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    const { address, subjectNames, grade } = data;
    let userAddr;
    const user = await this.getUserByUserId(id);
    if (!user)
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.NOT_FOUND_USER,
          code: 404,
        },
        HttpStatus.BAD_REQUEST,
      );

    if (subjectNames.length > 0) {
      const subCategories = await this.categoryService.getSubCategory(
        subjectNames,
        grade,
      );
      const preferSubjects = subCategories.reduce((accumulator, current) => {
        const id = current._id;
        return [...accumulator, id];
      }, [] as number[]);
      user.subjects = preferSubjects;
    }

    this.userRepository.merge(user, data);

    if (address) userAddr = await this.addressService.createAddress(address);
    const updated = await this.userRepository.save({
      ...user,
      address: userAddr,
    });
    // create user into realtime service
    const result = plainToInstance(UserOutputDto, updated, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 200,
    };
  }
}
