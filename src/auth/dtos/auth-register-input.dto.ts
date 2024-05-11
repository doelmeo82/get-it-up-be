import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class RegisterInput {
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  username!: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @Length(6, 255)
  @IsString()
  password!: string;
}
