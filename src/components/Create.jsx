import { useState } from "react"

export const Create = () => {

    const [counter, setCounter] = useState(1)

    const options = []

    for (var i = 0; i < counter; i++) {
        options.push(
            <tr key={i}>
                <th scope="row"><input type="number" className="form-control" /></th>
                <td><input type="text" className="form-control" /></td>
                <td><input type="number" className="form-control" /></td>
                <td><input type="number" className="form-control" /></td>
            </tr>
        )
    }

    const subtractRow = (e) => {
        e.preventDefault()
        setCounter(counter - 1)
    }

    const addRow = (e) => {
        e.preventDefault()
        setCounter(counter + 1)
    }

    return (
        <div>
            <form>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Cod Cuenta</th>
                            <th scope="col">Cuenta</th>
                            <th scope="col">Debe</th>
                            <th scope="col">Haber</th>
                        </tr>
                    </thead>
                    <tbody>
                        {options}
                        <tr>
                            {
                                (counter > 1) && <td><button className="btn btn-outline-danger" onClick={subtractRow}>Eliminar última fila</button></td>
                            }

                            <td colSpan={counter === 1 ? '2' : '1'}><button className="btn btn-outline-secondary" onClick={addRow}>Agregar fila</button></td>
                            <td className="text-center"><h5>Total: <b>$125125</b></h5></td>
                            <td className="text-center"><h5>Total: <b>$125125</b></h5></td>
                        </tr>
                    </tbody>
                </table>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-outline-danger me-3">Cancelar</button>
                    <button className="btn btn-outline-success" type="submit">Guardar</button>
                </div>
            </form>
        </div>
    )
}
