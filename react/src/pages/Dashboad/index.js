import React, { useEffect, useState } from "react";
import { FaBell, FaCoffee, FaDrumstickBite, FaIceCream, FaUtensils } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import axios from "../../services/axios"; // Added missing axios import
import { showToast, formatCurrency, formatDate } from "../../utils"; // Import utility functions
import { App, Badge, ContentArea, Header, HeaderActions, IconButton } from "../../styles/GlobalStyles";
import { PatientInfo, UserAvatar, WelcomeCard, CustomLink, InvoiceSumary, SummaryHeader, TotalAmount, Status, CategoryMenu, Categories, CategoriesItem, CategoryIcon, SectionHeader, OrdersSection, OrderList } from "./styled";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [appState, setAppState] = useState({
        dataLoaded: false,
        userProfile: {
            estadia: null,
            quarto: null,
            fatura: null,
            pedidos: [],
        }
    });

    const history = useHistory();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            history.push("/");
            return;
        }
        
        setUser(storedUser);
        localStorage.setItem('pacienteId', storedUser.id);
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
        
        if (!appState.dataLoaded) {
            loadUserData(storedUser.id);
        }

    }, [appState.dataLoaded]);

    const loadUserData = async (userId) => {
        try {
            const estadia = await fetchEstadiaData(userId);
            const quarto = await fetchQuartoData(estadia.quartoId);
            const fatura = await fetchFaturaData(userId);
            const pedidos = await fetchPedidosData(userId);

            setAppState({
                ...appState,
                dataLoaded: true,
                userProfile: { estadia, quarto, fatura, pedidos },
            });

            localStorage.setItem('roomNumber', quarto.numero);
            localStorage.setItem('invoiceStatus', fatura.statusPagamento);
            localStorage.setItem('invoiceValue', fatura.valorTotal);

        } catch (error) {
            console.error('Error loading user data:', error);
            showToast('Erro ao carregar informações do dashboard', 'error');
        }
    };

    const fetchEstadiaData = async (pacienteId) => {
        try {
            const response = await axios.get(`/api/pacientes/estadia-ativa/${pacienteId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching estadia data:', error);
            showToast('Não foi possível carregar os dados da estadia', 'error');
            return {};
        }
    };

    const fetchQuartoData = async (quartoId) => {
        if (!quartoId) return {};
        try {
            const response = await axios.get(`/api/quartos/${quartoId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching quarto data:', error);
            showToast('Não foi possível carregar os dados do quarto', 'error');
            return {};
        }
    };

    const fetchFaturaData = async (pacienteId) => {
        try {
            const response = await axios.get(`/api/pacientes/fatura-recente/${pacienteId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching fatura data:', error);
            showToast('Não foi possível carregar os dados da fatura', 'error');
            return {};
        }
    };

    const fetchPedidosData = async (pacienteId) => {
        try {
            const estadiaResponse = await axios.get(`/api/pacientes/estadia-ativa/${pacienteId}`);
            const estadia = estadiaResponse.data;
    
            if (!estadia || !estadia.id) {
                return [];
            }
            
            const pedidosResponse = await axios.get(`/api/estadias/${estadia.id}/pedidos`);
            const pedidos = pedidosResponse.data;
            
            const detailedPedidos = await Promise.all(
                pedidos.map(async (pedido) => {
                    try {
                        const produtosResponse = await axios.get(`/api/pedidos/${pedido.id}/produtos`);
                        const produtos = produtosResponse.data;
                        
                        const valorTotal = produtos.reduce((sum, produto) => {
                            return sum + (produto.preco * produto.quantidade);
                        }, 0);
                        
                        return {
                            ...pedido,
                            produtos,
                            valor: valorTotal,
                            detalhes: `${produtos.length} item(s)`
                        };
                    } catch (error) {
                        console.error(`Error fetching products for order ${pedido.id}:`, error);
                        return {
                            ...pedido,
                            produtos: [],
                            valor: 0,
                            detalhes: 'Detalhes indisponíveis'
                        };
                    }
                })
            );
            
            return detailedPedidos;
        } catch (error) {
            console.error('Error fetching pedidos data:', error);
            showToast('Não foi possível carregar os dados dos pedidos', 'error');
            return [];
        }
    };

    return (
        <App className="screen active">
            <Header>
                <PatientInfo>
                    <h2>Olá, {user?.name || 'Nome Indisponível'}</h2>
                    <p>Quarto <span>{appState.userProfile.quarto?.numero || 'N/A'}</span></p>
                </PatientInfo>
                <HeaderActions>
                    <UserAvatar id="profile-avatar" onClick={() => {history.push("/profile")}}>
                        <span id="user-initials">{user?.name?.split(" ").map((name) => name[0]).join("") || 'U'}</span>
                    </UserAvatar>
                    <IconButton onClick={() => {history.push("/notifications")}}>
                        <FaBell size={24}/>
                        <Badge>{cart.reduce((total, item) => total + item.quantity, 0)}</Badge>
                    </IconButton>
                </HeaderActions>
            </Header>
            <ContentArea>
                <WelcomeCard>
                    <h3>Bem-vindo ao Santa Joana</h3>
                    <p>O que você deseja pedir hoje?</p>
                </WelcomeCard>
                <InvoiceSumary>
                    <SummaryHeader>
                        <h3>Resumo da Fatura</h3>
                        <CustomLink variant="verDetalhes" to="/invoice">Ver detalhes</CustomLink>
                    </SummaryHeader>
                    <>
                        <TotalAmount><span>R$ {formatCurrency(appState.userProfile.fatura?.valorTotal || 0)}</span></TotalAmount>
                        <Status status={appState.userProfile.fatura?.statusPagamento}>
                            Status: <span>{appState.userProfile.fatura?.statusPagamento || 'N/A'}</span>
                        </Status>
                        <CustomLink to="/invoice">Ver detalhes</CustomLink>
                    </SummaryHeader>
                    <>
                        <TotalAmount><span>R$ {formatCurrency(appState.userProfile.fatura?.valorTotal || 0)}</span></TotalAmount>
                        <Status>Status: <span>{appState.userProfile.fatura?.statusPagamento || 'N/A'}</span></Status>
                    </>
                </InvoiceSumary>
                <CategoryMenu>
                    <h3>Cardápio</h3>
                    <Categories>
                        <CategoriesItem datatype="breakfast" onClick={() => history.push("/menu:?breakfast")}>
                            <CategoryIcon>
                                <FaCoffee size={24} />
                            </CategoryIcon>
                            <p>Café</p>
                        </CategoriesItem>
                        <CategoriesItem datatype="lunch" onClick={() => history.push("/menu:?lunch")}>
                            <CategoryIcon>
                                <FaUtensils size={24} />
                            </CategoryIcon>
                            <p>Almoço</p>
                        </CategoriesItem>
                        <CategoriesItem datatype="dinner" onClick={() => history.push("/menu:?dinner")}>
                            <CategoryIcon>
                                <FaDrumstickBite size={24} />
                            </CategoryIcon>
                            <p>Jantar</p>
                        </CategoriesItem>
                        <CategoriesItem datatype="dessert" onClick={() => history.push("/menu:?dessert")}>
                            <CategoryIcon>
                                <FaIceCream size={24} />
                            </CategoryIcon>
                            <p>Sobremesa</p>
                        </CategoriesItem>
                    </Categories>
                </CategoryMenu>
            </ContentArea>
            <OrdersSection>
                <SectionHeader>
                    <h3 className="section-title">Pedidos Recentes</h3>
                    <CustomLink to="/orders">Ver todos</CustomLink>
                </SectionHeader>
                <OrderList>
                    {appState.userProfile.pedidos.slice(0, 3).map(order => (
                        <div key={order.id}>
                            <p>{formatDate(new Date(order.dataPedido))}</p>
                            <p>{order.detalhes}</p>
                            <p>R$ {formatCurrency(order.valor)}</p>
                        </div>
                    ))}
                </OrderList>
            </OrdersSection>
        </App>
    );
}
