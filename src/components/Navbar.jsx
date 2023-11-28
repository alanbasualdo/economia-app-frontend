import { Link } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";

export const Navbar = () => {
  const { startLogout } = useAuthStore();

  const logout = () => {
    Swal.fire({
      title: "Desea salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        startLogout();
      }
    });
  };

  return (
    <nav className="navbar bg-dark py-3">
      <div className="container-fluid justify-content-center gap-2">
        <Link
          to="/"
          className="btn btn-sm btn-outline-success me-3"
          type="button"
        >
          Libro diario
        </Link>
        <Link
          to="/records"
          className="btn btn-sm btn-outline-success me-3"
          type="button"
        >
          Ver registros
        </Link>
        <Link
          to="/ledger"
          className="btn btn-sm btn-outline-warning me-3"
          type="button"
        >
          Libro mayor
        </Link>
        <Link
          to="/balancesheet"
          className="btn btn-sm btn-outline-light me-3"
          type="button"
        >
          Balance general
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          type="button"
          onClick={() => logout()}
        >
          Salir
        </button>
      </div>
    </nav>
  );
};
