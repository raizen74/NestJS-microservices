import { Type } from "class-transformer";
import { IsArray, IsEmail, IsOptional, IsStrongPassword, ValidateNested } from "class-validator";
import { RoleDto } from "./roles.dto";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => RoleDto)
  roles?: RoleDto[]
}