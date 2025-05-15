import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../services/axios";
import { App, PrimaryButton, SecondaryButton } from "../../styles/GlobalStyles";
import {
    InvoiceHeader,
    InvoiceTotalCard,
    InvoiceSummary,
    InvoiceItemsSection,
    InvoiceItem,
    InvoiceDayGroup,
    InvoiceDayHeader,
    ActionButtons,
    InvoiceContent,
    InvoiceTitle,
} from "./styled";
import { toast } from "react-toastify";
import { formatCurrency, formatDate } from "../../utils";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";

export default function Invoice() {
    const history = useHistory();
    const [patient, setPatient] = useState(null);
    const [room, setRoom] = useState(null);
    const [invoice, setInvoice] = useState(null);
    const [stay, setStay] = useState(null);
    const [invoiceItems, setInvoiceItems] = useState([]);

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                const pacienteId = localStorage.getItem("pacienteId") || 1;

                const patientResponse = await axios.get(`/api/pacientes/${pacienteId}`);
                setPatient(patientResponse.data);

                const stayResponse = await axios.get(`/api/pacientes/estadia-ativa/${pacienteId}`);
                setStay(stayResponse.data);

                const invoiceResponse = await axios.get(`/api/pacientes/fatura-recente/${pacienteId}`);
                setInvoice(invoiceResponse.data);

                const roomResponse = await axios.get(`/api/quartos/${stayResponse.data.quartoId}`);
                setRoom(roomResponse.data);

                const ordersResponse = await axios.get(`/api/estadias/${stayResponse.data.id}/pedidos`);
                const orders = ordersResponse.data;

                const ordersWithItems = await Promise.all(
                    orders.map(async (order) => {
                        const productsResponse = await axios.get(`/api/pedidos/${order.id}/produtos`);
                        return {
                            date: new Date(order.dataPedido),
                            id: order.id,
                            status: order.status,
                            items: productsResponse.data.map((product) => ({
                                name: product.nome,
                                quantity: product.quantidade,
                                price: product.preco,
                            })),
                        };
                    })
                );

                const groupedOrders = ordersWithItems.reduce((groups, order) => {
                    const dateStr = formatDate(order.date);
                    if (!groups[dateStr]) {
                        groups[dateStr] = {
                            date: order.date,
                            items: [],
                        };
                    }
                    groups[dateStr].items.push(...order.items);
                    return groups;
                }, {});

                setInvoiceItems(Object.values(groupedOrders));
            } catch (error) {
                console.error("Erro ao carregar dados da fatura:", error);
                toast.error("Erro ao carregar os dados da fatura");
            }
        };

        fetchInvoiceData();
    }, []);

    const handleDownloadInvoice = () => {
        toast.info("Preparando download da fatura...");
        setTimeout(() => {
            toast.success("Fatura enviada para seu email");
        }, 2000);
    };

    const handleDownloadPDF = () => {
        toast.info("Gerando PDF da fatura...");
        setTimeout(() => {
            toast.success("PDF enviado para seu email");
        }, 2000);
    };

    const handleHelp = () => {
        toast.info("Conectando ao suporte...");
        setTimeout(() => {
            alert(
                "Para qualquer dúvida sobre sua fatura, por favor entre em contato com a equipe de atendimento ao cliente do Hospital Santa Joana pelo telefone (81) 3216-5555."
            );
        }, 1000);
    };

    if (!patient || !room || !invoice || !stay) {
        return <p>Carregando...</p>;
    }

    return (
        <App style={{marginBottom: "45px"}}>
            <InvoiceHeader>
                <button onClick={() => history.push("/dashboard")} className="back-button">
                    <FaArrowLeft/>
                </button>
                <h2>Minha Fatura</h2>
            </InvoiceHeader>
            <InvoiceContent>
                <InvoiceTitle>
                    <h3>Fatura Hospital Santa Joana</h3>
                    <p>
                        Atualizada em: <span>{formatDate(new Date(invoice.dataEmissao))}</span>
                    </p>
                </InvoiceTitle>
                <InvoiceTotalCard>
                    <h5>Valor Total</h5>
                    <p>R$ {formatCurrency(invoice.valorTotal)}</p>
                    <span className={invoice.statusPagamento?.toLowerCase() === 'pago' ? 'paid' : 'pending'}>
                        {invoice.statusPagamento}
                    </span>
                </InvoiceTotalCard>
                <InvoiceSummary>
                    <h3>Informações do Paciente</h3>
                    <div className="invoice-patient-info">
                        <div className="patient-info-row">
                            <span className="patient-info-label">Nome:</span>
                            <span className="patient-info-value">{patient.nome}</span>
                        </div>
                        <div className="patient-info-row">
                            <span className="patient-info-label">Quarto:</span>
                            <span className="patient-info-value">{room.numero}</span>
                        </div>
                        <div className="patient-info-row">
                            <span className="patient-info-label">Data de entrada:</span>
                            <span className="patient-info-value">{formatDate(new Date(stay.dataEntrada))}</span>
                        </div>
                    </div>
                </InvoiceSummary>
                <InvoiceItemsSection>
                    {invoiceItems
                        .filter(day => day.items && day.items.length > 0)
                        .map((day) => (
                            <InvoiceDayGroup key={day.date}>
                                <h3>Detalhes dos Consumos</h3>
                                <InvoiceDayHeader>{formatDate(new Date(day.date))}</InvoiceDayHeader>
                                {day.items.map((item, index) => (
                                    <InvoiceItem key={index}>
                                        <span className="invoice-item-name">{item.name}</span>
                                        <span className="invoice-item-quantity">x{item.quantity}</span>
                                        <span className="invoice-item-price">
                                            R$ {formatCurrency(item.price * item.quantity)}
                                        </span>
                                    </InvoiceItem>
                                ))}
                            </InvoiceDayGroup>
                        ))}
                </InvoiceItemsSection>
                <ActionButtons>
                    <SecondaryButton onClick={handleDownloadPDF}>
                        <FaFilePdf/>Baixar PDF
                    </SecondaryButton>
                    <PrimaryButton onClick={handleHelp}>Pagamento</PrimaryButton>
                </ActionButtons>
            </InvoiceContent>
        </App>
    );
}