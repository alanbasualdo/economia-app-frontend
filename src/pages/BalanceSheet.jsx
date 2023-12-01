import { useEffect, useState } from "react";
import { useTransactionsStore } from "../hooks/useTransactionsStore";
import { ListaDeEmpresas } from "../components/ListaDeEmpresas";
import { Spinner } from "react-bootstrap";

export const BalanceSheet = () => {
  const { transactions, startGetTransaction, status } = useTransactionsStore();

  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [registrosPorEmpresa, setRegistrosPorEmpresa] = useState({});

  useEffect(() => {
    const registros = {};

    transactions.forEach((libro) => {
      const empresa = libro.data.company;

      if (!registros[empresa]) {
        registros[empresa] = {};
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
          !registros[empresa][cuenta]
        ) {
          registros[empresa][cuenta] = [];
        }

        if (debeValue !== 0 || haberValue !== 0) {
          registros[empresa][cuenta].push({
            id: libro._id,
            fecha: libro.data[`fecha_${key.substring(8)}`],
            detalle: value,
            debe: debeValue,
            haber: haberValue,
          });
        }
      });
    });

    setRegistrosPorEmpresa(registros);
  }, [transactions]);

  useEffect(() => {
    startGetTransaction();
  }, []);

  const empresas = Object.keys(registrosPorEmpresa);

  const handleEmpresaClick = (empresa) => {
    setEmpresaSeleccionada(empresa);
  };

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
                    <h3>{`Balance - ${empresaSeleccionada}`}</h3>
                    <div className="table-responsive">
                      <table className="table table-striped table-hover table-sm">
                        <thead>
                          <tr>
                            <th scope="col">Cuenta</th>
                            <th scope="col">Debe</th>
                            <th scope="col">Haber</th>
                          </tr>
                        </thead>
                        <tbody>
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

                            return (
                              <tr key={cuenta}>
                                <td>{cuenta}</td>
                                <td>{totalDebe}</td>
                                <td>{totalHaber}</td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td>
                              <b>Total</b>
                            </td>
                            <td>
                              <b>
                                {Object.values(
                                  registrosPorEmpresa[empresaSeleccionada]
                                ).reduce(
                                  (totalDebe, registros) =>
                                    totalDebe +
                                    registros.reduce(
                                      (total, registro) =>
                                        total + registro.debe,
                                      0
                                    ),
                                  0
                                )}
                              </b>
                            </td>
                            <td>
                              <b>
                                {Object.values(
                                  registrosPorEmpresa[empresaSeleccionada]
                                ).reduce(
                                  (totalHaber, registros) =>
                                    totalHaber +
                                    registros.reduce(
                                      (total, registro) =>
                                        total + registro.haber,
                                      0
                                    ),
                                  0
                                )}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
