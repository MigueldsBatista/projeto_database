import styled from "styled-components";

import * as colors from '../../config/colors'

export const Form = styled.form`
    display:flex;
    flex-direction:column;
    margin-top:20px;
    label{
        display:flex;
        flex-direction:column;
        margin-bottom:20px;
    }

    input{
        height:40px;
        font-size:18px;
        border: 1px solid #ddd;
        padding: 0 10px;
        border-radius:4px;
    

        &:focus{
            border: 1px solid ${colors.primaryColor};
        }
    }
`;

export const Descricao = styled.input`
height: 120px;
  font-size: 18px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  resize: vertical;

  &:focus {
    border: 1px solid ${colors.primaryColor};
  }
`;

