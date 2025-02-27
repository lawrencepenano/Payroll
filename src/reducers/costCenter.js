import {
    GET_ALL_COST_CENTER,
    GET_COST_CENTER,
    CLEAR_COST_CENTER,
} from '../actions/types';


const initialState = {
    records: [],
    record: {},
    totalSize: 0
}

export default function(state = initialState, action ){
    const { type, payload } = action;
    switch(type){
        case GET_ALL_COST_CENTER:
            return {
                ...state,
                records: payload.data,
                totalSize: payload.meta.total
            }
        case GET_COST_CENTER:
            return {
                ...state,
                record: payload,
            }
        case CLEAR_COST_CENTER:
            return {
                ...state,
                record: {},
            }
    default:
        return state;
}
}
