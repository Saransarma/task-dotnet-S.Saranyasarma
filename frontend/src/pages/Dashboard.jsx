import React, { useEffect, useState } from "react";
import api from "../api";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const [pRes, cRes] = await Promise.all([api.get("/products"), api.get("/categories")]);
            setProducts(pRes.data || []);
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

    // Search across both products and categories (single search)
    const q = query.trim().toLowerCase();
    const productResults = q
        ? products.filter(p => (p.name ?? "").toLowerCase().includes(q) || (p.code ?? "").toLowerCase().includes(q))
        : [];
    const categoryResults = q ? categories.filter(c => (c.name ?? "").toLowerCase().includes(q)) : [];

    const lowStockProducts = products.filter(p => Number(p.stockQuantity) < 5);

    function Card({ title, value, icon }) {
        return (
            <div className="col-md-3 mb-3">
                <div className="card shadow-sm">
                    <div className="card-body d-flex align-items-center gap-3">
                        <div className="bg-light rounded p-2">{icon}</div>
                        <div>
                            <div className="text-muted small">{title}</div>
                            <div className="h5 mb-0">{value}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Dashboard</h2>
                <div className="input-group w-50">
                    <input
                        className="form-control"
                        placeholder="Search products and categories..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" onClick={() => { setQuery(""); }}>
                        Clear
                    </button>
                </div>
            </div>

            <div className="row">
                <Card title="Total Products" value={products.length} icon={<Inventory2Icon />} />
                <Card title="Total Categories" value={categories.length} icon={<CategoryIcon />} />
                <Card title="Low Stock (<5)" value={lowStockProducts.length} icon={<WarningAmberIcon />} />
                <Card title="Active Products" value={products.filter(p => p.isActive).length} icon={<CheckCircleIcon />} />
            </div>

            <div className="row mt-4">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Search Results</h5>

                            {q === "" ? (
                                <div className="text-muted">Type to search products and categories</div>
                            ) : (
                                <>
                                    <div className="mb-2">
                                        <strong>Products ({productResults.length})</strong>
                                        <ul className="list-group list-group-flush mt-2">
                                            {productResults.length === 0 && <li className="list-group-item">No products found</li>}
                                            {productResults.map(p => (
                                                <li className="list-group-item" key={p.id}>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <div className="fw-bold">{p.name}</div>
                                                            <div className="text-muted small">{p.code}</div>
                                                        </div>
                                                        <div className="text-end">
                                                            <div>${Number(p.price).toFixed(2)}</div>
                                                            <div className="small text-muted">Stock: {p.stockQuantity}</div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <strong>Categories ({categoryResults.length})</strong>
                                        <ul className="list-group list-group-flush mt-2">
                                            {categoryResults.length === 0 && <li className="list-group-item">No categories found</li>}
                                            {categoryResults.map(c => (
                                                <li className="list-group-item" key={c.id}>
                                                    {c.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Products low on stock ( &lt; 5 )</h5>
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Product</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lowStockProducts.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="p-4 text-center">No low-stock products</td>
                                            </tr>
                                        )}
                                        {lowStockProducts.map(p => (
                                            <tr key={p.id}>
                                                <td>{p.name}</td>
                                                <td>{categories.find(c => c.id === p.categoryId)?.name ?? "-"}</td>
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
            </div>
        </>
    );
}
