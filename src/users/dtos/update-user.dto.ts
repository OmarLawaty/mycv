import { IsEmail, IsOptional, IsStrongPassword } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsStrongPassword()
  password: string;
}
