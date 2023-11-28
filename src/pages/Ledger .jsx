import React, { useEffect } from "react";
import { useTransactionsStore } from "../hooks/useTransactionsStore";

export const Ledger = () => {
  const { transactions, startGetTransaction } = useTransactionsStore();

  // Crear un objeto para almacenar registros agrupados por nombre de cuenta
  const registrosPorCuenta = {};

  transactions.forEach((libro) => {
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
        !registrosPorCuenta[cuenta]
      ) {
        registrosPorCuenta[cuenta] = [];
      }

      // Agregar el registro solo si alguno de los valores es diferente de 0
      if (debeValue !== 0 || haberValue !== 0) {
        registrosPorCuenta[cuenta].push({
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

  return (
    <div className="p-4 text-center">
      {Object.entries(registrosPorCuenta).map(([cuenta, registros]) => {
        const totalDebe = registros.reduce(
          (total, registro) => total + registro.debe,
          0
        );
        const totalHaber = registros.reduce(
          (total, registro) => total + registro.haber,
          0
        );
        const registrosReversed = [...registros].reverse();
        return (
          <div key={cuenta} className="py-3 border rounded w-50 my-2">
            <h2>{cuenta}</h2>
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
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
