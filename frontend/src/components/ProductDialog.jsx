import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material";
import { toast } from "react-toastify";

export default function ProductDialog({ open, onClose, onSave, categories = [], initial = null }) {
    const [form, setForm] = useState({
        id: null,
        name: "",
        code: "",
        categoryId: "",
        price: 0,
        stockQuantity: 0,
        isActive: true
    });

    useEffect(() => {
        if (initial) {
            setForm({
                id: initial.id ?? null,
                name: initial.name ?? "",
                code: initial.code ?? "",
                categoryId: initial.categoryId ?? (categories.length ? categories[0].id : ""),
                price: initial.price ?? 0,
                stockQuantity: initial.stockQuantity ?? 0,
                isActive: initial.isActive ?? true
            });
        } else {
            setForm(prev => ({
                ...prev,
                id: null,
                name: "",
                code: "",
                categoryId: categories.length ? categories[0].id : "",
                price: 0,
                stockQuantity: 0,
                isActive: true
            }));
        }
    }, [initial, categories, open]);

    function change(e) {
        const { name, value, type, checked } = e.target;

        // convert numeric fields to numbers
        if (name === "price") {
            setForm(prev => ({ ...prev, price: value === "" ? "" : Number(value) }));
            return;
        }
        if (name === "stockQuantity") {
            setForm(prev => ({ ...prev, stockQuantity: value === "" ? "" : parseInt(value, 10) }));
            return;
        }

        if (type === "checkbox") {
            setForm(prev => ({ ...prev, [name]: checked }));
            return;
        }

        setForm(prev => ({ ...prev, [name]: value }));
    }

    function validate() {
        if (!form.name || !form.name.trim()) {
            toast.error("Enter product name");
            return false;
        }
        if (!form.code || !form.code.trim()) {
            toast.error("Enter product code");
            return false;
        }
        if (!form.categoryId) {
            toast.error("Select a category");
            return false;
        }
        if (form.price === "" || Number.isNaN(Number(form.price))) {
            toast.error("Enter a valid price");
            return false;
        }
        if (form.stockQuantity === "" || Number.isNaN(Number(form.stockQuantity))) {
            toast.error("Enter a valid stock quantity");
            return false;
        }
        return true;
    }

    function submit(e) {
        e.preventDefault();
        if (!validate()) return;

        // ensure proper types
        const payload = {
            id: form.id ?? undefined, // backend will ignore undefined id for POST
            name: form.name.trim(),
            code: form.code.trim(),
            categoryId: form.categoryId,
            price: Number(form.price),
            stockQuantity: parseInt(form.stockQuantity, 10),
            isActive: !!form.isActive
        };

        onSave(payload);
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{form.id ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogContent>
                <form id="product-form" onSubmit={submit} style={{ marginTop: 8 }}>
                    <TextField
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={change}
                        fullWidth
                        margin="dense"
                        required
                    />
                    <TextField
                        label="Code"
                        name="code"
                        value={form.code}
                        onChange={change}
                        fullWidth
                        margin="dense"
                        required
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="product-category-label">Category</InputLabel>
                        <Select
                            labelId="product-category-label"
                            label="Category"
                            name="categoryId"
                            value={form.categoryId}
                            onChange={change}
                            required
                        >
                            {categories.map(c => (
                                <MenuItem key={c.id} value={c.id}>
                                    {c.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Price"
                        name="price"
                        value={form.price}
                        onChange={change}
                        type="number"
                        inputProps={{ step: "0.01", min: 0 }}
                        fullWidth
                        margin="dense"
                    />

                    <TextField
                        label="Stock Quantity"
                        name="stockQuantity"
                        value={form.stockQuantity}
                        onChange={change}
                        type="number"
                        inputProps={{ min: 0 }}
                        fullWidth
                        margin="dense"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={form.isActive} name="isActive" onChange={change} />}
                        label="Active"
                        sx={{ mt: 1 }}
                    />
                </form>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">Cancel</Button>
                <Button type="submit" form="product-form" variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
