import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import  history  from '../../../services/history';
import { get } from 'lodash';


function* loginRequest({payload}){
    try{
        const response = yield call(axios.post, '/tokens', payload);
        yield put(actions.loginSuccess({...response.data}));
        toast.success('Login feito com Sucesso');
        axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;
        history.push(payload.prevPath);
    }catch(e){
        toast.error('Usuario ou senha invalidos');
        yield put(actions.loginFailure());
    }
}

function* persistRehydrate({ payload }){
     const token = get(payload, 'auth.token', '');
     if(!token)return;
     axios.defaults.headers.Authorization = `Bearer ${token}`;

}

export default all([
    takeLatest(types.LOGIN_REQUEST, loginRequest),
    takeLatest(types.PERSIST_REHYDRATE, persistRehydrate), 
]);