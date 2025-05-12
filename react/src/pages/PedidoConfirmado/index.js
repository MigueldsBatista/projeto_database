import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { App, PrimaryButton, SecondaryButton } from "../../styles/GlobalStyles";
import {
    ConfirmationContainer,
    SuccessAnimation,
    OrderInfoCard,
    DeliveryTime,
    ActionButtons,
    BottomNav,
} from "./styled";
import { toast } from "react-toastify";
import { formatCurrency, formatDateTime } from "../../utils";
import { FaCheck, FaClock } from "react-icons/fa";

export default function OrderConfirmation() {
    const history = useHistory();
    const location = useLocation();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const orderId = urlParams.get("id");

        if (!orderId) {
            toast.error("ID do pedido não encontrado");
            setTimeout(() => {
                history.push("/orders");
            }, 3000);
            return;
        }

        const fetchOrderData = () => {
            const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));
            if (lastOrder && (lastOrder.id === orderId || lastOrder.dataPedido === orderId)) {
                setOrder(lastOrder);
                return;
            }

            const orders = JSON.parse(localStorage.getItem("orders")) || [];
            const foundOrder = orders.find(
                (o) => o.id === orderId || o.dataPedido === orderId
            );
            if (foundOrder) {
                setOrder(foundOrder);
                return;
            }

            toast.error("Pedido não encontrado");
            setTimeout(() => {
                history.push("/orders");
            }, 3000);
        };

        fetchOrderData();
    }, [location, history]);

    if (!order) {
        return <p>Carregando...</p>;
    }

    const handleViewOrderDetails = () => {
        const idToUse = order.dataPedido || order.id;
        history.push(`/order-details?id=${idToUse}`);
    };

    const handleGoHome = () => {
        history.push("/dashboard");
    };

    return (
        <App>
            <ConfirmationContainer>
                <SuccessAnimation>
                    <FaCheck/>
                </SuccessAnimation>
                <h1 className="confirmation-title">Pedido Confirmado!</h1>
                <p className="confirmation-message">
                    Seu pedido foi recebido e será preparado em breve.
                </p>
                <OrderInfoCard>
                    <div className="order-row">
                        <span className="label">Número do Pedido</span>
                        <span className="value">{order.id}</span>
                    </div>
                    <div className="order-row">
                        <span className="label">Data</span>
                        <span className="value">{formatDateTime(new Date(order.date || order.dataPedido))}</span>
                    </div>
                    <div className="order-row">
                        <span className="label">Total</span>
                        <span className="value">R$ {formatCurrency(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
                    </div>
                    <div className="order-row">
                        <span className="label">Status</span>
                        <span className="value">Pendente</span>
                    </div>
                </OrderInfoCard>
                <DeliveryTime>
                    <FaClock/>
                    <p>
                        Tempo estimado de entrega: <strong>30 minutos</strong>
                    </p>
                </DeliveryTime>
                <p className="confirmation-message">
                    O valor deste pedido será adicionado à sua fatura e será pago durante o processo de alta.
                </p>
                <ActionButtons>
                    <PrimaryButton onClick={handleViewOrderDetails}>
                        Ver Detalhes do Pedido
                    </PrimaryButton>
                    <SecondaryButton onClick={handleGoHome}>
                        Voltar ao Início
                    </SecondaryButton>
                </ActionButtons>
            </ConfirmationContainer>
        </App>
    );
}