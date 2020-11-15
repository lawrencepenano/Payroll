import axios from 'axios';
import { setAlert } from './alert'; 
import {
    GET_ALL_LIST_OF_MODULES,
    GET_ALL_LIST_OF_ROLES,
    GET_TOTAL_WORKING_DAYS,
    GET_TOTAL_WORKING_MONTHS
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

export const getTotalWorkingDays = () => async dispatch =>{ 
  try {
    let res = await axios.get(`/api/totalWorkDays`);
    dispatch({
        type: GET_TOTAL_WORKING_DAYS,
        payload: res.data.data
    })
  }catch (err){
    dispatch(setAlert('Failed to fetch Total Work Days Per Year', 'error', 1000))
  }
}

export const getTotalWorkingMonths = () => async dispatch =>{ 
  try {
    let res = await axios.get(`/api/totalWorkMonths`);
    dispatch({
        type: GET_TOTAL_WORKING_MONTHS,
        payload: res.data.data
    })
  }catch (err){
    dispatch(setAlert('Failed to fetch Total Work Months Per Year', 'error', 1000))
  }
}

