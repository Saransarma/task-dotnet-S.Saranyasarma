import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ActiveProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function load() {
        setLoading(true);
        try {
            const [pRes, cRes] = await Promise.all([api.get("/products"), api.get("/categories")]);
            setProducts(pRes.data || []);
            setCategories(cRes.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const activeProducts = products.filter(p => p.isActive);

    const getCategoryName = (categoryId) => categories.find(c => c.id === categoryId)?.name ?? "-";

    async function toggleStatus(product) {
        const updated = { ...product, isActive: !product.isActive };
        try {
            await api.put(`/products/${product.id}`, updated);
            toast.success("Status updated");
            load();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-outline-secondary me-3" onClick={() => navigate(-1)}>
                    <ArrowBackIcon style={{ color: "white" }} />
                </button>
                <h2 style={{ color: "white" }}>Active Products</h2>
                <button className="btn btn-outline-secondary" onClick={load} style={{ color: "white" }}>Refresh</button>
            </div>

            <div className="card shadow-sm">
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
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4">Loading...</td>
                                    </tr>
                                )}

                                {!loading && activeProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4">No active products</td>
                                    </tr>
                                )}

                                {!loading && activeProducts.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td>{p.code}</td>
                                        <td>{getCategoryName(p.categoryId)}</td>
                                        <td>${Number(p.price).toFixed(2)}</td>
                                        <td>{p.stockQuantity}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={p.isActive}
                                                onChange={() => toggleStatus(p)}
                                            />
                                            <span className="ms-2">{p.isActive ? "Active" : "Inactive"}</span>
                                        </td>
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
