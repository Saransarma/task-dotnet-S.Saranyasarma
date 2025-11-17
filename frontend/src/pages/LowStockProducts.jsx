import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
export default function LowStockProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    async function load() {
        setLoading(true);
        try {
            const [pRes, cRes] = await Promise.all([api.get("/products"), api.get("/categories")]);
            setProducts(pRes.data?.filter(p => Number(p.stockQuantity) < 5) || []);
            setCategories(cRes.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const getCategoryName = (id) => categories.find(c => c.id === id)?.name ?? "-";

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-outline-secondary me-3" onClick={() => navigate(-1)}>
                    <ArrowBackIcon style={{ color: "white" }} />
                </button>
                <h2 style={{ color: "white" }}>Low Stock Products</h2>
                <div>
                    <button className="btn btn-outline-secondary" onClick={load} style={{ color: "white" }}>Refresh</button>
                </div>
            </div>
            <div className="card shadow-sm mt-3">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan="5" className="text-center p-4">Loading...</td>
                                    </tr>
                                )}

                                {!loading && products.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center p-4">No low-stock products</td>
                                    </tr>
                                )}

                                {!loading && products.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td>{p.code}</td>
                                        <td>{getCategoryName(p.categoryId)}</td>
                                        <td>${Number(p.price).toFixed(2)}</td>
                                        <td>{p.stockQuantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
