import { useState } from "react";
import { PlusCircle } from "lucide-react";
import AddNewTask from "../components/AddNewTask";



function Transactions() {
    const [transactions, setTransactions] = useState([
        { id: 1, category: "Comida", amount: 15, date: "2025-09-20", description: "Almuerzo" },
        { id: 2, category: "Transporte", amount: 5, date: "2025-09-19", description: "Bus" },
        { id: 3, category: "Entretenimiento", amount: 20, date: "2025-09-18", description: "Cine" },
    ]);

    return (
        <div className="container" style={{ backgroundColor: "#965fd4" }}>
            <h2 className="mb-3">Transactions</h2>
            <ul className="list-group">
                {transactions.map((tx) => (
                    <li key={tx.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{tx.category}</strong> - {tx.description}
                            <div className="text-muted" style={{ fontSize: "12px" }}>
                                {tx.date}
                            </div>
                        </div>
                        <span className="badge bg-primary rounded-pill">${tx.amount}</span>
                    </li>
                ))}
            </ul>

            {/* Botón flotante */}

        </div>
    );
}

export default Transactions;