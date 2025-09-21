import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

function AddNewTask() {
    const [date, setDate] = useState(null);


    return (
        <>
            {/* Botón flotante */}
            <button
                className="btn btn-success rounded-circle p-3 shadow position-fixed"
                style={{ bottom: "80px", right: "20px" }}
                data-bs-toggle="modal"
                data-bs-target="#expenseModal"
            >
                <PlusCircle size={28} />
            </button>

            <div className="modal fade" id="expenseModal" tabIndex="-1" aria-labelledby="expenseModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="expenseModalLabel">Add New Expense</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <input className="form-control my-2" type="text" placeholder="Expense Name" aria-label="Expense" />
                                <div className="input-group mb-3">
                                    <span className="input-group-text">$</span>
                                    <input type="number" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                </div>
                                <select className="form-select my-2" aria-label="Expense Category">
                                    <option defaultValue>Category</option>
                                    <option value="1">Food</option>
                                    <option value="2">Transport</option>
                                    <option value="3">Entertainment</option>
                                    <option value="4">Delivery App</option>
                                    <option value="5">Transport App</option>
                                    <option value="6">Necessary</option>
                                </select>
                                <div className="mb-3">
                                    <label className="form-label">Fecha</label>
                                    <DatePicker
                                        selected={date}
                                        onChange={(date) => setDate(date)}
                                        className="form-control"
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="Selecciona una fecha"
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddNewTask;