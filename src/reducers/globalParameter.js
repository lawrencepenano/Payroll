import {
    GET_ALL_LIST_OF_MODULES,
    GET_ALL_LIST_OF_ROLES
} from '../actions/types';

const initialState = {
    modules: [],
    roles: []
}

export default function(state = initialState, action ){
    const { type, payload } = action;
    switch(type){
        case GET_ALL_LIST_OF_MODULES:
            return {
                ...state,
                modules: payload
            }
        case GET_ALL_LIST_OF_ROLES:
        return {
            ...state,
            roles: payload
        }
        default:
            return state;
    }
}


        