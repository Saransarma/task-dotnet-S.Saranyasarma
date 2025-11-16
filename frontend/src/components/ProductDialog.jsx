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
    FormControl,
    FormHelperText
} from "@mui/material";
import * as Yup from "yup";
import { reach } from "yup";


const schema = Yup.object().shape({
    name: Yup.string().trim().required("Product name is required"),
    code: Yup.string().trim().required("Product code is required"),
    categoryId: Yup.string()
        .required("Category is required")
        .test("not-empty", "Category is required", value => value !== ""),
    price: Yup.number()
        .typeError("Enter a valid price")
        .min(0, "Price cannot be negative")
        .required("Price is required"),
    stockQuantity: Yup.number()
        .typeError("Enter a valid stock quantity")
        .min(0, "Stock cannot be negative")
        .required("Stock quantity is required"),
    isActive: Yup.boolean()
});

export default function ProductDialog({ open, onClose, onSave, categories = [], initial = null }) {
    const [form, setForm] = useState({
        id: null,
        name: "",
        code: "",
        categoryId: "",
        price: "",
        stockQuantity: "",
        isActive: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initial) {
            setForm({
                id: initial.id ?? initial.Id ?? null,
                name: initial.name ?? initial.ProductName ?? "",
                code: initial.code ?? initial.ProductCode ?? "",
                categoryId: initial.categoryId ?? initial.CategoryId ?? (categories[0]?.id ?? ""),
                price: initial.price ?? initial.Price ?? "",
                stockQuantity: initial.stockQuantity ?? initial.StockQuantity ?? "",
                isActive: initial.isActive ?? initial.IsActive ?? true
            });
        } else {
            setForm({
                id: null,
                name: "",
                code: "",
                categoryId: categories[0]?.id ?? "",
                price: "",
                stockQuantity: "",
                isActive: true
            });
        }
        setErrors({});
    }, [initial, categories, open]);


    function change(e) {
        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));


        reach(schema, name)
            .validate(type === "checkbox" ? checked : value)
            .then(() => setErrors(prev => ({ ...prev, [name]: "" })))
            .catch(err => setErrors(prev => ({ ...prev, [name]: err.message })));
    }


    async function submit(e) {
        e.preventDefault();

        try {
            await schema.validate(form, { abortEarly: false });
            setErrors({});

    
            const payload = {
                id: form.id ?? undefined,
                name: form.name.trim(),
                code: form.code.trim(),
                categoryId: form.categoryId,
                price: Number(form.price),
                stockQuantity: Number(form.stockQuantity),
                isActive: !!form.isActive
            };

            onSave(payload);

        } catch (validationError) {
            const fieldErrors = {};
            if (validationError.inner) {
                validationError.inner.forEach(err => {
                    fieldErrors[err.path] = err.message;
                });
            }
            setErrors(fieldErrors);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{form.id ? "Edit Product" : "Add Product"}</DialogTitle>

            <DialogContent>
                <form id="product-form" onSubmit={submit} style={{ marginTop: 8 }}>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={form.name}
                        onChange={change}
                        fullWidth
                        margin="dense"
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <TextField
                        label="Code"
                        name="code"
                        value={form.code}
                        onChange={change}
                        fullWidth
                        margin="dense"
                        error={!!errors.code}
                        helperText={errors.code}
                    />

                    <FormControl fullWidth margin="dense" error={!!errors.categoryId}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            label="Category"
                            name="categoryId"
                            value={form.categoryId}
                            onChange={change}
                        >
                            {categories.map(c => (
                                <MenuItem key={c.id} value={c.id}>
                                    {c.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
                    </FormControl>

                    <TextField
                        label="Price"
                        name="price"
                        value={form.price}
                        onChange={change}
                        type="number"
                        fullWidth
                        margin="dense"
                        error={!!errors.price}
                        helperText={errors.price}
                    />

                    <TextField
                        label="Stock Quantity"
                        name="stockQuantity"
                        value={form.stockQuantity}
                        onChange={change}
                        type="number"
                        fullWidth
                        margin="dense"
                        error={!!errors.stockQuantity}
                        helperText={errors.stockQuantity}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.isActive}
                                name="isActive"
                                onChange={change}
                            />
                        }
                        label="Active"
                        sx={{ mt: 1 }}
                    />
                </form>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">Cancel</Button>
                <Button type="submit" form="product-form" variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}