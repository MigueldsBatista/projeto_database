import styled, { createGlobalStyle } from 'styled-components'
import { backgroundColor, textPrimaryColor } from '../config/colors';
import { fontSize } from '../config/font';
import { spacing } from '../config/spacing';
import { borderRadius } from '../config/border';
import 'react-toastify/dist/ReactToastify.css';
 
export default createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        outline: none;
        box-sizing: border-box;
        transition: all 0.2s ease-in-out;
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
 
     .header-actions{
         display: flex;
         gap: ${spacing.sm};
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
    overflow: hidden;
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