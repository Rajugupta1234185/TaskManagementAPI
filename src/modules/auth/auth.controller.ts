import { Controller, Post, Body } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Public } from "../../shared/decorators/public.decorator";
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {

    constructor(private authService : AuthService){}

    @Throttle({default: { limit: 3, ttl: 10000}})
    @Public()
    @Post("register")
    async register( @Body() registerUserDto : RegisterDto){
        return this.authService.registerUser(registerUserDto);
    }

    
    @Throttle({default: { limit: 3, ttl: 10000}})
    @Public()
    @Post("login")
    async login( @Body() registerUserDto : RegisterDto){
        return this.authService.loginUser(registerUserDto);
    }
}
