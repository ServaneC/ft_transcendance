import { IsString, IsBoolean } from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    currentPassword: string;

    @IsString()
    newPassword: string;

    @IsBoolean()
    toAdd: boolean;
}