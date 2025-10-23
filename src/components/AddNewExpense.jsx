// src/components/AddNewExpense.jsx
import { useEffect, useRef, useState } from "react";
import { PlusCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "bootstrap";

/**
 * Componente de alta de movimientos (gasto/ingreso)
 *
 * Props:
 * - onAdd?: (tx) => void
 * - variant?: "inline" | "fab"           (estilo del botón interno si trigger="internal")
 * - trigger?: "internal" | "none"        ("internal" dibuja botón; "none" solo dibuja el modal)
 * - kind?: "expense" | "income"          (si viene, fija el tipo y oculta el toggle interno)
 * - label?: string                       (texto del botón interno)
 * - idSuffix?: string                    (sufijo para generar un id de modal único)
 */
function AddNewExpense({
  onAdd,
  variant = "inline",
  trigger = "internal",
  kind: fixedKind,      // si viene, el usuario no cambia el tipo
  label,
  idSuffix = "default",
}) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date(),
  });

  const [kind, setKind] = useState(fixedKind || "expense"); // "expense" | "income"
  useEffect(() => {
    if (fixedKind) setKind(fixedKind);
  }, [fixedKind]);

  const isExpense = kind === "expense";
  const modalId = `addTxModal-${idSuffix}`;
  const modalRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleDateChange = (date) => {
    setForm((f) => ({ ...f, date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.category || !form.date) return;

    // YYYY-MM-DD (local)
    const y = form.date.getFullYear();
    const m = String(form.date.getMonth() + 1).padStart(2, "0");
    const d = String(form.date.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    onAdd?.({
      description: form.description.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: dateStr,
      kind,
    });

    // Reset (fecha vuelve a hoy)
    setForm({ description: "", amount: "", category: "", date: new Date() });

    // Cerrar modal con la API de Bootstrap
    const el = document.getElementById(modalId);
    if (el) Modal.getOrCreateInstance(el).hide();
  };

  // Texto/estilo del botón disparador interno (si se usa)
  const triggerLabel = label || (isExpense ? "Agregar gasto" : "Agregar ingreso");
  const triggerClass =
    variant === "inline"
      ? `btn ${isExpense ? "btn-danger" : "btn-success"} btn-lg rounded-pill px-4 shadow-sm`
      : "btn btn-success rounded-circle p-3 position-fixed btn-fab";

  return (
    <>
      {/* Botón disparador interno (opcional) */}
      {trigger === "internal" && (
        <div className={variant === "inline" ? "d-flex justify-content-center my-2" : ""}>
          <button
            className={triggerClass}
            data-bs-toggle="modal"
            data-bs-target={`#${modalId}`}
            aria-label={triggerLabel}
            style={variant === "fab" ? { bottom: "88px", right: "20px" } : undefined}
          >
            <PlusCircle size={variant === "inline" ? 20 : 28} className={variant === "inline" ? "me-2" : ""} />
            {variant === "inline" && triggerLabel}
          </button>
        </div>
      )}

      {/* Modal */}
      <div
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        aria-labelledby={`${modalId}-label`}
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`${modalId}-label`}>
                {isExpense ? "Agregar gasto" : "Agregar ingreso"}
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Si NO viene fixedKind, mostramos un mini toggle para elegir tipo */}
                {!fixedKind && (
                  <div className="btn-group mb-3" role="group" aria-label="Tipo de movimiento">
                    <button
                      type="button"
                      className={`btn ${isExpense ? "btn-danger" : "btn-outline-danger"}`}
                      onClick={() => setKind("expense")}
                    >
                      Gasto
                    </button>
                    <button
                      type="button"
                      className={`btn ${!isExpense ? "btn-success" : "btn-outline-success"}`}
                      onClick={() => setKind("income")}
                    >
                      Ingreso
                    </button>
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor={`${modalId}-description`} className="form-label">Nombre</label>
                  <input
                    id={`${modalId}-description`}
                    name="description"
                    type="text"
                    className="form-control"
                    placeholder="Ej: Sueldo / Almuerzo"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor={`${modalId}-amount`} className="form-label">Monto</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      id={`${modalId}-amount`}
                      name="amount"
                      type="number"
                      className="form-control"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      inputMode="decimal"
                      value={form.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor={`${modalId}-category`} className="form-label">Categoría</label>
                  <select
                    id={`${modalId}-category`}
                    name="category"
                    className="form-select"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Selecciona una categoría</option>
                    <option value="food">Comida</option>
                    <option value="transport">Transporte</option>
                    <option value="entertainment">Entretenimiento</option>
                    <option value="delivery">Delivery App</option>
                    <option value="ridehail">Transport App</option>
                    <option value="necessary">Necesario</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Fecha</label>
                  <DatePicker
                    selected={form.date}
                    onChange={handleDateChange}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" className={`btn ${isExpense ? "btn-danger" : "btn-success"}`}>
                  {isExpense ? "Guardar gasto" : "Guardar ingreso"}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}

export default AddNewExpense;
