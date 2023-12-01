import { useState, useEffect } from "react";
import { useTransactionsStore } from "../hooks/useTransactionsStore";
import { ListaDeEmpresas } from "../components/ListaDeEmpresas";
import { Spinner } from "react-bootstrap";

export const Ledger = () => {
  const { transactions, startGetTransaction, status } = useTransactionsStore();
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  const registrosPorEmpresa = {};

  transactions.forEach((libro) => {
    const empresa = libro.data.company;

    if (!registrosPorEmpresa[empresa]) {
      registrosPorEmpresa[empresa] = {};
    }

    const detalleEntries = Object.entries(libro.data).filter(([key, value]) =>
      key.startsWith("detalle_")
    );

    detalleEntries.forEach(([key, value]) => {
      const debeKey = `debe_${key.substring(8)}`;
      const haberKey = `haber_${key.substring(8)}`;
      const debeValue = parseFloat(libro.data[debeKey]) || 0;
      const haberValue = parseFloat(libro.data[haberKey]) || 0;

      const cuenta = value;

      if (
        (debeValue !== 0 || haberValue !== 0) &&
        !registrosPorEmpresa[empresa][cuenta]
      ) {
        registrosPorEmpresa[empresa][cuenta] = [];
      }

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

  const empresas = Object.keys(registrosPorEmpresa);

  const handleEmpresaClick = (empresa) => {
    setEmpresaSeleccionada(empresa);
  };

  useEffect(() => {
    startGetTransaction();
  }, []);

  return (
    <>
      {status === "loaded" ? (
        <>
          {transactions.length === 0 ? (
            <div className="text-center mt-3">
              <h3>No hay registros que mostrar</h3>
            </div>
          ) : (
            <>
              <div className="p-4 text-center d-flex align-items-center justify-content-center flex-wrap gap-2">
                <div className="w-25">
                  <h3>Seleccionar empresa</h3>
                  <ListaDeEmpresas
                    empresas={empresas}
                    onEmpresaClick={handleEmpresaClick}
                  />
                </div>
                {empresaSeleccionada && (
                  <div className="w-75 border rounded p-3 mt-5">
                    <h3>{`Libro Mayor - ${empresaSeleccionada}`}</h3>
                    {Object.entries(
                      registrosPorEmpresa[empresaSeleccionada]
                    ).map(([cuenta, registros]) => {
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

                      const diferenciaTotal =
                        saldoType === "Saldo Deudor" ||
                        saldoType === "Saldo Acreedor"
                          ? saldoTotal
                          : 0;

                      return (
                        <div
                          key={cuenta}
                          className="py-3 border rounded w-full my-3"
                        >
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
                                    {diferenciaTotal !== 0 && (
                                      <span>: ${diferenciaTotal}</span>
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      )}
    </>
  );
};
