import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './domain/repositories/user.repository';
import { RegisterDto } from '../auth/dto/register.dto';
import { Prisma} from "generated/prisma/client";

@Injectable()
export class UserService {

    constructor( private readonly userRepository: UserRepository){}

    async registerNewUser( registerUserDto : RegisterDto){
            const user = this.userRepository.create({ email: registerUserDto.email, password: registerUserDto.password});
            return user;
             
    }

    async findByEmail( email : string){
        return this.userRepository.findByEmail(email);
    }
}
