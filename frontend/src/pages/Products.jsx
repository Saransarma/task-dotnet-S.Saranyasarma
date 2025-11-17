import React, { useEffect, useState } from "react";
import api from "../api";
import ProductDialog from "../components/ProductDialog";
import DeleteConfirmation from "../components/DeleteConfirmation";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState(null);

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

    const openDeleteDialog = (product) => {
        setDeletingProduct(product);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingProduct) return;
        try {
            await api.delete(`/products/${deletingProduct.id}`);
            toast.success("Deleted");
            load();
        } catch (err) {
            console.error(err);
            toast.error("Delete failed");
        } finally {
            setDeleteDialogOpen(false);
            setDeletingProduct(null);
        }
    };

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

    const getCategoryName = (categoryId) => categories.find(c => c.id === categoryId)?.name ?? "-";

    const sortedProducts = React.useMemo(() => {
        let sortable = [...products];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (typeof valA === "string") {
                    return sortConfig.direction === "asc"
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA);
                } else {
                    return sortConfig.direction === "asc" ? valA - valB : valB - valA;
                }
            });
        }
        return sortable;
    }, [products, sortConfig]);

    const paginatedProducts = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedProducts.slice(startIndex, endIndex);
    }, [sortedProducts, currentPage]);

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === "asc" ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-outline-secondary me-3" onClick={() => navigate(-1)}>
                    <ArrowBackIcon style={{ color: "white" }} />
                </button>
                <h2 style={{ color: "white" }}>Products</h2>
                <div>
                    <button className="btn btn-primary me-2" onClick={openAdd}>Add Product</button>
                    <button className="btn btn-outline-secondary" onClick={load} style={{ color: "white" }}>Refresh</button>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
                        <table className="table mb-0 text-center">
                            <thead className="table-light">
                                <tr>
                                    <th onClick={() => requestSort("name")} style={{ cursor: "pointer" }}>
                                        Name {getSortIcon("name")}
                                    </th>
                                    <th onClick={() => requestSort("code")} style={{ cursor: "pointer" }}>
                                        Code {getSortIcon("code")}
                                    </th>
                                    <th onClick={() => requestSort("categoryId")} style={{ cursor: "pointer" }}>
                                        Category {getSortIcon("categoryId")}
                                    </th>
                                    <th onClick={() => requestSort("price")} style={{ cursor: "pointer" }}>
                                        Price {getSortIcon("price")}
                                    </th>
                                    <th onClick={() => requestSort("stockQuantity")} style={{ cursor: "pointer" }}>
                                        Stock {getSortIcon("stockQuantity")}
                                    </th>
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

                                {!loading && paginatedProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center p-4">No products</td>
                                    </tr>
                                )}

                                {!loading && paginatedProducts.map(p => (
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
                                        </td>
                                        <td className="table-actions">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-1"
                                                onClick={() => openEdit(p)}
                                                title="Edit"
                                            >
                                                <EditIcon fontSize="small" />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => openDeleteDialog(p)}
                                                title="Delete"
                                            >
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-2">
                    <button className="btn btn-outline-secondary me-2" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                        Prev
                    </button>
                    <span className="align-self-center">Page {currentPage} of {totalPages}</span>
                    <button className="btn btn-outline-secondary ms-2" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}

            <ProductDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSave={handleSave}
                categories={categories}
                initial={editing}
            />

            <DeleteConfirmation
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                itemName={deletingProduct?.name || ""}
            />
        </>
    );
}
