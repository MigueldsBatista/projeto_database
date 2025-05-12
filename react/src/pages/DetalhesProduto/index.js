import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { App, PrimaryButton } from "../../styles/GlobalStyles";
import axios from 'axios';
import {
    ProductDetailsContainer,
    ProductImage,
    ProductDetailsCard,
    ProductName, 
    ProductPrice,
    ProductDescription,
    QuantityControl,
    NutritionalInfoSection,
    InfoList,
    InfoItem,
    BottomNav,
} from "./styled";
import { toast } from "react-toastify";
import { formatCurrency } from "../../utils";

export default function ProductDetails() {
    const history = useHistory();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const urlParams = new URLSearchParams(location.search);
                const productId = urlParams.get("id");

                if (!productId) {
                    toast.error("ID do produto não encontrado");
                    history.push("/menu");
                    return;
                }

                const response = await axios.get(`/api/produtos/${productId}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Erro ao carregar detalhes do produto:", error);
                toast.error("Erro ao carregar detalhes do produto");
                history.push("/menu");
            }
        };

        fetchProductDetails();
    }, [location, history]);

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.nome,
                price: product.preco,
                image: product.image || "img/placeholder.png",
                quantity,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        toast.success(`${quantity}x ${product.nome} adicionado ao carrinho`);
    };

    if (!product) {
        return <p>Carregando...</p>;
    }

    return (
        <App>
            <ProductDetailsContainer>
                <header className="app-header">
                    <div className="header-left">
                        <button onClick={() => history.push("/menu")} className="back-button">
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <h2>Detalhes do Produto</h2>
                    </div>
                </header>
                <div className="content-area">
                    <ProductImage>
                        <img src={product.image || "img/placeholder.png"} alt={product.nome} />
                    </ProductImage>
                    <ProductDetailsCard>
                        <ProductName>{product.nome}</ProductName>
                        <ProductPrice>R$ {formatCurrency(product.preco)}</ProductPrice>
                        <ProductDescription>{product.descricao}</ProductDescription>
                        <QuantityControl>
                            <span className="quantity-label">Quantidade:</span>
                            <button
                                className="quantity-button"
                                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                            >
                                <i className="fas fa-minus"></i>
                            </button>
                            <span className="quantity-value">{quantity}</span>
                            <button
                                className="quantity-button"
                                onClick={() => setQuantity((prev) => prev + 1)}
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                        </QuantityControl>
                        <PrimaryButton onClick={handleAddToCart}>
                            <i className="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                        </PrimaryButton>
                    </ProductDetailsCard>
                    {product.caloriasKcal && (
                        <NutritionalInfoSection>
                            <h3>Informações Nutricionais</h3>
                            <InfoList>
                                {product.caloriasKcal && (
                                    <InfoItem>
                                        <span className="info-label">Calorias:</span>
                                        <span className="info-value">{product.caloriasKcal} kcal</span>
                                    </InfoItem>
                                )}
                                {product.proteinasG && (
                                    <InfoItem>
                                        <span className="info-label">Proteínas:</span>
                                        <span className="info-value">{product.proteinasG}g</span>
                                    </InfoItem>
                                )}
                                {product.carboidratosG && (
                                    <InfoItem>
                                        <span className="info-label">Carboidratos:</span>
                                        <span className="info-value">{product.carboidratosG}g</span>
                                    </InfoItem>
                                )}
                                {product.gordurasG && (
                                    <InfoItem>
                                        <span className="info-label">Gorduras:</span>
                                        <span className="info-value">{product.gordurasG}g</span>
                                    </InfoItem>
                                )}
                                {product.sodioMg && (
                                    <InfoItem>
                                        <span className="info-label">Sódio:</span>
                                        <span className="info-value">{product.sodioMg}mg</span>
                                    </InfoItem>
                                )}
                            </InfoList>
                        </NutritionalInfoSection>
                    )}
                </div>
            </ProductDetailsContainer>
        </App>
    );
}