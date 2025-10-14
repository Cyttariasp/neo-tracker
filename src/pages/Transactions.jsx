import { useState, useEffect } from "react";
import AddNewExpense from "../components/AddNewExpense";
import CategoryBadge from "../components/CategoryBadge";
import { Trash2 } from 'lucide-react';

// Helpers -----------------
const loadTx = () => {
    try { return JSON.parse(localStorage.getItem("transactions") ?? "[]"); }
    catch { return []; }
};

const formatCurrency = (n) =>
    new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(Number(n) || 0);

const formatDate = (ymd) =>
    ymd
        ? new Date(`${ymd}T00:00:00`).toLocaleDateString("es-CL", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        })
        : "";

const labelByCategory = {
    food: "Comida",
    transport: "Transporte",
    entertainment: "Entretenimiento",
    delivery: "Delivery App",
    ridehail: "Transport App",
    necessary: "Necesario",
};

function Transactions() {
    const [transactions, setTransactions] = useState(loadTx);

    // Persistencia en localStorage
    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions]);

    const handleAddExpense = (tx) => {
        const id = crypto.randomUUID?.() ?? Date.now();
        setTransactions((prev) => [{ ...tx, id }, ...prev]);
    };

    const total = transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const colorByCategory = {
        food: "#34d399",
        transport: "#60a5fa",
        entertainment: "#f59e0b",
        delivery: "#f472b6",
        ridehail: "#22d3ee",
        necessary: "#a78bfa",
    };

    const handleDelete = (id) => {
        if (!confirm("¿Eliminar este gasto?")) return;
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    return (
        <main className="container content-safe py-3">
            <header className="mb-3 d-flex justify-content-between align-items-end">
                <div>
                    <h1 className="h5 mb-1 fw-semibold text-white">Transactions</h1>
                    <small className="text-muted">
                        {transactions.length} {transactions.length === 1 ? "movimiento" : "movimientos"}
                    </small>
                </div>
                <span className="badge text-success-emphasis bg-success-subtle border border-success-subtle rounded-pill">
                    Total: {formatCurrency(total)}
                </span>
            </header>

            {transactions.length === 0 ? (
                <div className="card card-surface shadow-soft p-4">
                    <p className="mb-0 text-muted">
                        No tienes transacciones aún. Usa el botón <strong>➕</strong> para agregar tu primer gasto.
                    </p>
                </div>
            ) : (
                <div className="card shadow-sm border-0 rounded-4 text-dark m-0 p-1" style={{ backgroundColor: "#965fd4"}}>
                    <ul className="list-group list-group-flush rounded-4">
                        {transactions.map((tx) => (
                            <li key={tx.id} className="list-group-item py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-start">
                                        {/* Antes: span redondo; Ahora: recuadro con ícono */}
                                        <CategoryBadge category={tx.category} size="sm" className="me-2" />

                                        <div>
                                            <div>
                                                <strong>{labelByCategory[tx.category] || tx.category}</strong>
                                                <span className="text-secondary"> — {tx.description}</span>
                                            </div>
                                            <div className="text-secondary small">{formatDate(tx.date)}</div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        <span className="badge bg-primary rounded-pill">{formatCurrency(tx.amount)}</span>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(tx.id)}
                                            aria-label="Eliminar gasto"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </li>

                        ))}
                    </ul>
                </div>
            )}

            <div className="mb-5 bg-white">

            </div>

            {/* FAB + Modal */}
            <AddNewExpense onAdd={handleAddExpense} />
        </main>
    );
}

export default Transactions;
