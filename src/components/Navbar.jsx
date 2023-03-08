import { Link } from "react-router-dom"
import { useAuthStore } from "../hooks/useAuthStore"

export const Navbar = () => {

    const { startLogout } = useAuthStore()

    const logout = (e) => {
        e.preventDefault()
        Swal.fire({
            title: 'Desea salir?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                startLogout()
            }
        })
    }

    return (
        <nav className="navbar bg-dark py-3">
            <form className="container-fluid justify-content-center">
                <Link to="/" className="btn btn-sm btn-outline-success me-3" type="button">Crear registro</Link>
                <Link to="/records" className="btn btn-sm btn-outline-primary me-3" type="button">Ver registros</Link>
                <button className="btn btn-sm btn-outline-danger" type="button" onClick={(e) => logout(e)}>Salir</button>
            </form>
        </nav>
    )
}
