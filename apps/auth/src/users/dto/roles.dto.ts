import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RoleDto {
  @IsOptional()
  @IsNumber()
  _id?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}
