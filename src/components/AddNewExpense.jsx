// AddNewExpense.jsx
import { useState, useRef } from "react";
import { PlusCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "bootstrap";

function AddNewExpense({ onAdd, variant = "fab" }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date(),
  });

  const modalId = "expenseModal";
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

    const y = form.date.getFullYear();
    const m = String(form.date.getMonth() + 1).padStart(2, "0");
    const d = String(form.date.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    onAdd?.({
      description: form.description.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: dateStr,
    });

    setForm({ description: "", amount: "", category: "", date: new Date() });

    const el = document.getElementById(modalId);
    if (el) Modal.getOrCreateInstance(el).hide();
  };

  return (
    <>
      {/* Disparador */}
      {variant === "fab" ? (
        <button
          className="btn btn-success rounded-circle p-3 position-fixed btn-fab"
          style={{ bottom: "88px", right: "20px" }}
          data-bs-toggle="modal"
          data-bs-target={`#${modalId}`}
          aria-label="Agregar gasto"
        >
          <PlusCircle size={28} />
        </button>
      ) : (
        <div className="d-flex justify-content-center my-3">
          <button
            className="btn btn-success btn-lg rounded-pill px-4 shadow-sm"
            data-bs-toggle="modal"
            data-bs-target={`#${modalId}`}
          >
            <PlusCircle size={20} className="me-2" />
            Agregar gasto
          </button>
        </div>
      )}

      {/* Modal */}
      <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby="expenseModalLabel" aria-hidden="true" ref={modalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="expenseModalLabel">Add New Expense</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Name</label>
                  <input id="description" name="description" type="text" className="form-control"
                         placeholder="Ej: Almuerzo" value={form.description} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input id="amount" name="amount" type="number" className="form-control"
                           placeholder="0.00" step="0.01" min="0" inputMode="decimal"
                           value={form.amount} onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select id="category" name="category" className="form-select"
                          value={form.category} onChange={handleChange} required>
                    <option value="" disabled>Select a category</option>
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="delivery">Delivery App</option>
                    <option value="ridehail">Transport App</option>
                    <option value="necessary">Necessary</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <DatePicker selected={form.date} onChange={handleDateChange}
                              className="form-control" dateFormat="yyyy-MM-dd"
                              placeholderText="Selecciona una fecha" />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Save expense</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}

export default AddNewExpense;
