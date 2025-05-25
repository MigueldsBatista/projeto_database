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
import { toast } from "react-toastify";
import { formatCurrency, formatDateTime } from "../../utils";
import { FaArrowLeft, FaHeadset, FaRedo } from "react-icons/fa";

export default function OrderDetails() {
    const history = useHistory();
    const location = useLocation();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const orderId = urlParams.get("id");

        if (!orderId) {
            toast.error("ID do pedido não encontrado");
            setTimeout(() => {
                history.push("/pedidos");
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
                toast.error("Erro ao carregar detalhes do pedido");
                setTimeout(() => {
                    history.push("/pedidos");
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
        toast.success("Itens adicionados ao carrinho");
        history.push("/carrinho");
    };

    const handleContactSupport = () => {
        toast.info("Conectando ao suporte...");
        setTimeout(() => {
            alert("Entre em contato com o suporte pelo telefone (81) 3216-5555.");
        }, 1000);
    };

    return (
        <App>
            <OrderDetailsContainer>
                <OrderHeader>
                    <div className="header-left">
                        <button onClick={() => history.push("/pedidos")} className="back-button">
                            <FaArrowLeft/>
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
                            <FaHeadset/> Suporte
                        </SecondaryButton>
                        <PrimaryButton onClick={handleReorder}>
                            <FaRedo/>Repetir Pedido
                        </PrimaryButton>
                    </ActionButtons>
                </div>
            </OrderDetailsContainer>
        </App>
    );
}