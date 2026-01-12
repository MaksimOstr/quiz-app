import {Control, useFieldArray} from "react-hook-form";
import {CreateQuizDto, QuestionType} from "@/lib/types/quiz";
import styles from "@/app/create/create.module.css";

export default function OptionsEditor({ nestIndex, control, type }: { nestIndex: number; control: Control<CreateQuizDto>; type: QuestionType }) {
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: `questions.${nestIndex}.options`,
    });

    if (type === QuestionType.SHORT_ANSWER) {
        return (
            <div>
                <input
                    className="input"
                    {...control.register(`questions.${nestIndex}.options.0.text`, { required: true })}
                    placeholder="Correct answer"
                />
                <input type="hidden" {...control.register(`questions.${nestIndex}.options.0.isCorrect`)} value="true" />
            </div>
        );
    }

    if (type === QuestionType.TRUE_FALSE) {
        return (
            <div className={styles.tfGrid}>
                {fields.map((field, k) => (
                    <div key={field.id} className={styles.optionRow}>
                        <input
                            type="radio"
                            name={`q-${nestIndex}-correct`}
                            defaultChecked={field.isCorrect}
                            onChange={() => {
                                fields.forEach((_, idx) => {
                                    update(idx, { ...fields[idx], isCorrect: idx === k });
                                });
                            }}
                        />
                        <span>{field.text}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            {fields.map((item, k) => (
                <div key={item.id} className={styles.optionRow}>
                    <input
                        type="checkbox"
                        {...control.register(`questions.${nestIndex}.options.${k}.isCorrect`)}
                    />
                    <input
                        className="input"
                        style={{marginBottom: 0}}
                        {...control.register(`questions.${nestIndex}.options.${k}.text`, { required: true })}
                        placeholder={`Option ${k + 1}`}
                    />
                    <button type="button" onClick={() => remove(k)} className={styles.removeBtn}>&times;</button>
                </div>
            ))}
            <button
                type="button"
                className={styles.addOptionBtn}
                onClick={() => append({ text: '', isCorrect: false })}
            >
                + Add Option
            </button>
        </div>
    );
}