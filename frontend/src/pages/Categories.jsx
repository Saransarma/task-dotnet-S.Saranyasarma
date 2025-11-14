import React, { useEffect, useState } from "react";
import api from "../api";
import CategoryDialog from "../components/CategoryDialog";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);

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
            api.put(`/categories/${cat.id}`, cat)
                .then(() => { toast.success("Updated"); setOpen(false); load(); })
                .catch(() => toast.error("Update failed"));
        } else {
            api.post("/categories", cat)
                .then(() => { toast.success("Created"); setOpen(false); load(); })
                .catch(() => toast.error("Create failed"));
        }
    }

    function remove(id) {
        if (!window.confirm("Delete category?")) return;
        api.delete(`/categories/${id}`)
            .then(() => { toast.success("Deleted"); load(); })
            .catch(err => {
                const msg = err?.response?.data || "Failed to delete";
                toast.error(msg);
            });
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Categories</h2>
                <div>
                    <button className="btn btn-primary me-2" onClick={addNew}>Add Category</button>
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
                                    <th style={{ width: 160 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan="2" className="p-4 text-center">No categories</td>
                                    </tr>
                                )}
                                {categories.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.name}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => editCat(c)}>
                                                <EditIcon fontSize="small" />
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => remove(c.id)}>
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
                onClose={() => setOpen(false)}
                onSave={save}
                initial={editing}
            />
        </>
    );
}
