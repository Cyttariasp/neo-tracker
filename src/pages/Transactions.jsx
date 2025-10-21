import { useState, useEffect, useMemo, useRef } from "react";
import AddNewExpense from "../components/AddNewExpense";
import EditExpenseModal from "../components/EditExpenseModal";
import { Edit2, Trash2, Soup, Bus, Clapperboard, Bike, Car, ShoppingBag, X } from "lucide-react";
import { Modal, Toast } from "bootstrap";

const loadTx = () => {
    try { return JSON.parse(localStorage.getItem("transactions") ?? "[]"); }
    catch { return []; }
};

const formatCurrency = (n) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })
        .format(Number(n) || 0);

const formatDate = (ymd) =>
    ymd
        ? new Date(`${ymd}T00:00:00`).toLocaleDateString("es-CL", { year: "numeric", month: "short", day: "2-digit" })
        : "";

const monthLabel = (ym) => {
    if (!ym) return "";
    const [y, m] = ym.split("-");
    return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("es-CL", { month: "short", year: "numeric" });
};

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
    const [editingTx, setEditingTx] = useState(null);

    // Toast
    const toastRef = useRef(null);
    const showToast = (text) => {
        if (!toastRef.current) return;
        toastRef.current.querySelector(".toast-body").textContent = text;
        Toast.getOrCreateInstance(toastRef.current).show();
    };

    // Persistencia
    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions]);

    // CRUD
    const handleAddExpense = (tx) => {
        const id = crypto.randomUUID?.() ?? Date.now();
        setTransactions((prev) => [{ ...tx, id }, ...prev]);
        showToast("Gasto agregado");
    };

    const handleDelete = (id) => {
        if (!confirm("¿Eliminar este gasto?")) return;
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        showToast("Gasto eliminado");
    };

    const openEditModal = (tx) => {
        setEditingTx(tx);
        const el = document.getElementById("editExpenseModal");
        if (el) Modal.getOrCreateInstance(el).show();
    };

    const handleUpdateExpense = (updated) => {
        setTransactions((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
        setEditingTx(null);
        showToast("Cambios guardados");
    };

    // Filtros
    const [filters, setFilters] = useState({ month: "all", category: "all", sort: "date_desc" });

    const monthOptions = useMemo(() => {
        const set = new Set(transactions.map((t) => t.date?.slice(0, 7)).filter(Boolean));
        return Array.from(set).sort().reverse();
    }, [transactions]);

    const view = useMemo(() => {
        const items = transactions.filter((t) => {
            const okMonth = filters.month === "all" || (t.date && t.date.slice(0, 7) === filters.month);
            const okCat = filters.category === "all" || t.category === filters.category;
            return okMonth && okCat;
        });

        // ordenar
        const sorted = [...items].sort((a, b) => {
            switch (filters.sort) {
                case "amount_desc": return Number(b.amount) - Number(a.amount);
                case "amount_asc": return Number(a.amount) - Number(b.amount);
                case "date_asc": return (a.date || "").localeCompare(b.date || "");
                case "date_desc":
                default: return (b.date || "").localeCompare(a.date || "");
            }
        });

        const total = sorted.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
        return { items: sorted, total };
    }, [transactions, filters]);

    // Iconos/colores
    const iconByCategory = { food: Soup, transport: Bus, entertainment: Clapperboard, delivery: Bike, ridehail: Car, necessary: ShoppingBag };
    const colorByCategory = { food: "#34d399", transport: "#60a5fa", entertainment: "#f59e0b", delivery: "#f472b6", ridehail: "#22d3ee", necessary: "#a78bfa" };

    // Helpers filtros activos
    const hasActiveFilters = filters.month !== "all" || filters.category !== "all";
    const clearFilters = () => setFilters({ month: "all", category: "all", sort: "date_desc" });

    const groupedByMonth = useMemo(() => {
        const groups = new Map();
        for (const t of view.items) {
            const key = t.date ? t.date.slice(0, 7) : "sin-fecha"; // 'YYYY-MM'
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(t);
        }
        // devolver array ordenado por mes según el orden de view.items
        return Array.from(groups.entries());
    }, [view.items]);

    const prettyMonth = (ym) =>
        ym === "sin-fecha" ? "Sin fecha" : monthLabel(ym);

    return (
        <main className="content-safe py-3 container-fluid px-0">
            {/* Filtros */}
            <div className="container d-flex flex-column gap-2 mb-2">
                <div className="d-flex gap-2">
                    <select
                        className="form-select"
                        aria-label="Filtrar por mes"
                        value={filters.month}
                        onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))}
                    >
                        <option value="all">Todos los meses</option>
                        {monthOptions.map((ym) => (
                            <option key={ym} value={ym}>{monthLabel(ym)}</option>
                        ))}
                    </select>

                    <select
                        className="form-select"
                        aria-label="Filtrar por categoría"
                        value={filters.category}
                        onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                    >
                        <option value="all">Todas las categorías</option>
                        {Object.entries(labelByCategory).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                    <select
                        className="form-select"
                        aria-label="Ordenar resultados"
                        value={filters.sort ?? "date_desc"}
                        onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                    >
                        <option value="date_desc">Más recientes primero</option>
                        <option value="date_asc">Más antiguos primero</option>
                        <option value="amount_desc">Monto: alto → bajo</option>
                        <option value="amount_asc">Monto: bajo → alto</option>
                    </select>
                </div>

                {/* Chips de filtros activos */}
                {hasActiveFilters && (
                    <div className="d-flex align-items-center gap-2">
                        {filters.month !== "all" && (
                            <span className="badge rounded-pill text-bg-light border">
                                {monthLabel(filters.month)}
                            </span>
                        )}
                        {filters.category !== "all" && (
                            <span className="badge rounded-pill text-bg-light border">
                                {labelByCategory[filters.category] || filters.category}
                            </span>
                        )}
                        <button className="btn btn-sm btn-outline-secondary ms-auto" onClick={clearFilters} title="Limpiar filtros">
                            <X size={16} className="me-1" /> Limpiar
                        </button>
                    </div>
                )}
            </div>

            {/* Header resumen (sticky si quieres) */}
            <div className="tx-sticky">
                <div className="container d-flex justify-content-between align-items-end py-2">
                    <div>
                        <h1 className="h6 mb-0">Transactions</h1>
                        <small className="text-muted">
                            {view.items.length} {view.items.length === 1 ? "movimiento" : "movimientos"}
                        </small>
                    </div>
                    <span className="badge text-success-emphasis bg-success-subtle border border-success-subtle rounded-pill">
                        Total: {formatCurrency(view.total)}
                    </span>
                </div>
            </div>

            {view.items.length === 0 ? (
                <div className="container">
                    <div className="card card-surface shadow-soft p-4">
                        <p className="mb-0 text-muted">
                            No hay resultados con los filtros actuales. Cambia los filtros o agrega un gasto con <strong>➕</strong>.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="w-100">
                    {groupedByMonth.map(([ym, items]) => (
                        <section key={ym}>
                            {(() => {
                                const monthTotal = items.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
                                return (
                                    <div
                                        className="px-3 py-2 d-flex justify-content-between align-items-center"
                                        style={{
                                            position: "sticky",
                                            top: 0,
                                            background: "var(--bg,#fff)",
                                            zIndex: 2,
                                            borderTop: "1px solid var(--border,#e5e7eb)",
                                            borderBottom: "1px solid var(--border,#e5e7eb)",
                                            backdropFilter: "blur(6px)"
                                        }}
                                    >
                                        <strong>{prettyMonth(ym)}</strong>
                                        <span className="badge bg-light text-dark border">
                                            {formatCurrency(monthTotal)}
                                        </span>
                                    </div>
                                );
                            })()}

                            {/* Lista de ese mes */}
                            <ul className="tx-list">
                                {items.map((tx) => {
                                    const Icon = iconByCategory[tx.category] || ShoppingBag;
                                    const iconColor = colorByCategory[tx.category] || "#94a3b8";

                                    return (
                                        <li key={tx.id} className="tx-item">
                                            <div className="tx-icon" style={{ color: iconColor }}>
                                                <Icon size={18} />
                                            </div>

                                            <div className="tx-body">
                                                <div className="tx-title">
                                                    <span>{labelByCategory[tx.category] || tx.category}</span>
                                                    {tx.description && <span className="tx-desc">— {tx.description}</span>}
                                                </div>
                                                <div className="tx-meta">{formatDate(tx.date)}</div>
                                            </div>

                                            <div className="tx-actions">
                                                <span className="badge bg-primary rounded-pill">{formatCurrency(tx.amount)}</span>
                                                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => openEditModal(tx)} aria-label="Editar gasto" title="Editar">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(tx.id)} aria-label="Eliminar gasto" title="Eliminar">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    ))}
                </div>
            )}

            {/* Alta y edición */}
            <AddNewExpense onAdd={handleAddExpense} />
            <EditExpenseModal tx={editingTx} onUpdate={handleUpdateExpense} />

            {/* Toast */}
            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
                <div ref={toastRef} className="toast align-items-center text-bg-dark border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">OK</div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Transactions;
