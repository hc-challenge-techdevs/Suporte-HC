interface CalendarioProps {
  mes: string;
  diasNoMes: number;
  primeiroDiaSemana?: number;
}

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Calendario({
  mes,
  diasNoMes,
  primeiroDiaSemana = 0,
}: CalendarioProps) {
  const dias = Array.from({ length: diasNoMes + primeiroDiaSemana }, (_, i) =>
    i < primeiroDiaSemana ? null : i - primeiroDiaSemana + 1
  );

  return (
    <div className="calendario">
      <h2>{mes}</h2>
      <div className="dias-semana">
        {diasSemana.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="dias">
        {dias.map((d, i) => (
          <div key={i}>{d !== null ? d : "."}</div>
        ))}
      </div>
    </div>
  );
}
