import {
    GET_ALL_DEPARTMENT,
    GET_DEPARTMENT,
    CLEAR_DEPARTMENT,
} from '../actions/types';


const initialState = {
    records: [],
    record: {},
    totalSize: 0
}

export default function(state = initialState, action ){
    const { type, payload } = action;
    switch(type){
        case GET_ALL_DEPARTMENT:
            return {
                ...state,
                records: payload.data,
                totalSize: payload.meta.total
            }
        case GET_DEPARTMENT:
            return {
                ...state,
                record: payload,
            }
        case CLEAR_DEPARTMENT:
            return {
                ...state,
                record: {},
            }
    default:
        return state;
}
}
