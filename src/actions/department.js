import axios from 'axios';
import { setAlert } from './alert'; 
import {
    GET_ALL_DEPARTMENT,
    GET_DEPARTMENT,
    CLEAR_DEPARTMENT
} from './types';

const headers = {
    "Content-Type": "application/json",
};

/* DYNAMIC URL */
const url = '/api/department';
/* GET ALL RECORDS DISPATCH */
const GET_ALL_RECORDS = GET_ALL_DEPARTMENT;
/* GET RECORD DISPATCH */
const GET_RECORD = GET_DEPARTMENT;
/* CLEAR RECORD DISPATCH */
const CLEAR_RECORD = CLEAR_DEPARTMENT;

/* GET RECORDS */
export const getRecords = (
    page,
    sortFieldQuery,
    sortOrderQuery,
    sizePerPageQuery,
    searchText,
) => async dispatch =>{ 
  
    let q = searchText?searchText.trim():'';

    try {
      let res = await axios.get(
          url + `?q=${q}&sizePerPage=${sizePerPageQuery}&page=${page}&sortField=${sortFieldQuery}&sortOrder=${sortOrderQuery}`,
          {
            headers: headers,
          }
      );
      dispatch({
          type: GET_ALL_RECORDS,
          payload: res.data
      })
    }catch (err){
    if(err.response && err.response.data && err.response.data.data){
        const errors = err.response.data.data;
        if(errors.length > 0){
            errors.map((value)=>
                dispatch(setAlert(value,'danger'))
            )
        }
    }
      dispatch(setAlert('Failed to fetch Records', 'danger', 1000))
    }
}


/* Load Record */
export const getRecord = (id) => async dispatch =>{ 
    try {
      let res = await axios.get( url + `/${id}`);
      dispatch({
          type: GET_RECORD,
          payload: res.data.data
      })
    }catch (err){
      dispatch(setAlert('Failed to fetch company', 'danger', 3000))
    }
  }


/* Store Record */
export const storeRecord = (data) => async dispatch =>{ 
    try { 
        const {code, description, remarks} = data;

        const body = {
            code : code,
            description: description,
            remarks: remarks
        }
       
      let res = await axios.post(url, body, {headers:headers});
      getRecord(res.id);
      dispatch(setAlert(res.data.data, 'success', 3000))
      return true;
    }catch (err){
        if(err.response && err.response.data && err.response.data.data[0]){
            const errors = err.response.data.data;
            if(errors.length > 0){
                errors.map((value)=>
                    dispatch(setAlert(value,'danger'))
                )
            }
        }else{
            dispatch(setAlert('Failed to store the record', 'danger', 3000))
        }
      return false
    }
  }

/* Update Record */
export const updateRecord = (data) => async dispatch =>{ 
    try { 
        const {id ,code, description, remarks} = data;
        const body = {
            code : code,
            description: description,
            remarks: remarks
        }
       
      let res = await axios.put( url + `/${id}`, body, { headers: headers });
      getRecord(res.id);
      dispatch(setAlert(res.data.data, 'success', 3000))
      return true;
    }catch (err){
        if(err.response && err.response.data && err.response.data.data[0]){
            const errors = err.response.data.data;
            if(errors.length > 0){
                errors.map((value)=>
                    dispatch(setAlert(value,'danger'))
                )
            }
        }else{
            dispatch(setAlert('Failed to update the record', 'danger', 3000))
        }
        return false
    }
  }


  /* Delete Record */
export const deleteRecord = (id) => async dispatch =>{ 
    try {
      let res = await axios.delete( url + `/${id}`);
      dispatch(setAlert(res.data.data, 'success', 3000))
      return true;
    }catch (err){
      dispatch(setAlert('Failed to delete the record', 'danger', 3000))
      return false
    }
  }
  
  /* Clear Record in Redux */
  export const clearRecord = () => async dispatch =>{ 
        dispatch({type: CLEAR_RECORD})
  }