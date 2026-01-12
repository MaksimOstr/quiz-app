import {Module} from "@nestjs/common";
import {QuizController} from "./quiz.controller";
import {QuizService} from "./quiz.service";
import {PrismaService} from "../prisma/prisma.service";

@Module({
    imports: [PrismaService],
    controllers: [QuizController],
    providers: [QuizService],
})
export class QuizModule {}