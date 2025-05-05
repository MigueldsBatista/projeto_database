import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../services/axios";
import { App, PrimaryButton } from "../../styles/GlobalStyles";
import {
    MenuContainer,
    MenuHeader,
    SearchBar,
    CategoryTabs,
    ProductsGrid,
    ProductCard,
    EmptyState,
    BottomNav,
} from "./styled";
import { showToast, formatCurrency } from "../../utils";

export default function Menu() {
    const history = useHistory();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                // Fetch categories
                const categoriesResponse = await axios.get("/api/categoria-produto");
                setCategories(categoriesResponse.data);

                // Fetch products
                const productsResponse = await axios.get("/api/produtos");
                setProducts(productsResponse.data);
                setFilteredProducts(productsResponse.data);
            } catch (error) {
                console.error("Erro ao carregar dados do menu:", error);
                showToast("Erro ao carregar os produtos. Tente novamente mais tarde.", "error");
            }
        };

        fetchMenuData();
    }, []);

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
        setSearchTerm("");

        if (categoryId === "all") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter((product) => product.categoriaId === categoryId));
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term) {
            setFilteredProducts(
                products.filter(
                    (product) =>
                        product.nome.toLowerCase().includes(term) ||
                        product.descricao.toLowerCase().includes(term)
                )
            );
        } else {
            handleCategoryChange(activeCategory);
        }
    };

    const handleAddToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: product.id, name: product.nome, price: product.preco, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        showToast(`${product.nome} adicionado ao carrinho`, "success");
    };

    return (
        <App>
            <MenuContainer>
                <MenuHeader>
                    <div className="header-left">
                        <button onClick={() => history.push("/dashboard")} className="back-button">
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <h2>Cardápio</h2>
                    </div>
                    <div className="header-actions">
                        <button className="icon-button">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </MenuHeader>
                <SearchBar>
                    <input
                        type="text"
                        placeholder="Buscar no cardápio"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </SearchBar>
                <CategoryTabs>
                    <button
                        className={`tab-item ${activeCategory === "all" ? "active" : ""}`}
                        onClick={() => handleCategoryChange("all")}
                    >
                        Todos
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`tab-item ${activeCategory === category.id ? "active" : ""}`}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            {category.nome}
                        </button>
                    ))}
                </CategoryTabs>
                <ProductsGrid>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id}>
                                <div className="product-image">
                                    <img src={product.image || "img/placeholder.png"} alt={product.nome} />
                                </div>
                                <div className="product-info">
                                    <h3>{product.nome}</h3>
                                    <p className="product-description">{product.descricao}</p>
                                    <div className="product-price-action">
                                        <p className="product-price">R$ {formatCurrency(product.preco)}</p>
                                        <button
                                            className="add-to-cart-button"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </ProductCard>
                        ))
                    ) : (
                        <EmptyState>Nenhum produto encontrado</EmptyState>
                    )}
                </ProductsGrid>
                <BottomNav>
                    <a href="/dashboard" className="nav-item">
                        <i className="fas fa-home"></i>
                        <span>Início</span>
                    </a>
                    <a href="/menu" className="nav-item active">
                        <i className="fas fa-utensils"></i>
                        <span>Cardápio</span>
                    </a>
                    <a href="/carrinho" className="nav-item">
                        <i className="fas fa-shopping-cart"></i>
                        <span>Carrinho</span>
                    </a>
                    <a href="/orders" className="nav-item">
                        <i className="fas fa-clipboard-list"></i>
                        <span>Pedidos</span>
                    </a>
                    <a href="/fatura" className="nav-item">
                        <i className="fas fa-file-invoice-dollar"></i>
                        <span>Fatura</span>
                    </a>
                </BottomNav>
            </MenuContainer>
        </App>
    );
}