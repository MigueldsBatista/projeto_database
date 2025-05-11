import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { App, PrimaryButton } from "../../styles/GlobalStyles";
import axios from 'axios';
import {
    OrdersContainer,
    OrdersTabs,
    OrdersTab,
    OrderList,
    OrderCard,
    EmptyOrdersMessage,
    BottomNav,
} from "./styled";
import { showToast, formatCurrency, formatRelativeDate } from "../../utils";

export default function Orders() {
    const history = useHistory();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user) {
                    showToast("Você precisa estar logado para acessar seus pedidos", "error");
                    history.push("/login");
                    return;
                }

                // Simula a busca de pedidos do backend
                const response = await axios.get(`/api/pedidos/${user.id}`);
                const pedidos = response.data;

                setOrders(pedidos);
                setFilteredOrders(pedidos);
            } catch (error) {
                console.error("Erro ao carregar pedidos:", error);
                showToast("Erro ao carregar pedidos. Tente novamente mais tarde.", "error");
            }
        };

        fetchOrders();
    }, [history]);

    const handleTabChange = (status) => {
        setActiveTab(status);

        if (status === "all") {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter((order) => order.status.toLowerCase() === status));
        }
    };

    const handleOrderClick = (orderId) => {
        history.push(`/order-details?id=${orderId}`);
    };

    if (orders.length === 0) {
        return (
            <App>
                <OrdersContainer>
                    <EmptyOrdersMessage>
                        <i className="fas fa-clipboard-list"></i>
                        <h3>Nenhum pedido encontrado</h3>
                        <p>Você ainda não possui pedidos nesta categoria</p>
                        <PrimaryButton onClick={() => history.push("/menu")}>
                            Fazer um Pedido
                        </PrimaryButton>
                    </EmptyOrdersMessage>
                </OrdersContainer>
            </App>
        );
    }

    return (
        <App>
            <OrdersContainer>
                <header className="app-header">
                    <div className="header-left">
                        <button onClick={() => history.push("/dashboard")} className="back-button">
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <h2>Meus Pedidos</h2>
                    </div>
                </header>
                <OrdersTabs>
                    <OrdersTab
                        className={activeTab === "all" ? "active" : ""}
                        onClick={() => handleTabChange("all")}
                    >
                        Todos
                    </OrdersTab>
                    <OrdersTab
                        className={activeTab === "pending" ? "active" : ""}
                        onClick={() => handleTabChange("pending")}
                    >
                        Pendentes
                    </OrdersTab>
                    <OrdersTab
                        className={activeTab === "in-progress" ? "active" : ""}
                        onClick={() => handleTabChange("in-progress")}
                    >
                        Em preparo
                    </OrdersTab>
                    <OrdersTab
                        className={activeTab === "delivered" ? "active" : ""}
                        onClick={() => handleTabChange("delivered")}
                    >
                        Entregues
                    </OrdersTab>
                </OrdersTabs>
                <OrderList>
                    {filteredOrders.map((order) => (
                        <OrderCard key={order.id} onClick={() => handleOrderClick(order.id)}>
                            <div className="order-info">
                                <p className="order-date">
                                    {formatRelativeDate(new Date(order.dataPedido))}
                                </p>
                                <p className="order-items">
                                    {order.detalhes || "Detalhes não disponíveis"}
                                </p>
                                <p className="order-price">
                                    R$ {formatCurrency(order.valor || 0)}
                                </p>
                            </div>
                            <div className="order-status">
                                <span className={`status-pill ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                        </OrderCard>
                    ))}
                </OrderList>
            </OrdersContainer>
            <BottomNav>
                <a href="/dashboard" className="nav-item">
                    <i className="fas fa-home"></i>
                    <span>Início</span>
                </a>
                <a href="/menu" className="nav-item">
                    <i className="fas fa-utensils"></i>
                    <span>Cardápio</span>
                </a>
                <a href="/carrinho" className="nav-item">
                    <i className="fas fa-shopping-cart"></i>
                    <span>Carrinho</span>
                </a>
                <a href="/orders" className="nav-item active">
                    <i className="fas fa-clipboard-list"></i>
                    <span>Pedidos</span>
                </a>
                <a href="/fatura" className="nav-item">
                    <i className="fas fa-file-invoice-dollar"></i>
                    <span>Fatura</span>
                </a>
            </BottomNav>
        </App>
    );
}