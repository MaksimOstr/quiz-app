// create-quiz.dto.ts
import {IsString, IsEnum, IsBoolean, ValidateNested, IsOptional, IsArray, IsNotEmpty} from 'class-validator';
import { Type } from 'class-transformer';
import {QuestionType} from "../../generated/prisma/enums";


class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  isCorrect: boolean;
}

class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}