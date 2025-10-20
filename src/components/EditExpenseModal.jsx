import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "bootstrap";

/**
 * Modal de edición de gasto.
 * Props:
 *  - tx: objeto { id, description, amount, category, date: 'YYYY-MM-DD' } o null
 *  - onUpdate: (updatedTx) => void
 *  - modalId?: string (opcional, default "editExpenseModal")
 *
 * Nota: se abre/cierra programáticamente desde el padre (Transactions) con Bootstrap Modal API.
 */


function EditExpenseModal({ tx, onUpdate, modalId = "editExpenseModal" }) {
    // Helpers
    const parseYMD = (ymd) => {
        if (!ymd) return new Date();
        const [y, m, d] = ymd.split("-").map(Number);
        const date = new Date(y, (m || 1) - 1, d || 1);
        // normalizamos a medianoche local:
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const initialForm = useMemo(() => ({
        id: tx?.id ?? null,
        description: tx?.description ?? "",
        amount: tx?.amount ?? "",
        category: tx?.category ?? "",
        date: tx?.date ? parseYMD(tx.date) : new Date(),
    }), [tx]);

    const [form, setForm] = useState(initialForm);

    // Si cambian las props (cuando seleccionas otro gasto), refresca el form
    useEffect(() => {
        setForm(initialForm);
    }, [initialForm]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleDateChange = (date) => {
        setForm((f) => ({ ...f, date }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.description || !form.amount || !form.category || !form.date || !form.id) return;

        // a 'YYYY-MM-DD' en horario local
        const y = form.date.getFullYear();
        const m = String(form.date.getMonth() + 1).padStart(2, "0");
        const d = String(form.date.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${d}`;

        onUpdate({
            id: form.id,
            description: form.description.trim(),
            amount: Number(form.amount),
            category: form.category,
            date: dateStr,
        });

        // Cierra el modal
        const modalEl = document.getElementById(modalId);
        if (modalEl) {
            const instance = Modal.getOrCreateInstance(modalEl);
            instance.hide();
        }
    };

    return (
        <div
            className="modal fade"
            id={modalId}
            tabIndex="-1"
            aria-labelledby={`${modalId}Label`}
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id={`${modalId}Label`}>
                            Edit Expense
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor={`${modalId}-description`} className="form-label">Name</label>
                                <input
                                    id={`${modalId}-description`}
                                    name="description"
                                    type="text"
                                    className="form-control"
                                    placeholder="Ej: Almuerzo"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor={`${modalId}-amount`} className="form-label">Amount</label>
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
                                <label htmlFor={`${modalId}-category`} className="form-label">Category</label>
                                <select
                                    id={`${modalId}-category`}
                                    name="category"
                                    className="form-select"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                >
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
                                <DatePicker
                                    selected={form.date}
                                    onChange={handleDateChange}
                                    className="form-control"
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Selecciona una fecha"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save changes
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default EditExpenseModal;