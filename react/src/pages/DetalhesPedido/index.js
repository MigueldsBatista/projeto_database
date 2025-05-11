import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { App, PrimaryButton, SecondaryButton } from "../../styles/GlobalStyles";
import axios from 'axios';
import {
    OrderDetailsContainer,
    OrderHeader,
    OrderStatus,
    OrderItemsList,
    OrderItemRow,
    OrderNotesSection,
    OrderTotalSection,
    ActionButtons,
    BottomNav,
} from "./styled";
import { showToast, formatCurrency, formatDateTime } from "../../utils";

export default function OrderDetails() {
    const history = useHistory();
    const location = useLocation();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const orderId = urlParams.get("id");

        if (!orderId) {
            showToast("ID do pedido não encontrado", "error");
            setTimeout(() => {
                history.push("/orders");
            }, 3000);
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`/api/pedidos/${orderId}`);
                const produtosResponse = await axios.get(`/api/pedidos/${orderId}/produtos`);
                const produtos = produtosResponse.data;

                const total = produtos.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

                setOrder({
                    ...response.data,
                    produtos,
                    total,
                });
            } catch (error) {
                console.error("Erro ao carregar detalhes do pedido:", error);
                showToast("Erro ao carregar detalhes do pedido", "error");
                setTimeout(() => {
                    history.push("/orders");
                }, 3000);
            }
        };

        fetchOrderDetails();
    }, [location, history]);

    if (!order) {
        return <p>Carregando...</p>;
    }

    const handleReorder = () => {
        const cart = order.produtos.map((item) => ({
            id: item.id,
            name: item.nome,
            price: item.preco,
            quantity: item.quantidade,
        }));
        localStorage.setItem("cart", JSON.stringify(cart));
        showToast("Itens adicionados ao carrinho", "success");
        history.push("/carrinho");
    };

    const handleContactSupport = () => {
        showToast("Conectando ao suporte...", "info");
        setTimeout(() => {
            alert("Entre em contato com o suporte pelo telefone (81) 3216-5555.");
        }, 1000);
    };

    return (
        <App>
            <OrderDetailsContainer>
                <OrderHeader>
                    <div className="header-left">
                        <button onClick={() => history.push("/orders")} className="back-button">
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <h2>Detalhes do Pedido</h2>
                    </div>
                </OrderHeader>
                <div className="content-area">
                    <div className="order-header">
                        <h3 className="order-number">Pedido #{order.id}</h3>
                        <p className="order-date">{formatDateTime(new Date(order.dataPedido))}</p>
                    </div>
                    <OrderStatus>
                        <h3>Status do Pedido</h3>
                        <span className={`order-status-large ${order.status.toLowerCase()}`}>
                            {order.status}
                        </span>
                    </OrderStatus>
                    <OrderItemsList>
                        <h3>Itens do Pedido</h3>
                        {order.produtos.map((item) => (
                            <OrderItemRow key={item.id}>
                                <div className="item-info">
                                    <h4>{item.nome}</h4>
                                    <p>{item.descricao || ""}</p>
                                </div>
                                <div className="item-quantity">{item.quantidade}x</div>
                                <div className="item-price">
                                    R$ {formatCurrency(item.preco * item.quantidade)}
                                </div>
                            </OrderItemRow>
                        ))}
                    </OrderItemsList>
                    <OrderNotesSection>
                        <h3>Observações</h3>
                        <p>{order.observacoes || "Sem observações"}</p>
                    </OrderNotesSection>
                    <OrderTotalSection>
                        <div className="order-total-row">
                            <span>Total</span>
                            <span>R$ {formatCurrency(order.total)}</span>
                        </div>
                    </OrderTotalSection>
                    <ActionButtons>
                        <SecondaryButton onClick={handleContactSupport}>
                            <i className="fas fa-headset"></i> Suporte
                        </SecondaryButton>
                        <PrimaryButton onClick={handleReorder}>
                            <i className="fas fa-redo"></i> Repetir Pedido
                        </PrimaryButton>
                    </ActionButtons>
                </div>
            </OrderDetailsContainer>
        </App>
    );
}