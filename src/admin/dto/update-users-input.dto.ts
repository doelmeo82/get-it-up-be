import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdminUpdateUserInput {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsOptional()
  isDisabled: boolean;

  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;
}
