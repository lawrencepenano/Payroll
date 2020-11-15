import {
    GET_ALL_WHS_STANDARD,
    GET_WHS_STANDARD,
    CLEAR_WHS_STANDARD
} from '../actions/types';


const initialState = {
    records: [],
    record: {},
    totalSize: 0
}

export default function(state = initialState, action ){
    const { type, payload } = action;
    switch(type){
        case GET_ALL_WHS_STANDARD:
            return {
                ...state,
                records: payload.data,
                totalSize: payload.meta.total
            }
        case GET_WHS_STANDARD:
            return {
                ...state,
                record: payload,
            }
        case CLEAR_WHS_STANDARD:
            return {
                ...state,
                record: {},
            }
    default:
        return state;
}
}
