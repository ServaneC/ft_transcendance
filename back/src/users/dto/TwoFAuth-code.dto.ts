import { IsNumber } from "class-validator";

export class TwoFactorAuthDto {
    @IsNumber()
    twoFAuthCode: string;
    
    @IsNumber()
    id: number;
}