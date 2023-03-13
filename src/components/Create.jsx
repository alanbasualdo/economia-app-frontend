import { useState, useRef } from "react"
import { useTransactionsStore } from "../hooks/useTransactionsStore"

export const Create = () => {

    const [counter, setCounter] = useState(2)
    const [checked, setChecked] = useState(false)
    const { addNewTransaction } = useTransactionsStore()
    const options = []

    for (var i = 0; i < counter; i++) {
        options.push(
            <tr key={i}>
                <td><input type="date" className="form-control form-control-sm" name={`fecha_${i}`} /></td>
                <td>
                    <select
                        className="form-select form-select-sm"
                        name={`vp_${i}`}
                        onChange={(event) => {
                            const selectedValue = event.target.value;
                            const haberInput = document.getElementsByName(`haber_${i}`)[0];
                            haberInput.disabled = selectedValue === "+A";
                        }}
                    >
                        <option defaultValue=""></option>
                        <optgroup label="Ingresos (+)">
                            <option className="text-success" value="+A">+A</option>
                            <option className="text-success" value="+RN">+RN</option>
                            <option className="text-success" value="+P">+P</option>
                            <option className="text-success" value="+PN">+PN</option>
                            <option className="text-success" value="+RP">+RP</option>
                        </optgroup>
                        <optgroup label="Egresos (-)">
                            <option className="text-danger" value="-A">-A</option>
                            <option className="text-danger" value="-RN">-RN</option>
                            <option className="text-danger" value="-P">-P</option>
                            <option className="text-danger" value="-PN">-PN</option>
                            <option className="text-danger" value="-RP">-RP</option>
                        </optgroup>
                    </select>
                    {/*  <input type="text" className="form-control form-control-sm" name={`vp_${i}`} /> */}
                </td>
                <td><input type="text" className="form-control form-control-sm" name={`detalle_${i}`} /></td>
                <td><input type="number" className="form-control form-control-sm" name={`debe_${i}`} /></td>
                <td><input type="number" className="form-control form-control-sm" name={`haber_${i}`} /></td>
            </tr>
        )
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.target);
        const data = {
            company: formData.get("company"),
            start: formData.get("start"),
        }

        for (let i = 0; i < counter; i++) {
            data[`fecha_${i}`] = formData.get(`fecha_${i}`)
            data[`vp_${i}`] = formData.get(`vp_${i}`)
            data[`detalle_${i}`] = formData.get(`detalle_${i}`)
            data[`debe_${i}`] = formData.get(`debe_${i}`)
            data[`haber_${i}`] = formData.get(`haber_${i}`)
        }

        if (
            data.fecha_0 === "" &&
            data.vp_0 === "" &&
            data.detalle_0 === "" &&
            data.debe_0 === "" &&
            data.haber_0 === "" &&
            data.fecha_1 === "" &&
            data.vp_1 === "" &&
            data.detalle_1 === "" &&
            data.debe_1 === "" &&
            data.haber_1 === ""
        ) {
            Swal.fire({
                position: "top",
                icon: "warning",
                title: "Debe rellenar al menos una fila",
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            data.totalDebe = totalDebe.toFixed(2)
            data.totalHaber = totalHaber.toFixed(2)
            addNewTransaction(data)
            event.target.reset()
            setCounter(2)
        }
    };

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

    const formRef = useRef(null)

    return (
        <div className="create p-2">
            <form onSubmit={handleSubmit} ref={formRef}>
                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text"><b>Nombre:</b></span>
                    <input type="text" className="form-control" name="company" />
                    <span className="input-group-text"><b>Inicio de actividades:</b></span>
                    <input type="date" className="form-control" name="start" />
                </div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Fecha</th>
                            <th scope="col">VP</th>
                            <th scope="col">Detalle</th>
                            <th scope="col">Debe</th>
                            <th scope="col">Haber</th>
                        </tr>
                    </thead>
                    <tbody>
                        {options}
                        <tr>
                            <td colSpan={counter === 2 ? '2' : '1'}><button className="btn btn-sm btn-outline-secondary" onClick={addRow}>Agregar fila</button></td>
                            {
                                (counter > 2) && <td><button className="btn btn-sm btn-outline-danger" onClick={subtractRow}>Eliminar última fila</button></td>
                            }
                            <td></td>
                            <td className="text-center" name="total-debe"><h5><b>${totalDebe.toFixed(2)}</b></h5></td>
                            <td className="text-center" name="total-haber"><h5><b>${totalHaber.toFixed(2)}</b></h5></td>
                        </tr>
                    </tbody>
                </table>
                <div className="input-group input-group-sm d-flex justify-content-center mb-3">
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
                    <button className="btn btn-outline-success" type="submit" disabled={!checked}>Guardar</button>
                </div>
            </form>
        </div>
    )
}