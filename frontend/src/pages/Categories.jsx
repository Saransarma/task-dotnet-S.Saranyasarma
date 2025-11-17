import React, { useEffect, useState } from "react";
import api from "../api";
import CategoryDialog from "../components/CategoryDialog";
import DeleteConfirmation from "../components/DeleteConfirmation";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const navigate = useNavigate();

    function load() {
        api.get("/categories")
            .then(res => setCategories(res.data || []))
            .catch(() => toast.error("Failed to load categories"));
    }

    useEffect(() => { load(); }, []);

    function addNew() {
        setEditing(null);
        setOpen(true);
    }

    function editCat(cat) {
        setEditing(cat);
        setOpen(true);
    }

    function save(cat) {
        if (cat.id) {
            api.put(`/categories/${cat.id}`, { name: cat.name })
                .then(() => {
                    toast.success("Category updated");
                    setOpen(false);
                    setEditing(null);
                    load();
                })
                .catch(() => toast.error("Update failed"));
        } else {
            api.post("/categories", { name: cat.name })
                .then(() => {
                    toast.success("Category created");
                    setOpen(false);
                    setEditing(null);
                    load();
                })
                .catch(() => toast.error("Create failed"));
        }
    }

    const openDeleteDialog = (category) => {
        setDeletingCategory(category);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingCategory) return;
        try {
            await api.delete(`/categories/${deletingCategory.id}`);
            toast.success("Category deleted");
            load();
        } catch (err) {
            const msg = err?.response?.data || "Delete failed";
            toast.error(msg);
        } finally {
            setDeleteDialogOpen(false);
            setDeletingCategory(null);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-outline-secondary me-3" onClick={() => navigate(-1)}>
                    <ArrowBackIcon style={{ color: "white" }} />
                </button>
                <h2 style={{ color: "white" }}>Categories</h2>
                <div>
                    <button className="btn btn-primary me-2" onClick={addNew}>Add Category</button>
                    <button className="btn btn-outline-secondary" onClick={load} style={{ color: "white" }}>Refresh</button>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th style={{ width: 160 }}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan="2" className="p-4 text-center">
                                            No categories
                                        </td>
                                    </tr>
                                )}

                                {categories.map(c => (
                                    <tr key={c.id} style={{ cursor: "pointer" }}>
                                        <td onClick={() => navigate(`/category-products/${c.id}`)}>
                                            {c.name}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-1"
                                                onClick={() => editCat(c)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </button>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => openDeleteDialog(c)}
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

            <CategoryDialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditing(null);
                }}
                onSave={save}
                initial={editing}
            />

            <DeleteConfirmation
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                itemName={deletingCategory?.name || ""}
            />
        </>
    );
}
