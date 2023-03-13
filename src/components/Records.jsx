import { useEffect, useState } from "react"
import { useTransactionsStore } from "../hooks/useTransactionsStore"
import { Modal, Button, Spinner } from "react-bootstrap"
import Table from 'react-bootstrap/Table'

export const Records = () => {
  const { startGetTransaction, transactions, status } = useTransactionsStore()
  const [showModal, setShowModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  useEffect(() => {
    startGetTransaction()
  }, [])

  console.log(transactions)

  return (
    <>
      {status === 'loaded'
        ? <>{
          transactions.length === 0 ? (
            <div className="text-center mt-3">
              <h3>No hay registros que mostrar</h3>
            </div>
          ) : (
            <div className="m-3">
              {transactions.map((m) => (
                <div className="list-group" key={m.id}>
                  <a
                    href="#"
                    onClick={() => {
                      setShowModal(true)
                      setSelectedTransaction(m)
                    }}
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  >
                    {/* <span className="mr-2">Registro: {m.id}</span> */}
                    <span className="mr-2">{m.data.company}</span>
                    {/* <span className="mr-2">Actividad: {new Date(m.data.start).toLocaleDateString("es-AR")}</span> */}
                    <span>{m.createdAt}</span>
                  </a>
                </div>
              ))}
              <Modal show={showModal} onHide={() => setShowModal(false)} size='lg'>
                <Modal.Header closeButton>
                  <Modal.Title>Detalles de la operación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedTransaction && (
                    <>
                      <div className="text-center">
                        <h5>{selectedTransaction.data.company}</h5>
                        <p>Inicio de actividad: {
                          selectedTransaction.data.start && !isNaN(Date.parse(selectedTransaction.data.start)) ?
                            new Date(selectedTransaction.data.start).toLocaleDateString("es-AR") :
                            selectedTransaction.data.start
                        }
                        </p>
                      </div>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>VP</th>
                            <th>Detalle</th>
                            <th>Debe</th>
                            <th>Haber</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(selectedTransaction.data).map((key) => (
                            key.startsWith("fecha") && (
                              <tr key={key}>
                                <td>
                                  {selectedTransaction.data[key] && !isNaN(Date.parse(selectedTransaction.data[key])) ?
                                    new Date(selectedTransaction.data[key]).toLocaleDateString("es-AR") :
                                    selectedTransaction.data[key]
                                  }
                                </td>
                                <td>
                                  {selectedTransaction.data[`vp_${key.slice(-1)}`]}
                                </td>
                                <td>{selectedTransaction.data[`detalle_${key.slice(-1)}`]}</td>
                                <td>
                                  {selectedTransaction.data[`debe_${key.slice(-1)}`] ? (
                                    `$${selectedTransaction.data[`debe_${key.slice(-1)}`]}`
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td>
                                  {selectedTransaction.data[`haber_${key.slice(-1)}`] ? (
                                    `$${selectedTransaction.data[`haber_${key.slice(-1)}`]}`
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            )
                          ))}
                          <tr>
                            <td></td>
                            <td></td>
                            <td>Total:</td>
                            <td>
                              {selectedTransaction.data.totalDebe ? (
                                `$${selectedTransaction.data.totalDebe}`
                              ) : (
                                ""
                              )}
                            </td>
                            <td>
                              {selectedTransaction.data.totalHaber ? (
                                `$${selectedTransaction.data.totalHaber}`
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cerrar
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          )
        }
        </>
        : <div className='text-center mt-5'><Spinner animation="border" /></div>
      }
    </>
  );
}