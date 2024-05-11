import { Expose, Type } from 'class-transformer';
import { RoleOutput } from '../../auth/dtos';

export class GetUsersOutput {
  @Expose()
  public _id: string;

  @Expose()
  public fullname: string;

  @Expose()
  public email: string;

  @Expose()
  public username: string;

  @Expose()
  public gender: boolean;

  @Expose()
  public avatar: string;

  @Expose()
  public birthDate: Date;

  @Expose()
  public isDisabled: boolean;

  @Expose()
  public isDeleted: boolean;

  @Expose()
  @Type(() => Date)
  public createdAt: Date;

  @Expose()
  @Type(() => RoleOutput)
  roles: RoleOutput[];
}
