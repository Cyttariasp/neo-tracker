import { useMemo } from "react";
import AddNewExpense from "../components/AddNewExpense";
import { Soup, Bus, Clapperboard, Bike, Car, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

// Helpers
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
  delivery: Bike,      // si tu versión no tiene Bike, usa Bicycle
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

function Home() {
  const transactions = loadTx();

  // handler para guardar desde Home (sin estado)
  const handleAddFromHome = (tx) => {
    const list = JSON.parse(localStorage.getItem("transactions") ?? "[]");
    const withId = { ...tx, id: crypto.randomUUID?.() ?? Date.now() };
    localStorage.setItem("transactions", JSON.stringify([withId, ...list]));
    // refrescar pantalla para ver el nuevo dato
    window.location.reload();
  };

  // Mes actual
  const now = new Date();
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const monthProgress = Math.min(100, Math.round((dayOfMonth / daysInMonth) * 100));

  // Movimientos del mes
  const monthItems = useMemo(
    () => transactions.filter(t => t.date?.slice(0, 7) === currentYM),
    [transactions, currentYM]
  );

  const monthTotal = useMemo(
    () => monthItems.reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
    [monthItems]
  );
  const avgPerDaySoFar = monthTotal / (dayOfMonth || 1);

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
  const topMax = Math.max(1, ...top3.map(x => x.amount));

  // Últimos 5 globales
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

      {/* Avance del mes */}
      <section className="mb-3">
        <div className="card border-0 shadow-sm card-compact">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-muted small">Avance del mes</span>
            <span className="small fw-semibold">{monthProgress}%</span>
          </div>
          <div className="progress progress-thin" role="progressbar" aria-label="Avance del mes"
               aria-valuenow={monthProgress} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-bar" style={{ width: `${monthProgress}%` }} />
          </div>
          <div className="d-flex justify-content-between text-muted small mt-1">
            <span>1&nbsp;{now.toLocaleDateString("es-CL", { month: "short" })}</span>
            <span>{daysInMonth}&nbsp;{now.toLocaleDateString("es-CL", { month: "short" })}</span>
          </div>
        </div>
      </section>

      {/* Resumen + Grupo de botones */}
      <section className="mb-3">
        <div className="row g-2">
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-muted small">Gasto del mes</div>
                <div className="h4 mb-0">{formatCurrency(monthTotal)}</div>
                <div className="text-muted small mt-1">
                  Prom. diario: {formatCurrency(avgPerDaySoFar)}
                </div>

                {/* Grupo de botones */}
                <div className="d-flex justify-content-center my-3">
                  <div className="btn-group" role="group" aria-label="Agregar movimiento">
                    <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#addTxModal-gasto">
                      Agregar gasto
                    </button>
                    <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addTxModal-ingreso">
                      Agregar ingreso
                    </button>
                  </div>
                </div>

                {/* Modales SIN disparador interno — IDs deben coincidir */}
                <AddNewExpense trigger="none" kind="expense" idSuffix="gasto" onAdd={handleAddFromHome} />
                <AddNewExpense trigger="none" kind="income"  idSuffix="ingreso" onAdd={handleAddFromHome} />
              </div>
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
                      <div className="progress mt-1" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
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
                      <div className="tx-icon" style={{ color }}>
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
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
