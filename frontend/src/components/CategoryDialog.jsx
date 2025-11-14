import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

export default function CategoryDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState("");

    useEffect(() => {
        setName(initial?.name ?? "");
    }, [initial, open]);

    function submit(e) {
        e.preventDefault();
        onSave({ id: initial?.id ?? null, name: name.trim() });
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{initial ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogContent>
                <div className="mt-2" style={{ minWidth: 320 }}>
                    <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth margin="dense" />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">Cancel</Button>
                <Button onClick={submit} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
