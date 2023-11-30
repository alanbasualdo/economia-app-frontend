import React, { useState, useEffect } from "react";
import { useTransactionsStore } from "../hooks/useTransactionsStore";

const EmpresasList = ({ empresas, onEmpresaClick }) => (
  <div className="list-group">
    {empresas.map((empresa) => (
      <button
        key={empresa}
        type="button"
        className="list-group-item list-group-item-action"
        onClick={() => onEmpresaClick(empresa)}
      >
        {empresa}
      </button>
    ))}
  </div>
);

export const Ledger = () => {
  const { transactions, startGetTransaction } = useTransactionsStore();

  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  // Crear un objeto para almacenar registros agrupados por empresa y luego por cuenta
  const registrosPorEmpresa = {};

  transactions.forEach((libro) => {
    const empresa = libro.data.company; // Obtener el valor de la empresa de la transacción

    if (!registrosPorEmpresa[empresa]) {
      registrosPorEmpresa[empresa] = {};
    }

    const detalleEntries = Object.entries(libro.data).filter(([key, value]) =>
      key.startsWith("detalle_")
    );

    detalleEntries.forEach(([key, value]) => {
      // Almacenar el debe y haber para cada valor en detalle_
      const debeKey = `debe_${key.substring(8)}`;
      const haberKey = `haber_${key.substring(8)}`;
      const debeValue = parseFloat(libro.data[debeKey]) || 0;
      const haberValue = parseFloat(libro.data[haberKey]) || 0;

      const cuenta = value;

      // Verificar si tanto el debe como el haber son diferentes de 0 antes de agregar el registro
      if (
        (debeValue !== 0 || haberValue !== 0) &&
        !registrosPorEmpresa[empresa][cuenta]
      ) {
        registrosPorEmpresa[empresa][cuenta] = [];
      }

      // Agregar el registro solo si alguno de los valores es diferente de 0
      if (debeValue !== 0 || haberValue !== 0) {
        registrosPorEmpresa[empresa][cuenta].push({
          id: libro._id,
          fecha: libro.data[`fecha_${key.substring(8)}`],
          detalle: value,
          debe: debeValue,
          haber: haberValue,
        });
      }
    });
  });

  useEffect(() => {
    startGetTransaction();
  }, []);

  const empresas = Object.keys(registrosPorEmpresa);

  const handleEmpresaClick = (empresa) => {
    setEmpresaSeleccionada(empresa);
  };

  return (
    <div className="p-4 text-center d-flex align-items-center justify-content-center flex-wrap gap-2">
      <div className="w-25">
        <h3>Seleccionar empresa</h3>
        <EmpresasList empresas={empresas} onEmpresaClick={handleEmpresaClick} />
      </div>
      {empresaSeleccionada && (
        <div className="w-75 border rounded p-3 mt-5">
          <h3>{`Libro Mayor - ${empresaSeleccionada}`}</h3>
          {Object.entries(registrosPorEmpresa[empresaSeleccionada]).map(
            ([cuenta, registros]) => {
              const totalDebe = registros.reduce(
                (total, registro) => total + registro.debe,
                0
              );
              const totalHaber = registros.reduce(
                (total, registro) => total + registro.haber,
                0
              );
              const saldoTotal = totalDebe - totalHaber;

              const saldoType =
                saldoTotal > 0
                  ? "Saldo Deudor"
                  : saldoTotal < 0
                  ? "Saldo Acreedor"
                  : "Saldo Cero";

              const registrosReversed = [...registros].reverse();

              return (
                <div key={cuenta} className="py-3 border rounded w-full my-3">
                  <h4>{cuenta}</h4>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover table-sm">
                      <thead>
                        <tr>
                          <th scope="col">Fecha</th>
                          <th scope="col">Debe</th>
                          <th scope="col">Haber</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrosReversed.map((registro, index) => (
                          <tr key={index}>
                            <td>{registro.fecha}</td>
                            <td>{registro.debe}</td>
                            <td>{registro.haber}</td>
                          </tr>
                        ))}
                        <tr>
                          <td>
                            <b>Total</b>
                          </td>
                          <td>{totalDebe}</td>
                          <td>{totalHaber}</td>
                        </tr>
                        <tr>
                          <td colSpan="3">
                            <b>{saldoType}</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};
