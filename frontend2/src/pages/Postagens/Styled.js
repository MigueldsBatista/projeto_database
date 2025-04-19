import styled from "styled-components";
import * as colors from '../../config/colors';

export const PostContainer = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const Titulo = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${colors.primaryColor};
  margin-bottom: 4px;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
`;

export const Descricao = styled.div`
  margin: 8px 0;
  font-size: 1rem;
  color: ${colors.primaryDarkColor};
  line-height: 1.4;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
`;

export const Selecoes = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  border-top: 1px solid #e1e8ed;
  padding-top: 12px;
  
  span {
    display: flex;
    align-items: center;
    margin-right: 40px;
    color: #657786;
    font-size: 0.9rem;
    padding: 6px 8px;
    border-radius: 18px;
    transition: background-color 0.2s;
    
    svg {
      margin-right: 6px;
    }
    
    &:hover {
      color: ${colors.primaryColor};
      background-color: rgba(195, 7, 63, 0.1);
      cursor: pointer;
    }
  }
`;

export const Criacao = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #657786;
  font-size: 0.9rem;
  
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
    border: 1px solid #e1e8ed;
  }
  
  span {
    display: flex;
    align-items: center;
    margin-right: 12px;
    
    &:last-child {
      font-size: 0.8rem;
      color: #657786;
    }
  }
`;

export const Criacao2 = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 4px 0;
  margin-top: 8px;
  font-size: 0.8rem;
  color: #657786;
  border-top: 1px solid #e1e8ed;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
    
    &:first-child {
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 16px;
      transition: color 0.2s, background-color 0.2s;
      
      &:hover {
        color: #e0245e;
        background-color: rgba(224, 36, 94, 0.1);
      }
    }
  }
`;

export const ComentariosContainer = styled.div`
  margin-top: 10px;
  padding: 12px 0px;
  border-top: 1px solid #e1e8ed;
  
  h4 {
    margin-bottom: 12px;
    color: #14171a;
    font-size: 1rem;
    font-weight: 600;
  }
`;

export const Comentario = styled.div`
  padding: 12px;
  margin-bottom: 10px;
  background-color: #f5f8fa;
  border-radius: 8px;
  border: 1px solid #e1e8ed;
  display: flex;
  flex-direction: column;
  
  .Nome{
    margin-top:5px;
  }

  div {
    display: flex;
    gap:25px;

    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: -20px;
      object-fit: cover;
      border: 1px solid ${colors.primaryDarkColor};
      ;
    }
    
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    
    > span.coment {
      display: block;
      margin-top: 4px;
      font-size: 0.95rem;
    }
  }
  
  div {
    flex-grow: 1;
    
    font-weight: 600;
    color: ${colors.primaryDarkColor};
    font-size: 0.95rem;
    
    .coment {
      max-width: 87%;
      word-wrap: break-word; 
      font-weight: normal;
      color: ${colors.primaryDarkColor};
      margin-top: 4px;
    }
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 8px;

  button {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid ${colors.primaryColor};
    background-color: white;
    color: ${colors.primaryColor};
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(29, 161, 242, 0.1);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &.active {
      background-color: ${colors.primaryColor};
      color: white;
    }
  }
`;

export const Botao = styled.div`
  justify-content: flex-start;
  align-items: center;
  display: flex;
  margin-bottom: 12px;
  
  button {
    background-color: ${colors.primaryColor};
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: ${colors.primaryColor};
    }
  }
`;

