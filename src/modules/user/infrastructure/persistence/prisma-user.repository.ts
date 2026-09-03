import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { UserRepository } from "../../domain/repositories/user.repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { Prisma } from "generated/prisma/client";

@Injectable()
export class PrismaUserRepository implements UserRepository{

    constructor( private readonly prisma: PrismaService){}

    async findById(id: string): Promise<UserEntity | null> {
        const user =await this.prisma.user.findUnique({ where : { id : id}});
        if(!user) return null;
        return new UserEntity( user.id, user.email, user.password, user.createdAt);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({ where : {email}});
        if(!user) return null;
        return new UserEntity( user.id, user.email, user.password, user.createdAt);
    }

    async create( data : { email : string, password: string}) : Promise<UserEntity>{

        try{
            const user = await this.prisma.user.create({ data });
            return new UserEntity(user.id, user.email, user.password, user.createdAt);
        }
        catch(error){
            if(error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            )
            {
                throw new ConflictException("Email Already Exists");
            }
            throw error;
        }
  
    }

    
    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({ where : {id}});
    }
}