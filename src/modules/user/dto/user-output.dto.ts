import { Expose, Type } from 'class-transformer';
import { RoleOutput } from 'src/auth/dtos';

export class UserOutputDto {
  @Expose()
  public _id: string;

  @Expose()
  public fullname: string;

  @Expose()
  public email: string;

  @Expose()
  public phone: string;

  @Expose()
  public isVerifyEmail: boolean;

  @Expose()
  public isDeleted: boolean;

  @Expose()
  public isDisabled: boolean;

  @Expose()
  public username: string;

  @Expose()
  public gender: boolean;

  @Expose()
  public avatar: string;

  @Expose()
  public emailVerifyCode: string;

  @Expose()
  public birthDate: Date;

  @Expose()
  public status: number;

  @Expose()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @Type(() => RoleOutput)
  roles: RoleOutput[];
}
