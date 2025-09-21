import { useState, useEffect } from "react";
import AddNewExpense from "../components/AddNewExpense";

// Helpers ---------
const loadTx = () => {
  try {
    return JSON.parse(localStorage.getItem("transactions") ?? "[]");
  } catch {
    return [];
  }
};

const formatCurrency = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const formatDate = (ymd) => {
  // ymd esperado: "YYYY-MM-DD"
  if (!ymd) return "";
  // Forzamos medianoche local para evitar desfases por zona horaria
  return new Date(`${ymd}T00:00:00`).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};
// -----------------

function Transactions() {
  const [transactions, setTransactions] = useState(loadTx);

  // Persistencia
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleAddExpense = (tx) => {
    const id = crypto.randomUUID?.() ?? Date.now();
    setTransactions((prev) => [{ ...tx, id }, ...prev]);
  };

  const labelByCategory = {
    food: "Comida",
    transport: "Transporte",
    entertainment: "Entretenimiento",
    delivery: "Delivery App",
    ridehail: "Transport App",
    necessary: "Necesario",
  };

  const total = transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  return (
    <div className="container" style={{ backgroundColor: "#965fd4" }}>
      <h2 className="mb-3 d-flex justify-content-between align-items-center">
        <span>Transactions</span>
        <span className="badge bg-success">Total: {formatCurrency(total)}</span>
      </h2>

      {transactions.length === 0 ? (
        <div className="alert alert-light border" role="alert">
          No tienes transacciones aún. Usa el botón ➕ para agregar tu primer gasto.
        </div>
      ) : (
        <ul className="list-group">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{labelByCategory[tx.category] || tx.category}</strong> — {tx.description}
                <div className="text-muted" style={{ fontSize: "12px" }}>
                  {formatDate(tx.date)}
                </div>
              </div>
              <span className="badge bg-primary rounded-pill">
                {formatCurrency(tx.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <AddNewExpense onAdd={handleAddExpense} />
    </div>
  );
}

export default Transactions;
