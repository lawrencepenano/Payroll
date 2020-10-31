import {
    GET_ALL_COMPANY,
    GET_COMPANY,
    CLEAR_COMPANY,
} from '../actions/types';


const initialState = {
    companies: [],
    company: {},
    totalSize: 0
}

export default function(state = initialState, action ){
    const { type, payload } = action;
    switch(type){
        case GET_ALL_COMPANY:
            return {
                ...state,
                companies: payload.data,
                totalSize: payload.meta.total
            }
        case GET_COMPANY:
            return {
                ...state,
                company: payload,
            }
        case CLEAR_COMPANY:
            return {
                ...state,
                company: {},
            }
    default:
        return state;
}
}
