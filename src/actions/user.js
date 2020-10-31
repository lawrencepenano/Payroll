import axios from 'axios';
import { setAlert } from './alert'; 
import {
    GET_ALL_USERS,
    GET_USER,
    CLEAR_USER
} from './types';

const headers = {
    "Content-Type": "application/json",
  };

// Load Users
export const getUsers = (
    page,
    sortFieldQuery,
    sortOrderQuery,
    sizePerPageQuery,
    searchText,
) => async dispatch =>{ 
    let q = searchText?searchText.trim():'';
    try {
      let res = await axios.get(
          '/api/users' + `?q=${q}&sizePerPage=${sizePerPageQuery}&page=${page}&sortField=${sortFieldQuery}&sortOrder=${sortOrderQuery}`,
          {
            headers: headers,
          }
      );
      dispatch({
          type: GET_ALL_USERS,
          payload: res.data
      })
    }catch (err){
      dispatch(setAlert('Failed to fetch users', 'danger', 1000))
    }
}


// Load User
export const getUser = (id) => async dispatch =>{ 
  try {
    let res = await axios.get(`/api/users/${id}`);
    dispatch({
        type: GET_USER,
        payload: res.data.data
    })
    return true;
  }catch (err){
    dispatch(setAlert('Failed to fetch user', 'danger', 3000))
    return false;
  }
}

// Update User
export const updateUser = (data) => async dispatch =>{ 
  try {
    let modules_id = JSON.stringify(data.assigned_modules.map(e=>{return e.id}));
    const request_data = {
      "role_id": data.assigned_role.value,
      "modules": modules_id
    }
    let res = await axios.put(`/api/users/${data.id}`, JSON.stringify(request_data),{
      headers: headers,
    });
    getUser(data.id);
    dispatch(setAlert(res.data.data, 'success', 3000))
    return true;
  }catch (err){
    dispatch(setAlert('Failed to update the record', 'danger', 3000))
    return false;
  }
}

// Reset Password
export const resetPassword = (id) => async dispatch =>{ 
  try {
    let res = await axios.get(`/api/reset_password/${id}`);
    dispatch(setAlert(res.data.data, 'success', 3000))
    return true;
  }catch (err){
    dispatch(setAlert('Failed to update the password', 'danger', 3000))
    return false;
  }
}

// Change Access Status
export const changeStatus = (id) => async dispatch =>{ 
  try {
    let res = await axios.delete(`/api/users/${id}`);
    dispatch(setAlert(res.data.data, 'success', 3000))
    return true;
  }catch (err){
    dispatch(setAlert('Failed to update the status', 'danger', 3000))
    return false
  }
}

// Clear User in Redux
export const clearUser = () => async dispatch =>{ 
      dispatch({type: CLEAR_USER})
}