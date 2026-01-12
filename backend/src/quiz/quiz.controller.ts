import {Controller} from "@nestjs/common";
import {QuizService} from "./quiz.service";

@Controller("/quizzes")
export class QuizController {
    constructor(private quizService: QuizService) {}


}