import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../services/axios";
import { App, PrimaryButton, SecondaryButton } from "../../styles/GlobalStyles";
import {
    CartContainer,
    CartHeader,
    CartItemsContainer,
    CartSummary,
    EmptyCartMessage,
    CartItem,
    CartTotalRow,
    CartNotes,
} from "./styled";
import { showToast, formatCurrency } from "../../utils/index";
import { FaArrowLeft, FaMinus, FaPlus, FaShoppingCart, FaTrash } from "react-icons/fa";

export default function Cart() {
    const history = useHistory();
    const [cart, setCart] = useState([]);
    const [notes, setNotes] = useState("");
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Carrega o carrinho do localStorage
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
        calculateTotal(storedCart);
    }, []);

    const calculateTotal = (cartItems) => {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(total);
    };

    const handleClearCart = () => {
        if (cart.length > 0 && window.confirm("Tem certeza que deseja esvaziar o carrinho?")) {
            setCart([]);
            localStorage.setItem("cart", JSON.stringify([]));
            showToast("Carrinho esvaziado com sucesso", "success");
        } else {
            showToast("Seu carrinho já está vazio", "info");
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            showToast("Seu carrinho está vazio", "error");
            return;
        }

        try {
            showToast("Processando pedido...", "info");

            const pacienteId = localStorage.getItem("pacienteId") || 1;

            const estadiaResponse = await axios.get(`/api/pacientes/estadia-ativa/${pacienteId}`);
            const estadia = estadiaResponse.data;

            if (!estadia) {
                showToast("Não foi possível encontrar uma estadia ativa", "error");
                return;
            }

            const orderResponse = await axios.post("/api/pedidos/create", {
                dataEntradaEstadia: estadia.id,
                status: "PENDENTE",
                notes,
            });
            const order = orderResponse.data;

            await Promise.all(
                cart.map((item) =>
                    axios.post("/api/produto-pedidos/create", {
                        produtoId: item.id,
                        dataPedido: order.dataPedido,
                        quantidade: item.quantity,
                    })
                )
            );

            setCart([]);
            localStorage.setItem("cart", JSON.stringify([]));

            localStorage.setItem(
                "lastOrder",
                JSON.stringify({
                    id: order.dataPedido,
                    date: new Date(order.dataPedido),
                    items: cart,
                    notes,
                    total,
                })
            );

            showToast("Pedido realizado com sucesso!", "success");
            history.push(`/order-confirmation?id=${encodeURIComponent(order.dataPedido)}`);
        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            showToast("Erro ao enviar pedido. Por favor, tente novamente.", "error");
        }
    };

    const handleQuantityChange = (id, change) => {
        const updatedCart = cart.map((item) => {
            if (item.id === id) {
                const newQuantity = item.quantity + change;
                return { ...item, quantity: newQuantity > 0 ? newQuantity : 0 };
            }
            return item;
        }).filter((item) => item.quantity > 0);

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
    };

    const handleRemoveItem = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
        showToast("Item removido do carrinho", "success");
    };

    if (cart.length === 0) {
        return (
            <App>
                <CartContainer>
                    <CartHeader>
                        <button onClick={() => history.push("/dashboard")} className="back-button">
                            <FaArrowLeft />
                        </button>
                        <h2>Carrinho</h2>
                    </CartHeader>
                    <EmptyCartMessage>
                        <FaShoppingCart/>
                        <h3>Seu carrinho está vazio</h3>
                        <p>Adicione itens do cardápio para fazer um pedido</p>
                        <PrimaryButton onClick={() => history.push("/menu")}>Ver Cardápio</PrimaryButton>
                    </EmptyCartMessage>
                </CartContainer>
            </App>
        );
    }

    return (
        <App>
            <CartContainer>
                <CartHeader>
                    <button onClick={() => history.push("/dashboard")} className="back-button">
                        <FaArrowLeft />
                    </button>
                    <h2>Carrinho</h2>
                    <button onClick={handleClearCart} className="icon-button">
                        <FaTrash />
                    </button>
                </CartHeader>
                <CartItemsContainer>
                    {cart.map((item) => (
                        <CartItem key={item.id}>
                            <div className="cart-item-image">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="cart-item-details">
                                <p className="cart-item-name">{item.name}</p>
                                <p className="cart-item-price">R$ {formatCurrency(item.price)}</p>
                                <div className="cart-quantity-control">
                                    <button onClick={() => handleQuantityChange(item.id, -1)} className="quantity-button decrease">
                                       <FaMinus/>
                                    </button>
                                    <span className="quantity-value">{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.id, 1)} className="quantity-button increase">
                                        <FaPlus/>
                                    </button>
                                    <button onClick={() => handleRemoveItem(item.id)} className="icon-button remove">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </CartItem>
                    ))}
                </CartItemsContainer>
                <CartSummary>
                    <CartTotalRow>
                        <span>Total</span>
                        <span>R$ {formatCurrency(total)}</span>
                    </CartTotalRow>
                    <CartNotes>
                        <label htmlFor="order-notes">Observações do pedido</label>
                        <textarea
                            id="order-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ex: Sem cebola, sem açúcar, etc."
                        ></textarea>
                    </CartNotes>
                    <PrimaryButton onClick={handleCheckout}>Confirmar Pedido</PrimaryButton>
                </CartSummary>
            </CartContainer>
        </App>
    );
}