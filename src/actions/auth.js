import axios from 'axios';
import { setAlert } from './alert'; 
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGOUT,
    LOGIN
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Register User
export const register = ({ company_name, email, phone, first_name, last_name, password}) => async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ company_name, email, phone, first_name, last_name, password});

    try {
        const res = await axios.post('./api/register',body,config)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data.data
        })
        window.location.replace("/dashboard")
    } catch (err){
        if(err.response && err.response.data && err.response.data.data){
            const errors = err.response.data.data;
            if(errors.length > 0){
                errors.map((value)=>
                    dispatch(setAlert(value,'danger'))
                )
            }
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
}

export const logout = () => dispatch =>{
        console.log(1)
        dispatch({
            type: LOGOUT
        })
        window.location.replace("/")
} 

export const login = ({ email, password}) => async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password});

    try {
        const res = await axios.post('./api/login',body,config)
        console.log(res.data.data)
        dispatch({
            type: LOGIN,
            payload: res.data.data
        })
        dispatch(setAlert('Successfully Login', 'success', 1000))
        window.location.replace("/blogs")
    } catch (err){
        if(err.response && err.response.data && err.response.data.data[0]){
            const errors = err.response.data.data[0];
            if(errors.email){
                dispatch(setAlert(errors.email, 'danger'))
            }
            if(errors.password){
                dispatch(setAlert(errors.password, 'danger'))
            }
        }
    }
}

