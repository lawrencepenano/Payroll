import {
    GET_TOTAL_WORK_DAYS_PER_YEAR,
    GET_WORK_DAYS_PER_YEAR,
    CLEAR_WORK_DAYS_PER_YEAR
} from '../actions/types';


const initialState = {
    records: [],
    record: {},
    totalSize: 0
}

export default function(state = initialState, action ){
    const { type, payload } = action;
    switch(type){
        case GET_TOTAL_WORK_DAYS_PER_YEAR:
            return {
                ...state,
                records: payload.data,
                totalSize: payload.meta.total
            }
        case GET_WORK_DAYS_PER_YEAR:
            return {
                ...state,
                record: payload,
            }
        case CLEAR_WORK_DAYS_PER_YEAR:
            return {
                ...state,
                record: {},
            }
    default:
        return state;
}
}
