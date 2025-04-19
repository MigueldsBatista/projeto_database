import styled from "styled-components";
import * as colors from '../../config/colors';

export const UserContainer = styled.div`
margin-top:20px;
    text-align:center;
    justify-content:center;
    display:flex;
    align-items:center;

div{
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:space-between;
    padding: 5px 0;
}
div+div{
    border-top: 1px solid #e00;
}
`;

export const ProfilePicture = styled.div`
img{
    width:300px;
    height: 300px;
    border-radius:50%;
    border: 1px solid #e00;
}
`;

export const FileInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 15px 0;
    
    input[type="file"] {
        width: 100%;
        padding: 8px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
    }
    
    button {
        margin-top: 5px;
        padding: 8px 15px;
        background-color: ${colors.primaryColor};
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        
        &:hover {
            filter: brightness(85%);
        }
        
        &:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
    }
`;

export const PostContainer = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top:20px;
`;

export const Titulo = styled.div`
    font-size: 1.5rem;
    color: #b1003b;
    margin: 0;
    border-bottom: 2px solid #000;
    word-break: break-word;
    overflow-wrap: break-word;
    white-space: normal;
`;

export const Descricao = styled.div`
    margin-top: 1rem;
    word-break: break-word;
    overflow-wrap: break-word;
    white-space: normal;
`;