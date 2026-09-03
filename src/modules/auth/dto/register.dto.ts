import { IsString, IsNotEmpty, MinLength, IsEmail, MaxLength} from "class-validator";
import { Transform } from "class-transformer";
export class RegisterDto{

  
    
    @Transform(({value}) => value.toLowerCase().trim())
    @IsEmail({}, { message: "Please provide valid email address"})
    @IsNotEmpty()
    email !: string;

    @MaxLength(72, { message: 'Password must be less than 72 characters' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password should not be empty' })
    password!: string;
}