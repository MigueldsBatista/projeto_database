import React, { useState } from "react";

import { FaBell, FaCoffee, FaDrumstickBite, FaIceCream, FaUtensils } from "react-icons/fa";
import { App, Badge, ContentArea, Header, HeaderActions, IconButton } from "../../styles/GlobalStyles";
import { PatientInfo, UserAvatar, WelcomeCard, CustomLink, InvoiceSumary, SummaryHeader, TotalAmount, Status, CategoryMenu, Categories, CategoriesItem, CategoryIcon, SectionHeader, OrdersSection, OrderList } from "./styled";
import { useHistory } from "react-router-dom";


export default function Dashboard() {
    const history = useHistory();

    return (
        <App className="screen active">
            <Header>
                <PatientInfo>
                    <h2>Olá,<span id="patient-name"></span></h2>
                    <p>Quarto <span id="room-number"></span></p>
                </PatientInfo>
                <HeaderActions>
                    <UserAvatar id="profile-avatar" onClick={() => {history.push("/profile")}}>
                        <span id="user-initials"></span>
                    </UserAvatar>
                    <IconButton onClick={() => {history.push("/notifications")}}>
                        <FaBell size={24}/>
                        <Badge>2</Badge>
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
                        <CustomLink to="/invoice">Ver detalhes</CustomLink>
                    </SummaryHeader>
                    <>
                        <TotalAmount><span id="invoice-total-value"></span></TotalAmount>
                        <Status>Status: <span id="invoice-status"></span></Status>
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
                            <p>almoco</p>
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
            {/* Recent Orders Section - Updated structure to match orders page */}
            <OrdersSection>
                <SectionHeader>
                    <h3 className="section-title">Pedidos Recentes</h3>
                    <CustomLink to="/orders">Ver todos</CustomLink>
                </SectionHeader>
                <OrderList id="recent-orders">
                    {/*Orders will be loaded dynamically by JavaScript*/}
                </OrderList>
            </OrdersSection>
        </App>
    );
}