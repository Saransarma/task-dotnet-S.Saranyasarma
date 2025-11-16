import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryLogo from "../assets/Inventory.png";

export default function Navbar() {
    const location = useLocation();
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img
                        src={InventoryLogo}
                        alt="Inventory Logo"
                        style={{
                            width: "30px",
                            height: "30px",
                            marginRight: "8px",
                            borderRadius: "50%",
                            objectFit: "cover"
                        }}
                    />
                    <strong>INVENTORY</strong>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navMenu">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">
                                <DashboardIcon fontSize="small" className="me-1" /> Dashboard
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/products" ? "active" : ""}`} to="/products">
                                <Inventory2Icon fontSize="small" className="me-1" /> Products
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/categories" ? "active" : ""}`} to="/categories">
                                <CategoryIcon fontSize="small" className="me-1" /> Categories
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
