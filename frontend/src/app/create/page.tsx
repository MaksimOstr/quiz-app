'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, useWatch, Control } from 'react-hook-form';
import styles from './create.module.css';
import { CreateQuizDto, QuestionType } from "@/lib/types/quiz";
import { createQuiz } from "@/lib/api/api";
import OptionsEditor from "@/app/create/options-editor";
import {isAxiosError} from "axios";

const DEFAULT_OPTIONS = {
    [QuestionType.SHORT_ANSWER]: [{ text: '', isCorrect: true }],
    [QuestionType.TRUE_FALSE]: [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false },
    ],
    [QuestionType.MULTIPLE_CHOICE]: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
    ],
};

export default function CreateQuizPage() {
    const router = useRouter();
    const { control, register, handleSubmit, watch } = useForm<CreateQuizDto>({
        defaultValues: {
            title: '',
            description: '',
            questions: [],
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'questions',
    });

    const onSubmit = async (data: CreateQuizDto) => {
        try {
            await createQuiz(data);
            router.push('/quizzes');
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                const errorMessage = e.response.data.message;
                alert(errorMessage);
            } else if (e instanceof Error) {

                alert(e.message);
            }
        }
    };

    return (
        <div className="container">
            <h1 style={{marginBottom: '1.5rem'}}>Create New Quiz</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.card}>
                    <label className="label">Title</label>
                    <input className="input" {...register('title', { required: true })} />
                    <label className="label">Description</label>
                    <textarea className="textarea" rows={3} {...register('description')} />
                </div>

                {fields.map((item, index) => {
                    const currentType = watch(`questions.${index}.type`);
                    const currentText = watch(`questions.${index}.text`);

                    return (
                        <div key={item.id} className={styles.questionCard}>
                            <div className={styles.questionHeader}>
                                <h3>Question {index + 1}</h3>
                                <button type="button" onClick={() => remove(index)} className="btn btn-danger">Remove</button>
                            </div>

                            <label className="label">Question Text</label>
                            <input
                                className="input"
                                {...register(`questions.${index}.text`, { required: true })}
                            />

                            <label className="label">Type</label>
                            <select
                                className="select"
                                {...register(`questions.${index}.type`)}
                                onChange={(e) => {
                                    const newType = e.target.value as QuestionType;

                                    update(index, {
                                        text: currentText,
                                        type: newType,
                                        options: DEFAULT_OPTIONS[newType]
                                    });
                                }}
                            >
                                <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
                                <option value={QuestionType.TRUE_FALSE}>True / False</option>
                                <option value={QuestionType.SHORT_ANSWER}>Short Answer</option>
                            </select>

                            <div className={styles.optionsContainer}>
                                <label className="label" style={{marginBottom: '0.5rem'}}>Options</label>
                                <OptionsEditor nestIndex={index} control={control} type={currentType} />
                            </div>
                        </div>
                    );
                })}

                <div className={styles.actions}>
                    <button
                        type="button"
                        className="btn btn-outline"
                        style={{ width: '100%' }}
                        onClick={() => append({
                            text: '',
                            type: QuestionType.MULTIPLE_CHOICE,
                            options: DEFAULT_OPTIONS[QuestionType.MULTIPLE_CHOICE]
                        })}
                    >
                        + Add Question
                    </button>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Save Quiz
                    </button>
                </div>
            </form>
        </div>
    );
}