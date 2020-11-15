import {
    GET_ALL_LIST_OF_MODULES,
    GET_ALL_LIST_OF_ROLES,
    GET_TOTAL_WORKING_DAYS,
    GET_TOTAL_WORKING_MONTHS
} from '../actions/types';

const initialState = {
    modules: [],
    roles: [],
    workDaysPerYear: [],
    workMonthsPerYear: []
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
        case GET_TOTAL_WORKING_DAYS:
            return {
                ...state,
                workDaysPerYear: payload
            }
        case GET_TOTAL_WORKING_MONTHS:
            return {
                ...state,
                workMonthsPerYear: payload
            }
        default:
            return state;
    }
}


        