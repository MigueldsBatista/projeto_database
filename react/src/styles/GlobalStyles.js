import styled, { createGlobalStyle } from 'styled-components'
import { backgroundColor, borderColor, errorColor, primaryBlue, secondaryBlue, sucessColor, textPrimaryColor, warningColor } from '../config/colors';
import { fontSize } from '../config/font';
import { spacing } from '../config/spacing';
import { borderRadius } from '../config/border';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
 
export default createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
 
     html,body {
         font-family: 'Roboto', sans-serif;
         background-color: ${backgroundColor};
         color: ${textPrimaryColor};
         font-size: ${fontSize.body};
         line-height: 1.5;
         -webkit-font-smoothing: antialiased;
         -moz-osx-font-smoothing: grayscale;
     }
     /* screen */
 
     .screen {
         display: none;
         height: 100%;
         width: 100%;
         position: absolute;
         top: 0;
         left: 0;
         flex-direction: column;
         background-color: ${backgroundColor};
         overflow-y: auto;
         overflow-x: hidden;
     }
 
     .screen.active {
         display: flex;
     }
 
     /* Splash Screen */
     .splash-screen {
         justify-content: center;
         align-items: center;
         background-color: ${backgroundColor};
     }
 
     .splash-content {
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         color: white;
     }
 
     .splash-content .logo {
         width: 150px;
         margin-bottom: ${spacing.xl};
     }
 
     .loader {
         width: 40px;
         height: 40px;
         border: 4px solid rgba(255, 255, 255, 0.3);
         border-radius: 50%;
         border-top-color: white;
         animation: spin 1s ease-in-out infinite;
     }
 
     @keyframes spin {
         to { transform: rotate(360deg); }
     }
 `;
 
 /* como usar o GlobalStyles:
 
     Voce entra no App.js, que seria o arquivo geral do projeto react e importa ele dessa forma: 
     
     import GlobalStyles from '../../styles/GlobalStyles';
 
     <outros componentes>
     <GlobalStyles />
     <outros componentes>
 
     assim todo o projeto automaticamente ja vai ter os coisas que a gente definiu aqui em tuo 
 */
 
 export const Header = styled.header`
     background-color: white;
     padding: ${spacing.md} ${spacing.md};
     display: flex;
     justify-content: space-between;
     align-items: center;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
     z-index: 10;
 
     h2{
         font-size: ${fontSize.xl};
         font-weight: 700;
         color: ${textPrimaryColor};
     }
     
     .app-header.with-search {
         padding: ${spacing.md};
     }
 
     .header-left {
         display: flex;
         align-items: center;
         gap: ${spacing.md};
     }
     
     
 `;

export const HeaderActions = styled.div`
    display: flex;
    gap: ${spacing.sm};
`;
 
 
 /* forma de uso do header:
 
     diferente do global isso aqui pode ser importado pra qualquer classe
     no nosso codigo normal todos recebiam a classe app-header ai eu n vi
     a necessidade e deixei como nosso header generico pra ter todos esses
     caso achem que ficou estranho mudem, isso é que nem css normal, so muda
     que da pra importar e reutilizar esse css em mais de um arquivo
 
     import { Header } from '../../styles/GlobalStyles';
 
     <Header className="nome-da-classe">
         se colocar um h2 ele ja vai receber os estilos setados no h2 ali do header
         //conteudo do header
     </Header>
 */  
 
export const ContentArea = styled.div`
    flex:1;
    padding: ${spacing.md};
    overflow-y: auto;
`;
 
 /* forma de uso do content area:
     mesmo esquema do header, so importar e usar
     import { ContentArea } from '../../styles/GlobalStyles';
 
     <ContentArea>
         //conteudo do content area
     </ContentArea>
 */

export const App = styled.div`
    max-width: 500px;
    margin: 0 auto;
    height: 100vh;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: ${backgroundColor};
`;

/* forma de uso do app:
     mesmo esquema do header, so importar e usar
     import { App } from '../../styles/GlobalStyles';
 
     <App>
         //conteudo do app
     </App>
 */

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${spacing.xl};
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: ${backgroundColor};
`;

/* forma de uso do container:
     import { Container } from '../../styles/GlobalStyles';
 
     <Container>
         //conteudo do container
     </Container>
 */

export const Card = styled.div`
    background-color: white;
    border-radius: ${borderRadius.lg};
    padding: ${spacing.md};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

/* forma de uso do card:
     import { Card } from '../../styles/GlobalStyles';
 
     <Card>
         //conteudo do card
     </Card>
 */

export const PrimaryButton = styled.button`
    width: 100%;
    height: 50px;
    background-color: ${primaryBlue};
    color: white;
    border: none;
    border-radius: ${borderRadius.sm};
    font-size: ${fontSize.button};
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;
    :hover{
        opacity: 0.9;
    }
    :active{
        opacity: 0.8;
    }
    :disabled{
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

/* forma de uso do primary button:
     import { PrimaryButton } from '../../styles/GlobalStyles';
 
     <PrimaryButton>
         //conteudo do button
     </PrimaryButton>
 */

export const SecondaryButton = styled.button`
    width: 100%;
    height: 56px;
    background-color: transparent;
    color: ${primaryBlue};
    border: 1px solid ${primaryBlue};
    border-radius: ${borderRadius.md};
    font-size: ${fontSize.button};
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    :hover{
        opacity: 0.9;
    }
    :active{
        opacity: 0.8;
    }
    :disabled{
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

/* forma de uso do secondary button:
     import { SecondaryButton } from '../../styles/GlobalStyles';
 
     <SecondaryButton>
         //conteudo do button
     </SecondaryButton>
 */ 

export const BiometricButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing.sm};
    background-color: transparent;
    border: 1px solid ${borderColor};
    border-radius: ${borderRadius.md};
    padding: ${spacing.md};
    width: 100%;
    color: ${textPrimaryColor};
    font-size: ${fontSize.body};
    cursor: pointer;
    transition: background-color 0.2s ease;
    i{
        font-size: 24px;
        color: ${primaryBlue};
    }
    :hover{
        background-color: ${backgroundColor};
    }
`;

/* forma de uso do biometric button:
     import { BiometricButton } from '../../styles/GlobalStyles';
 
     <BiometricButton>
         <i className="biometric-icon"></i>
         //conteudo do button
     </BiometricButton>
 */

export const IconButton = styled.button`
    width: 44px;
    height: 44px;
    background-color: transparent;
    border: none;
    border-radius: ${borderRadius.sm};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${textPrimaryColor};
    font-size: 20px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    position: relative;
    :hover{
        background-color: ${backgroundColor};
    }
    :active{
        background-color: ${borderColor};
    }
`;

/* forma de uso do icon button:
     import { IconButton } from '../../styles/GlobalStyles';
 
     <IconButton>
         <i className="icon-name"></i>
         //conteudo do button
     </IconButton>
 */

export const BackButton = styled.button`
    width: 44px;
    height: 44px;
    background-color: transparent;
    border: none;
    border-radius: ${borderRadius.sm};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${textPrimaryColor};
    font-size: 20px;
    cursor: pointer;
`;

/* forma de uso do back button:
     import { BackButton } from '../../styles/GlobalStyles';
 
     <BackButton>
         <i className="bi bi-arrow-left"></i>
         //conteudo do button
     </BackButton>
 */

export const Badge = styled.div`
    background-color: ${errorColor};
    color: white;
    font-size: 10px;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 ${spacing.xs};
`;

/* forma de uso do badge:
     import { Badge } from '../../styles/GlobalStyles';
 
     <Badge>
         //conteudo do badge
     </Badge>
 */

export const StatusPill = styled.div`
    padding: 4px 12px;
    border-radius: ${borderRadius.full};
    font-size: 12px;
    font-weight: 500;
    .pending{
        background-color: ${warningColor};
        color: white;
    }
    .in-progress{
        background-color: ${secondaryBlue};
        color: white;
    }
    .delivered{
        background-color: ${sucessColor};
        color: white;
    }
    .canceled{
        background-color: ${errorColor};
        color: white;
    }
`;

/* forma de uso do status pill:
     import { StatusPill } from '../../styles/GlobalStyles';
 
     <StatusPill className="pending">
         //conteudo do status pill
     </StatusPill>
 */

export const Divider = styled.div`
    height: 1px;
    background-color: ${borderColor};
    margin: ${spacing.md} 0;
`;

/* forma de uso do divider:
     import { Divider } from '../../styles/GlobalStyles';
 
     <Divider>
         //conteudo do divider
     </Divider>
 */

export const QuantitySelector = styled.div`
    display: flex;
    align-items: center;
    gap: ${spacing.md};
`;

/* forma de uso do quantity selector:
     import { QuantitySelector } from '../../styles/GlobalStyles';
 
     <QuantitySelector>
         //conteudo do quantity selector
     </QuantitySelector>
 */

export const QuantityButton = styled.button`
    width: 36px;
    height: 36px;
    background-color: ${backgroundColor};
    border: 1px solid ${borderColor};
    border-radius: ${borderRadius.sm};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
`;

/* forma de uso do quantity button:
     import { QuantityButton } from '../../styles/GlobalStyles';
 
     <QuantityButton>
         //conteudo do quantity button
     </QuantityButton>
 */

export const CustomLink = styled(Link)`
        color: ${primaryBlue};
        text-decoration: none;
        font-weight: 500;
    ${(props) => props.variant === "forgot" &&
        `
            color: ${primaryBlue};
            font-size: ${fontSize.caption};
            text-align: center;
            margin-top: ${spacing.md};
        `}
    ${(props) => props.variant === "register" &&
        `
            color: ${primaryBlue};
            font-weight: 500;
        `}
`;

/* forma de uso do costume link:
        import { CostumeLink } from '../../styles/GlobalStyles';
    
        <CostumeLink variant="tipoDoLink" to="/login">
            //conteudo do costume link
        </CostumeLink>
*/
