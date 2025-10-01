import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Consulta {
    data: Date;
    hora: string;
    medico: string;
    tipo: string;
    lembrete?: boolean;
    observacao: string;
}

export default function Lembretes() {
    const [value, setValue] = useState<Date | [Date, Date]>(new Date());
    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<Consulta>();

    const handleDateChange = (date: Date | [Date, Date]) => {
        if (date instanceof Date) {
            setValue(date);
            setSelectedDate(date);
            reset({
                data: date,
                hora: '',
                medico: '',
                tipo: '',
                observacao: '',
            });
        }
    };

    const onSubmit: SubmitHandler<Consulta> = (data) => {
        const newConsulta = {
            ...data,
            data: selectedDate as Date,
        };
        setConsultas((prev) => [...prev, newConsulta]);
        setSelectedDate(null);
        reset();
    };

    return (
        <div className="lembretes-page">
            <h1>Escolha uma data para o lembrete</h1>

            <Calendar
                onChange={handleDateChange}
                value={value}
                tileClassName={({ date, view }) =>
                    view === "month" &&
                        consultas.some((c) => c.data.toDateString() === date.toDateString())
                        ? "consulta-marcada"
                        : null
                }
            />

            {selectedDate && (
                <form onSubmit={handleSubmit(onSubmit)} className="form">
                    <h2>Nova consulta em {selectedDate.toLocaleDateString()}</h2>

                    <label>
                        Hora:
                        <input
                            type="time"
                            {...register("hora", { required: "A hora é obrigatória" })}
                        />
                        {errors.hora && <span className="error">{errors.hora.message}</span>}
                    </label>

                    <label>
                        Médico:
                        <input
                            type="text"
                            {...register("medico", { required: "O nome do médico é obrigatório" })}
                            placeholder="Dr. Andrei, Dra. Isabela..."
                        />
                        {errors.medico && <span className="error">{errors.medico.message}</span>}
                    </label>

                    <label>
                        Tipo de consulta:
                        <input
                            type="text"
                            {...register("tipo", { required: "O tipo de consulta é obrigatório" })}
                            placeholder="Cardiologista, Clínico geral..."
                        />
                        {errors.tipo && <span className="error">{errors.tipo.message}</span>}
                    </label>

                    <label>
                        Observação:
                        <textarea
                            {...register("observacao")}
                            placeholder="Retorno, Exame..."
                        />
                    </label>
                    <button type="submit">Salvar</button>
                </form>
            )}

            <h2 className="lista-titulo">Consultas marcadas:</h2>
            <ul className="lista">
                {consultas.map((c, i) => (
                    <li key={i}>
                        {c.data.toLocaleDateString()} - {c.hora} | {c.medico} ({c.tipo}) <br />
                        Obs: {c.observacao}
                    </li>
                ))}
            </ul>
        </div>
    );
}
