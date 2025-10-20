// src/pages/Transactions.jsx
import { useState, useEffect } from "react";
import AddNewExpense from "../components/AddNewExpense";
import EditExpenseModal from "../components/EditExpenseModal";
import { Edit2, Trash2, Soup, Bus, Clapperboard, Bike, Car, ShoppingBag } from "lucide-react";
import { Modal } from "bootstrap";

// Helpers -----------------
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
// -------------------------

function Transactions() {
    const [transactions, setTransactions] = useState(loadTx);
    const [editingTx, setEditingTx] = useState(null);

    // Persistencia en localStorage
    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions]);

    const handleAddExpense = (tx) => {
        const id = crypto.randomUUID?.() ?? Date.now();
        setTransactions((prev) => [{ ...tx, id }, ...prev]);
    };

    const handleDelete = (id) => {
        if (!confirm("¿Eliminar este gasto?")) return;
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    const openEditModal = (tx) => {
        setEditingTx(tx);
        const el = document.getElementById("editExpenseModal");
        if (el) Modal.getOrCreateInstance(el).show();
    };

    const handleUpdateExpense = (updated) => {
        setTransactions((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
        setEditingTx(null);
    };

    const total = transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    // Iconos y colores por categoría (para la columna fija de la izquierda)
    const iconByCategory = {
        food: Soup,
        transport: Bus,
        entertainment: Clapperboard,
        delivery: Bike,
        ridehail: Car,
        necessary: ShoppingBag,
    };
    const colorByCategory = {
        food: "#34d399",
        transport: "#60a5fa",
        entertainment: "#f59e0b",
        delivery: "#f472b6",
        ridehail: "#22d3ee",
        necessary: "#a78bfa",
    };

    return (
        <main className="content-safe py-3 container-fluid px-0">
            <div className="tx-sticky">
                <div className="container d-flex justify-content-between align-items-end py-2">
                    <div>
                        <h1 className="h6 mb-0">Transactions</h1>
                        <small className="text-muted">
                            {transactions.length} {transactions.length === 1 ? "movimiento" : "movimientos"}
                        </small>
                    </div>
                    <span className="badge text-success-emphasis bg-success-subtle border border-success-subtle rounded-pill">
                        Total: {formatCurrency(total)}
                    </span>
                </div>
            </div>

            {/* Lista a ancho completo */}
            {transactions.length === 0 ? (
                <div className="container">
                    <div className="card card-surface shadow-soft p-4">
                        <p className="mb-0 text-muted">
                            No tienes transacciones aún. Usa el botón <strong>➕</strong> para agregar tu primer gasto.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="w-100">
                    <ul className="tx-list">
                        {transactions.map((tx) => {
                            const Icon = iconByCategory[tx.category] || ShoppingBag;
                            const iconColor = colorByCategory[tx.category] || "#94a3b8";

                            return (
                                <li key={tx.id} className="tx-item">
                                    {/* Columna 1: Icono fijo */}
                                    <div className="tx-icon" style={{ color: iconColor }}>
                                        <Icon size={18} />
                                    </div>

                                    {/* Columna 2: Contenido elástico */}
                                    <div className="tx-body">
                                        <div className="tx-title">
                                            <span>{labelByCategory[tx.category] || tx.category}</span>
                                            {tx.description && <span className="tx-desc">— {tx.description}</span>}
                                        </div>
                                        <div className="tx-meta">{formatDate(tx.date)}</div>
                                    </div>

                                    {/* Columna 3: Acciones fijas */}
                                    <div className="tx-actions">
                                        <span className="badge bg-primary rounded-pill">{formatCurrency(tx.amount)}</span>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => openEditModal(tx)}
                                            aria-label="Editar gasto"
                                            title="Editar"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(tx.id)}
                                            aria-label="Eliminar gasto"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Alta y edición */}
            <AddNewExpense onAdd={handleAddExpense} />
            <EditExpenseModal tx={editingTx} onUpdate={handleUpdateExpense} />
        </main>
    );
}

export default Transactions;
