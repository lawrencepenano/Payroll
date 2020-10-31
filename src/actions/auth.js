import axios from 'axios';
import { setAlert } from './alert'; 
import {
    USER_LOADED,
    REGISTER_SUCCESS,
    LOGIN_SUCESS,
    LOGIN_FAIL,
    REGISTER_FAIL,
    AUTH_ERROR,
    LOGOUT,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async dispatch =>{ 
    const token = localStorage.token
    if(token){
        setAuthToken(token);
    }
    try {
        const res = await axios.get(`/api/auth`);
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch(err){
        dispatch({
            type: AUTH_ERROR
        })
    }
}

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
        await dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data.data
        })
        setAuthToken(res.data.data.token)
        window.location.replace("/#dashboard")
        dispatch(setAlert('Successfully Registered', 'success', 1000))
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
        dispatch({
            type: LOGOUT
        })
} 

export const login = ({ email, password}) => async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(`/api/login`,body,config)
        dispatch({
            type: LOGIN_SUCESS,
            payload: res.data.data
        })
        setAuthToken(res.data.data.token)
        dispatch(setAlert('Successfully Login', 'success', 1000))

    } catch (err){
        if(err.response && err.response.data && err.response.data.data[0]){
            const errors = err.response.data.data;
            if(errors.length > 0){
                errors.map((value)=>
                    dispatch(setAlert(value,'danger'))
                )
            }
        }
        dispatch({
            type: LOGIN_FAIL,
        })
    }
}

