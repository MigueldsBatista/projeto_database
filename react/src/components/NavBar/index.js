import React from "react";
import { FaHome, FaShoppingCart, FaClipboardList, FaFileInvoiceDollar, FaBookOpen } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Nav } from "./styled";
 
export default function NavBar() {
    return (
        <Nav>
            <Link to='/dashboard' className="nav-item">
                <FaHome size={24}/>
                <span>Inicio</span>
            </Link>
            <Link to='/menu' className="nav-item">
                <FaBookOpen size={24}/>
                <span>Cardápio</span>
            </Link>
            <Link to='/cart' className="nav-item">
                <FaShoppingCart size={24} />
                <span>Carrinho</span>
                <span className="badge">0</span>
            </Link>
            <Link to='/orders' className="nav-item">
                <FaClipboardList size={24}/>
                <span>Pedidos</span>
            </Link> 
            <Link to='/invoice' className="nav-item">
                <FaFileInvoiceDollar size={24}/>
                <span>Faturas</span>
            </Link>         
        </Nav>
    );
}