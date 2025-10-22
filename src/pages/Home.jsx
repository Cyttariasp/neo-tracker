import { useMemo } from "react";
import AddNewExpense from "../components/AddNewExpense";
import { Soup, Bus, Clapperboard, Bike, Car, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

// ===== Helpers compartidos (puedes moverlos a un utils.js si quieres) =====
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

const labelByCategory = {
    food: "Comida",
    transport: "Transporte",
    entertainment: "Entretenimiento",
    delivery: "Delivery App",
    ridehail: "Transport App",
    necessary: "Necesario",
};

const iconByCategory = {
    food: Soup,
    transport: Bus,
    entertainment: Clapperboard,
    delivery: Bike, // usa Bike si Bike no existe en tu versión
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
// ==========================================================================

function Home() {
    const transactions = loadTx();

    // Mes actual YYYY-MM (en hora local)
    const now = new Date();
    const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayOfMonth = now.getDate();

    const monthProgress = Math.min(100, Math.round((dayOfMonth / daysInMonth) * 100));

    // Filtrar movimientos del mes actual
    const monthItems = useMemo(
        () => transactions.filter(t => t.date?.slice(0, 7) === currentYM),
        [transactions, currentYM]
    );

    // Totales
    const monthTotal = useMemo(
        () => monthItems.reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
        [monthItems]
    );
    const avgPerDaySoFar = monthTotal / (dayOfMonth || 1);

    // Totales por categoría del mes
    const totalsByCategory = useMemo(() => {
        const map = new Map();
        for (const t of monthItems) {
            const k = t.category || "other";
            map.set(k, (map.get(k) || 0) + (Number(t.amount) || 0));
        }
        return Array.from(map.entries())
            .map(([key, amount]) => ({ key, amount }))
            .sort((a, b) => b.amount - a.amount);
    }, [monthItems]);

    const top3 = totalsByCategory.slice(0, 3);
    const topMax = Math.max(1, ...top3.map(x => x.amount)); // evitar /0

    // Últimos 5 movimientos (globales, no solo del mes)
    const recent = useMemo(() => {
        const sorted = [...transactions].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
        return sorted.slice(0, 5);
    }, [transactions]);

    return (
        <main className="container content-safe py-3">
            <header className="mb-3 text-center">
                <h1 className="h5 mb-1 fw-semibold">Home</h1>
                <small className="text-muted">
                    {new Date().toLocaleDateString("es-CL", { weekday: "long", day: "2-digit", month: "short" })}
                </small>
            </header>
            <section className="mb-3">
                <div className="card border-0 shadow-sm card-compact">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-muted small">Avance del mes</span>
                        <span className="small fw-semibold">{monthProgress}%</span>
                    </div>

                    {/* Barra micro */}
                    <div
                        className="progress progress-thin"
                        role="progressbar"
                        aria-label="Avance del mes"
                        aria-valuenow={monthProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        <div className="progress-bar" style={{ width: `${monthProgress}%` }} />
                    </div>

                    {/* Guías de inicio/fin */}
                    <div className="d-flex justify-content-between text-muted small mt-1">
                        <span>1&nbsp;{now.toLocaleDateString("es-CL", { month: "short" })}</span>
                        <span>{daysInMonth}&nbsp;{now.toLocaleDateString("es-CL", { month: "short" })}</span>
                    </div>
                </div>
            </section>
            {/* Resumen del mes */}
            <section className="mb-3">
                <div className="row g-2">
                    <div className="col-12 col-sm-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <div className="text-muted small">Gasto del mes</div>
                                <div className="h4 mb-0">{formatCurrency(monthTotal)}</div>
                                <div className="text-muted small mt-1">
                                    Prom. diario: {formatCurrency(avgPerDaySoFar)}
                                </div>
                            </div>
                            <AddNewExpense variant="inline" onAdd={() => {
                                // guardamos directo porque AddNewExpense ya persiste via Transactions… 
                                // pero como Home no tiene estado, delegamos en localStorage + Home se re-renderiza al volver.
                                // Si prefieres refrescar en el momento: window.location.reload();
                            }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Top categorías del mes */}
            <section className="mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h2 className="h6 mb-0">Top categorías (este mes)</h2>
                            <Link to="/transactions" className="small text-decoration-none">ver todo</Link>
                        </div>

                        {top3.length === 0 ? (
                            <div className="text-muted small">Aún no hay gastos este mes.</div>
                        ) : (
                            <ul className="list-unstyled mb-0">
                                {top3.map(({ key, amount }) => {
                                    const Icon = iconByCategory[key] || ShoppingBag;
                                    const color = colorByCategory[key] || "#94a3b8";
                                    const pct = Math.round((amount / topMax) * 100);

                                    return (
                                        <li key={key} className="mb-2">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <div className="me-2 d-grid place-items-center rounded" style={{ width: 28, height: 28, color, border: "1px solid #e5e7eb" }}>
                                                        <Icon size={16} />
                                                    </div>
                                                    <strong className="me-2">{labelByCategory[key] || key}</strong>
                                                    <span className="text-muted small">{formatCurrency(amount)}</span>
                                                </div>
                                                <span className="text-muted small">{pct}%</span>
                                            </div>
                                            <div className="progress mt-1" role="progressbar" aria-label={`Proporción de ${key}`} aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
                                                <div className="progress-bar" style={{ width: `${pct}%`, backgroundColor: color }} />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </section>

            {/* Últimos movimientos */}
            <section className="mb-5">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h2 className="h6 mb-0">Últimos movimientos</h2>
                            <Link to="/transactions" className="small text-decoration-none">ver todos</Link>
                        </div>

                        {recent.length === 0 ? (
                            <div className="text-muted small">Sin movimientos aún.</div>
                        ) : (
                            <ul className="tx-list">
                                {recent.map((tx) => {
                                    const Icon = iconByCategory[tx.category] || ShoppingBag;
                                    const color = colorByCategory[tx.category] || "#94a3b8";

                                    return (
                                        <li key={tx.id} className="tx-item">
                                            {/* Icono */}
                                            <div className="tx-icon" style={{ color }}>
                                                <Icon size={18} />
                                            </div>
                                            {/* Contenido */}
                                            <div className="tx-body">
                                                <div className="tx-title">
                                                    <span>{labelByCategory[tx.category] || tx.category}</span>
                                                    {tx.description && <span className="tx-desc">— {tx.description}</span>}
                                                </div>
                                                <div className="tx-meta">{formatDate(tx.date)}</div>
                                            </div>
                                            {/* Monto */}
                                            <div className="tx-actions">
                                                <span className="badge bg-primary rounded-pill">{formatCurrency(tx.amount)}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </section>

            <AddNewExpense onAdd={() => {
                // guardamos directo porque AddNewExpense ya persiste via Transactions… 
                // pero como Home no tiene estado, delegamos en localStorage + Home se re-renderiza al volver.
                // Si prefieres refrescar en el momento: window.location.reload();
            }} />
        </main>
    );
}

export default Home;