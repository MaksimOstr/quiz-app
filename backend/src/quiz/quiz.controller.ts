import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import {QuizDto, QuizSummaryDto} from "./dto/quiz-result.dto";
import {Quiz} from "../generated/prisma/client";

@Controller('/quizzes')
export class QuizController {
    constructor(private readonly quizService: QuizService) {}

    @Post()
    create(@Body() createQuizDto: CreateQuizDto): Promise<QuizDto> {
        return this.quizService.create(createQuizDto);
    }

    @Get()
    findAll(): Promise<QuizSummaryDto[]> {
        return this.quizService.findAll();
    }

    @Get('/:id')
    findOne(@Param('id') id: string): Promise<QuizDto> {
        return this.quizService.findOne(id);
    }

    @Delete('/:id')
    remove(@Param('id') id: string): Promise<Quiz> {
        return this.quizService.remove(id);
    }
}