import { Module } from '@nestjs/common';
import { UserRepository } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { UserService } from './user.service';

@Module({

    providers:[
        {
            provide: UserRepository, useClass: PrismaUserRepository
        },
        UserService
    ],

    exports: [ UserService]
})
export class UserModule {}
