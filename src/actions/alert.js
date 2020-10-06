import uuid from 'react-uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    console.log(msg);
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, timeout }
    });
}
