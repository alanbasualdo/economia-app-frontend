import { useState } from "react"
import { useTransactionsStore } from "../hooks/useTransactionsStore"

export const Create = () => {

    const [counter, setCounter] = useState(1)
    const [checked, setChecked] = useState(false)
    const { addNewTransaction } = useTransactionsStore()
    const options = []

    for (var i = 0; i < counter; i++) {
        options.push(
            <tr key={i}>
                <th scope="row"><input type="number" className="form-control" name={`cod_cuenta_${i}`} /></th>
                <td><input type="text" className="form-control" name={`cuenta_${i}`} /></td>
                <td><input type="number" className="form-control" name={`debe_${i}`} /></td>
                <td><input type="number" className="form-control" name={`haber_${i}`} /></td>
            </tr>
        )
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const data = {};
        for (let i = 0; i < counter; i++) {
            data[`cod_cuenta_${i}`] = formData.get(`cod_cuenta_${i}`);
            data[`cuenta_${i}`] = formData.get(`cuenta_${i}`);
            data[`debe_${i}`] = formData.get(`debe_${i}`);
            data[`haber_${i}`] = formData.get(`haber_${i}`);
        }
        if (data.cod_cuenta_0 === '' && data.cuenta_0 === '' && data.debe_0 === '' && data.haber_0 === '') {
            console.log('vacio')
        } else {
            addNewTransaction(data)
        }
    }

    const subtractRow = (e) => {
        e.preventDefault()
        setCounter(counter - 1)
    }

    const addRow = (e) => {
        e.preventDefault()
        setCounter(counter + 1)
    }

    const toggleCheck = () => {
        setChecked(!checked)
    }

    const totalDebe = Array.from(document.querySelectorAll('input[name^="debe_"]'))
        .reduce((total, input) => total + Number(input.value), 0)

    const totalHaber = Array.from(document.querySelectorAll('input[name^="haber_"]'))
        .reduce((total, input) => total + Number(input.value), 0)

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <table className="table table-hover">
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
                            <td colSpan={counter === 1 ? '2' : '1'}><button className="btn btn-outline-secondary" onClick={addRow}>Agregar fila</button></td>
                            {
                                (counter > 1) && <td><button className="btn btn-outline-danger" onClick={subtractRow}>Eliminar última fila</button></td>
                            }
                            <td className="text-center" name="total-debe"><h5><b>${totalDebe.toFixed(2)}</b></h5></td>
                            <td className="text-center" name="total-haber"><h5><b>${totalHaber.toFixed(2)}</b></h5></td>
                        </tr>
                    </tbody>
                </table>
                <div className="input-group input-group-sm justify-content-end">
                    <span className="input-group-text">
                        <div className="form-check form-switch mt-1">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                onChange={toggleCheck}
                            />
                        </div>
                    </span>
                    <button className="btn btn-outline-success me-3" type="submit" disabled={!checked}>Guardar</button>
                </div>
            </form>
        </div>
    )
}