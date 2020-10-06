import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGOUT,
    LOGIN
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('toekn'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function(state = initialState, action ){
    const { type, payload } = action;
    switch(type){
        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token);
            localStorage.setItem('user', JSON.stringify(payload.user));
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
            localStorage.removeItem('toekn');
            localStorage.removeItem('user');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        case LOGIN:
            localStorage.setItem('token', payload.token);
            localStorage.setItem('user', JSON.stringify(payload.user));
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case LOGOUT:
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        default:
            return state;
    }
}
