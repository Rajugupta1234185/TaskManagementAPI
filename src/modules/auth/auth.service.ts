import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {

    constructor(private jwtService : JwtService, private userService : UserService){}

    async registerUser(registerUserDto : RegisterDto){
        const saltRounds = 10;
        const hash = await bcrypt.hash(registerUserDto.password, saltRounds);
        const user = await this.userService.registerNewUser({...registerUserDto, password: hash});
        const {accessToken, refreshToken } = await this.generateTokens(user.id);
        return{
            id: user.id,
            email: user.email,
            accessToken,
            refreshToken
        }
    }

    
    async loginUser( registerUserDto : RegisterDto){
        const user = await this.userService.findByEmail(registerUserDto.email);
        if(!user){
            throw new UnauthorizedException("Invalid credentials");
        }
        const isMatch = await bcrypt.compare(registerUserDto.password  , user.password);
        if(!isMatch){
            throw new UnauthorizedException("Invalid credentials");
        }
        const { accessToken , refreshToken} = await this.generateTokens(user.id);

        return {accessToken, refreshToken};
    }


    private async generateTokens( userId: string){
        const payload = { sub : userId};
        const accessToken = await this.jwtService.signAsync(payload,{
            secret : process.env.JWT_ACCESS_SECRET,
            expiresIn: "5m"
        });
        const refreshToken = await this.jwtService.signAsync(payload,{
            secret : process.env.JWT_REFRESH_SECRET,
            expiresIn : "7d"
        })
        return { accessToken , refreshToken };
    }
}
