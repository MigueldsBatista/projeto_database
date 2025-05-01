import * as types from '../types';

const initialState = {
    botaoClicado: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.BOTAO_CLICADO_SUCCESS:
            const newState = { ...state };
            newState.botaoClicado = !newState.botaoClicado;
            return newState;
        case types.BOTAO_CLICADO_REQUEST:
            console.log('Requerindo');
            return state;
        case types.BOTAO_CLICADO_FAILURE:
            console.log('Deu Erro');
            return state;
        default: return state;
    }
}