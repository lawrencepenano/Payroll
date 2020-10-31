import {
    GET_ALL_PAY_GROUPS,
    GET_PAY_GROUP,
    CLEAR_PAY_GROUP
} from '../actions/types';


const initialState = {
    records: [],
    record: {},
    totalSize: 0
}

export default function(state = initialState, action ){
    const { type, payload } = action;
    switch(type){
        case GET_ALL_PAY_GROUPS:
            return {
                ...state,
                records: payload.data,
                totalSize: payload.meta.total
            }
        case GET_PAY_GROUP:
            return {
                ...state,
                record: payload,
            }
        case CLEAR_PAY_GROUP:
            return {
                ...state,
                record: {},
            }
    default:
        return state;
}
}
