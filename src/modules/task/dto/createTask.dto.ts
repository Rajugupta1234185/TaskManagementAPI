import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto{

    @MaxLength(200, { message : "Title must not exceed 2000 characters"})
    @MinLength(4,{ message :"Title must be longer than or equal to 4 characters"})
    @IsString()
    @IsNotEmpty({ message : "title is required"})
    title !: string;


    @MaxLength(2000, { message : "Description must not exceed 2000 characters"})
    @IsString()
    @IsOptional()
    description !: string;

    @IsOptional()
    isCompleted !: boolean;
}