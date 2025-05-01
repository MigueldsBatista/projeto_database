import React from "react";
import { FaHome, FaUtensils, FaShoppingCart, FaClipboardList, FaFileInvoiceDollar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Nav } from "./styled";
 
export default function NavBar() {
    return (
        <Nav>
            <Link to='/dashboard' className="nav-item">
                <FaHome />
                <span>Inicio</span>
            </Link>
            <Link to='/menu' className="nav-item">
                <FaUtensils />
                <span>Cardápio</span>
            </Link>
            <Link to='/cart' className="nav-item">
                <FaShoppingCart />
                <span>Carrinho</span>
                <span className="badge">0</span>
            </Link>
            <Link to='/orders' className="nav-item">
                <FaClipboardList />
                <span>Pedidos</span>
            </Link> 
            <Link to='/invoice' className="nav-item">
                <FaFileInvoiceDollar />
                <span>Faturas</span>
            </Link>         
        </Nav>
    );
}