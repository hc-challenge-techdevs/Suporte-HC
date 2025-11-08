import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useForm, type SubmitHandler } from "react-hook-form";
import React from 'react';
import {
    listarLembretesPorUsuario,
    criarLembrete,
    atualizarLembrete,
    excluirLembrete,
} from "../../services/apiService";
import type { LembreteTO, UsuarioTO } from "../../types/api";
import type { LembreteFormData } from "../../types/forms";

const getLocalSessionData = (): UsuarioTO | null => {
    const storedData = localStorage.getItem('session_user_data');
    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            if (data.idUsuario && typeof data.idUsuario === 'number') {
                return data as UsuarioTO;
            }
        } catch (error) {
            console.error("Erro ao fazer parse dos dados da sessão:", error);
        }
    }
    return null;
};

type CalendarValue = Date | Date[] | null;

export default function Lembretes() {
    const navigate = useNavigate();
    const [lembretes, setLembretes] = useState<LembreteTO[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [editingLembrete, setEditingLembrete] = useState<LembreteTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [calendarValue, setCalendarValue] = useState<CalendarValue>(new Date());

    const idUsuarioLogado = getLocalSessionData()?.idUsuario;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<LembreteFormData>();

    const fetchLembretes = async () => {
        const idUsuario = getLocalSessionData()?.idUsuario;

        if (!idUsuario) {
            setLembretes([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setApiError(null);
        try {
            const data = await listarLembretesPorUsuario(idUsuario);

            const lembretesComDatas = data.map((l) => ({
                ...l,
                dateConsulta: new Date(l.dateConsulta),
            }));

            setLembretes(lembretesComDatas as LembreteTO[]);
        } catch (err) {
            setApiError("Falha ao carregar lembretes do servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!idUsuarioLogado) {
            alert("Você precisa estar logado para acessar esta página.");
            navigate("/login");
            return;
        }
        fetchLembretes();
    }, [idUsuarioLogado, navigate]);

    const handleCreateOrUpdate: SubmitHandler<LembreteFormData> = async (formData) => {
        if (!selectedDate || !idUsuarioLogado) {
            alert("Selecione uma data e faça login.");
            return;
        }

        setIsSubmitting(true);

        const [hour, minute] = formData.hora.split(':');
        const finalDate = new Date(selectedDate);
        finalDate.setHours(Number(hour));
        finalDate.setMinutes(Number(minute));
        finalDate.setSeconds(0);
        finalDate.setMilliseconds(0);

        const year = finalDate.getFullYear();
        const month = String(finalDate.getMonth() + 1).padStart(2, '0');
        const day = String(finalDate.getDate()).padStart(2, '0');
        const hourPadded = String(Number(hour)).padStart(2, '0');
        const minutePadded = String(Number(minute)).padStart(2, '0');
        const isoString = `${year}-${month}-${day}T${hourPadded}:${minutePadded}:00`;

        const payload = {
            idUsuario: idUsuarioLogado,
            dateConsulta: isoString,
            nomeMedico: formData.nomeMedico,
            tipoConsulta: formData.tipo,
            observacao: formData.observacao,
        };

        setApiError(null);
        try {
            let result: LembreteTO | null = null;
            let successMessage = "";

            if (editingLembrete) {
                const idLembrete = editingLembrete.idLembrete;
                result = await atualizarLembrete(idLembrete!, { ...payload, idLembrete: idLembrete! } as LembreteTO);
                successMessage = "Lembrete editado com sucesso!";
            } else {
                result = await criarLembrete(payload as LembreteTO);
                successMessage = "Lembrete criado com sucesso!";
            }

            if (result) {
                alert(successMessage);
                fetchLembretes();
                reset();
                setSelectedDate(null);
                setEditingLembrete(null);
            } else {
                setApiError("Falha ao salvar lembrete. Conflito de horário ou horário fora do expediente (08:00-18:00).");
            }

        } catch (error) {
            setApiError("Falha na comunicação ao salvar lembrete.");
            console.error("Erro no CRUD:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (idLembrete: number) => {
        if (!window.confirm("Tem certeza que deseja excluir este lembrete?")) {
            return;
        }

        setIsSubmitting(true);
        setApiError(null);
        try {
            const sucesso = await excluirLembrete(idLembrete);

            if (sucesso) {
                alert("Lembrete excluído com sucesso!");
            } else {
                setApiError("Falha ao excluir lembrete. Registro não encontrado.");
            }

            if (editingLembrete && editingLembrete.idLembrete === idLembrete) {
                setEditingLembrete(null);
                reset();
            }

            fetchLembretes();
        } catch (error) {
            setApiError("Falha na comunicação ao excluir lembrete.");
            console.error("Erro ao excluir:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDateChange = (value: CalendarValue, _event: React.MouseEvent<HTMLButtonElement>) => {
        if (!idUsuarioLogado) {
            alert("Faça login para cadastrar um novo lembrete.");
            navigate("/login");
            return;
        }

        if (value instanceof Date && !Array.isArray(value)) {
            setCalendarValue(value);
            setSelectedDate(value);
            setEditingLembrete(null);
            reset();
        } else if (value === null) {
            setCalendarValue(new Date());
            setSelectedDate(null);
            setEditingLembrete(null);
        }
    };

    const handleEditClick = (lembrete: LembreteTO) => {
        setEditingLembrete(lembrete);
        setSelectedDate(new Date(lembrete.dateConsulta as Date));

        setValue('nomeMedico', lembrete.nomeMedico);
        setValue('tipo', lembrete.tipoConsulta);
        setValue('observacao', lembrete.observacao);

        const time = new Date(lembrete.dateConsulta as Date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        setValue('hora', time);
    };

    const lembretesDoDia = selectedDate
        ? lembretes.filter(
            (l: LembreteTO) => (l.dateConsulta as Date).toDateString() === selectedDate.toDateString()
        )
        : [];

    const tileClassName = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const hasLembrete = lembretes.some(
                (l: LembreteTO) => (l.dateConsulta as Date).toDateString() === date.toDateString()
            );
            return hasLembrete ? 'highlight-date' : null;
        }
        return null;
    };

    if (isLoading) {
        return <div className="lembretes-page ">Carregando lembretes...</div>;
    }

    if (!idUsuarioLogado) {
        return <div className="lembretes-page">Redirecionando para o login...</div>;
    }

    return (
        <div className="lembretes-page">
            <h1 className="lembretes-titulo">Meus Lembretes e Consultas</h1>

            {apiError && <div className="lembretes-error" role="alert">{apiError}</div>}

            <div className="lembretes">

                <div className="lembretes-calendario">
                    <div className="lembretes-dois  ">
                        <Calendar
                            onChange={handleDateChange}
                            value={calendarValue}
                            tileClassName={tileClassName}
                            className="lembretes-tres"
                        />
                    </div>
                </div>

                {selectedDate && (
                    <div className="lembretes-criar">
                        <>
                            <div className="lembretes-criar-dois">
                                <h2 className="lembretes-criar-tres">
                                    {editingLembrete ? `Editar Lembrete # ${editingLembrete.idLembrete}` : "Novo Lembrete"} em {selectedDate.toLocaleDateString()}
                                </h2>

                                <form onSubmit={handleSubmit(handleCreateOrUpdate)} className="formulario-lembrete">
                                    <div>
                                        <label className="lembrete-hora">Hora</label>
                                        <input
                                            type="time"
                                            {...register("hora", { required: "A hora é obrigatória" })}
                                            className="lembrete-hora-input"
                                            disabled={isSubmitting}
                                        />
                                        {errors.hora && (<p className="lembrete-hora-error">{errors.hora.message}</p>)}
                                    </div>

                                    <div>
                                        <label className="lembrete-medico">Médico</label>
                                        <input
                                            type="text"
                                            {...register("nomeMedico", { required: "O nome do médico é obrigatório" })}
                                            className="lembrete-medico-input"
                                            disabled={isSubmitting}
                                        />
                                        {errors.nomeMedico && (<p className="lembrete-medico-error">{errors.nomeMedico.message}</p>)}
                                    </div>

                                    <div>
                                        <label className="lembrete-tipo-consulta">Tipo de Consulta</label>
                                        <select
                                            {...register("tipo", { required: "O tipo é obrigatório" })}
                                            className="lembrete-escolha-tipo"
                                            defaultValue={editingLembrete?.tipoConsulta || ""}
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Selecione um tipo</option>
                                            <option value="Consulta">Consulta</option>
                                            <option value="Exame">Exame</option>
                                            <option value="Vacina">Vacina</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                        {errors.tipo && (<p className="lembrete-tipo-consulta-error">{errors.tipo.message}</p>)}
                                    </div>

                                    <div>
                                        <label className="lembrete-observacao">Observação (Opcional)</label>
                                        <textarea
                                            {...register("observacao")}
                                            className="=lembrete-caixa-observacao"
                                            defaultValue={editingLembrete?.observacao || ""}
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="lembrete-btn">
                                        <button
                                            type="submit"
                                            className="lembrete-salvar-edicao"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Aguarde..." : editingLembrete ? "Salvar Edição" : "Criar Lembrete"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => { setEditingLembrete(null); setSelectedDate(null); reset(); }}
                                            className="lembrete-btn-cancelar-edicao"
                                            disabled={isSubmitting}
                                        >
                                            Cancelar
                                        </button>
                                    </div>

                                </form>
                            </div>

                            {lembretesDoDia.length > 0 && (
                                <div className="lembrete-dia">
                                    <h3 className="lembrete-titulo-dia">Lembretes para {selectedDate.toLocaleDateString()}</h3>

                                    <div className="lembrete-caixa">
                                        {lembretesDoDia.map((lembrete) => (
                                            <div key={lembrete.idLembrete} className="lembrete-caixa-dia">
                                                <div>
                                                    <p className="lembrete-hora-tipo">
                                                        {new Date(lembrete.dateConsulta as Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {lembrete.tipoConsulta}
                                                    </p>
                                                    <p className="lembrete-dia-medico">Médico: {lembrete.nomeMedico}</p>
                                                    <p className="lembrete-dia-observacao">Obs: {lembrete.observacao || 'N/A'}</p>
                                                </div>

                                                <div className="lembrete-dia-btn">
                                                    <button
                                                        onClick={() => handleEditClick(lembrete)}
                                                        className="btn-editar-lembrete"
                                                        disabled={isSubmitting}
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(lembrete.idLembrete!)}
                                                        className="btn-excluir-lembrete"
                                                        disabled={isSubmitting}
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>

                                            </div>
                                        ))}
                                    </div>

                                </div>
                            )}

                            {lembretesDoDia.length === 0 && !editingLembrete && (
                                <p className="titulo-nenhum-lembrete">Nenhum lembrete agendado para esta data. Crie um acima!</p>
                            )}

                        </>
                    </div>
                )}

                <div className="caixa-lembrete">
                    <h2 className="titulo-lembretes-agendados">Próximos Lembretes Agendados</h2>

                    {lembretes.length === 0 ? (
                        <p className="nenhum-lembrete-cadastrado">Nenhum lembrete cadastrado até o momento.</p>
                    ) : (
                        <div className="caixa-lembrete-proximo">
                            {lembretes
                                .filter(l => new Date(l.dateConsulta as Date).getTime() >= new Date().getTime())
                                .sort((a, b) => new Date(a.dateConsulta as Date).getTime() - new Date(b.dateConsulta as Date).getTime())
                                .map((lembrete) => (
                                    <div key={lembrete.idLembrete} className="caixa-lembrete-id">
                                        <div>
                                            <p className="titulo-data-hora">
                                                {new Date(lembrete.dateConsulta as Date).toLocaleDateString()} às {new Date(lembrete.dateConsulta as Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="titulo-tipo-medico">Tipo: {lembrete.tipoConsulta} | Médico: {lembrete.nomeMedico}</p>
                                            <p className="titulo-observacao">Obs: {lembrete.observacao || 'N/A'}</p>
                                        </div>

                                        <div className="proximo-btn">
                                            <button
                                                onClick={() => handleEditClick(lembrete)}
                                                className="proximo-btn-editar"
                                                disabled={isSubmitting}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => handleDelete(lembrete.idLembrete!)}
                                                className="proximo-btn-excluir"
                                                disabled={isSubmitting}
                                            >
                                                Excluir
                                            </button>
                                        </div>

                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}