import {
    GET_ALL_USERS,
    GET_USER,
    CLEAR_USER,
} from '../actions/types';


const initialState = {
    users: [],
    user: {},
    totalSize: 0
}

export default function(state = initialState, action ){
    const { type, payload } = action;
    switch(type){
        case GET_ALL_USERS:
            return {
                ...state,
                users: payload.data,
                totalSize: payload.meta.total
            }
        case GET_USER:
            return {
                ...state,
                user: payload,
            }
        case CLEAR_USER:
            return {
                ...state,
                user: {},
            }
    default:
        return state;
}
}
