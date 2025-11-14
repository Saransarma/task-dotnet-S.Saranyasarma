import React, { useEffect, useState } from "react";
import api from "../api";
import ProductDialog from "../components/ProductDialog";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);

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

    function openAdd() {
        setEditing(null);
        setOpenDialog(true);
    }

    function openEdit(product) {
        setEditing(product);
        setOpenDialog(true);
    }

    async function handleSave(product) {
        try {
            if (product.id) {
                await api.put(`/products/${product.id}`, product);
                toast.success("Product updated");
            } else {
                await api.post("/products", product);
                toast.success("Product created");
            }
            setOpenDialog(false);
            load();
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data || "Save failed";
            toast.error(msg);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete product?")) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success("Deleted");
            load();
        } catch (err) {
            console.error(err);
            toast.error("Delete failed");
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Products</h2>
                <div>
                    <button className="btn btn-primary me-2" onClick={openAdd}>Add Product</button>
                    <button className="btn btn-outline-secondary" onClick={load}>Refresh</button>
                </div>
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
                                    <th style={{ width: 140 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan="7" className="text-center p-4">Loading...</td>
                                    </tr>
                                )}

                                {!loading && products.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center p-4">No products</td>
                                    </tr>
                                )}

                                {!loading && products.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.productName}</td>
                                        <td>{p.productCode}</td>
                                        <td>{categories.find(c => c.id === p.id)?.name ?? "-"}</td>
                                        <td>${Number(p.price).toFixed(2)}</td>
                                        <td>{p.stockQuantity}</td>
                                        <td>{p.isActive ? "Active" : "Inactive"}</td>
                                        <td className="table-actions">
                                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(p)} title="Edit">
                                                <EditIcon fontSize="small" />
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)} title="Delete">
                                                <DeleteIcon fontSize="small" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ProductDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSave={handleSave}
                categories={categories}
                initial={editing}
            />
        </>
    );
}
