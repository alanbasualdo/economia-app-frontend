export const ListaDeEmpresas = ({ empresas, onEmpresaClick }) => (
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
