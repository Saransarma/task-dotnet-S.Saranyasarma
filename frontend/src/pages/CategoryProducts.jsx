import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CategoryProducts() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function load() {
        setLoading(true);
        try {
            const [pRes, cRes] = await Promise.all([
                api.get("/products"),
                api.get(`/categories/${id}`)
            ]);

            const category = cRes.data;

            // 🟢 MATCH EXACT BACKEND FIELDS:
            const filtered = pRes.data.filter(
                (p) => p.categoryId === category.id
            );

            setProducts(filtered);
            setCategoryName(category.name);
        } catch (err) {
            console.error("ERR:", err);
            toast.error("Unable to load data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [id]);

    return (
        <div>
            <div className="d-flex align-items-center mb-3">
                <button
                    className="btn btn-outline-secondary me-3"
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIcon style={{ color: "white" }} />
                </button>

                <h2 style={{ color: "white" }}>
                    {categoryName} Products
                </h2>
            </div>

            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan="4" className="text-center p-3">
                                            Loading...
                                        </td>
                                    </tr>
                                )}

                                {!loading && products.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center p-3">
                                            No products in this category
                                        </td>
                                    </tr>
                                )}

                                {!loading &&
                                    products.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.name}</td>
                                            <td>{p.code}</td>
                                            <td>{p.price}</td>
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
