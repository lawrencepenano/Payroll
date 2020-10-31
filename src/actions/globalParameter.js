import axios from 'axios';
import { setAlert } from './alert'; 
import {
    GET_ALL_LIST_OF_MODULES,
    GET_ALL_LIST_OF_ROLES
} from './types';


const headers = {
    "Content-Type": "application/json",
  };


export const getModules = () => async dispatch =>{ 
    try {
      let res = await axios.get(`/api/modules`);
      dispatch({
          type: GET_ALL_LIST_OF_MODULES,
          payload: res.data.data
      })
    }catch (err){
      dispatch(setAlert('Failed to fetch modules', 'error', 1000))
    }
}

export const getRoles = () => async dispatch =>{ 
    try {
      let res = await axios.get(`/api/roles`);
      dispatch({
          type: GET_ALL_LIST_OF_ROLES,
          payload: res.data.data
      })
    }catch (err){
      dispatch(setAlert('Failed to fetch roles', 'error', 1000))
    }
}

