import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaComment, FaRegHeart, FaHeart } from 'react-icons/fa';
import { Link } from "react-router-dom";


import { Container } from "../../styles/GlobalStyles";
import { PostContainer, Titulo, Descricao, Selecoes, Criacao, Criacao2, ComentariosContainer, Comentario, PaginationContainer, Botao } from './Styled';
import axios from "../../services/axios";

export default function Postagens() {
    const [postagem, setPostagem] = useState([]);
    const [comentariosExpandidos, setComentariosExpandidos] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    useEffect(() => {
        async function getData() {
            const response = await axios.get('/post');
            setPostagem(response.data);
        }
        getData();
    }, []);

    function formatarData(dataString) {
        const data = new Date(dataString);
        const dataFormatada = data.toLocaleDateString('pt-BR');
        const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const hoje = new Date();
        const ehHoje = data.getDate() === hoje.getDate() &&
            data.getMonth() === hoje.getMonth() &&
            data.getFullYear() === hoje.getFullYear();
        if (ehHoje) {
            return `Hoje às ${horaFormatada}`;
        }
        return `${dataFormatada} às ${horaFormatada}`;
    }

    function toggleComentarios(postId) {
        setComentariosExpandidos(prev => ({ ...prev, [postId]: !prev[postId] }));
    }

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = postagem.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        if (currentPage < Math.ceil(postagem.length / postsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    }

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    return (
        <Container>
            <h1>Fórum</h1>

            {currentPosts.map(posts => (
                <PostContainer key={String(posts.id)}>
                    <div>
                        <Titulo><span>{posts.titulo}</span></Titulo>
                        <Descricao className="descricao"><span>{posts.descricao}</span></Descricao>
                        <Criacao>
                            <span><img src={posts.user.FotoDePerfils[0].url} /> {posts.user.nome}</span>
                            <span>{formatarData(posts.created_at)}</span>
                        </Criacao>
                        <Selecoes>
                            <span onClick={() => toggleComentarios(posts.id)}><FaComment /> {Array.isArray(posts.Comentarios) ? posts.Comentarios.length : posts.Comentarios?.leng} </span>
                            <span><FaThumbsUp /> </span>
                            <span><FaThumbsDown /> </span>
                        </Selecoes>
                        {comentariosExpandidos[posts.id] && (
                            <ComentariosContainer>
                                <h4>Comentários:</h4>
                                <Botao>
                                    <Link to={{ pathname: "/Comentar", state: { postId: posts.id, postTitle: posts.titulo } }}>
                                        <button>Comentar</button>
                                    </Link>
                                </Botao>
                                {Array.isArray(posts.Comentarios) ? (posts.Comentarios.length > 0 ? (posts.Comentarios.map(comentario => (
                                    <Comentario key={comentario.id}>
                                        <div>
                                            <img src={comentario.User.FotoDePerfils[0].url} /> <span className="Nome">{comentario.User.nome}</span>
                                            <span className="coment">{comentario.comentarios}</span>
                                        </div>
                                        <Criacao2>

                                            <span><FaRegHeart /> Curtir</span>
                                            <span>{formatarData(comentario.created_at)}</span>
                                        </Criacao2>
                                    </Comentario>
                                ))) :
                                    <p>Nenhum comentário ainda.</p>) :
                                    <p>Dados de comentários não disponíveis.</p>
                                }
                            </ComentariosContainer>
                        )}
                    </div>
                </PostContainer>
            ))}

            <PaginationContainer>
                <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
                {Array.from({ length: Math.ceil(postagem.length / postsPerPage) }, (_, i) => (
                    <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                        {i + 1}
                    </button>
                ))}
                <button onClick={nextPage} disabled={currentPage >= Math.ceil(postagem.length / postsPerPage)}>Próxima</button>

            </PaginationContainer>
        </Container>
    );
}
