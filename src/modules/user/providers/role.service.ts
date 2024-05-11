import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  public async getRoleByName(roleName: string): Promise<Role | null> {
    const role = await this.roleRepository.findOne({
      where: { roleName },
    });
    return role;
  }
}
