import axios from 'axios';
import { setAlert } from './alert'; 
import {
    GET_ALL_COST_CENTER,
    GET_COST_CENTER,
    CLEAR_COST_CENTER
} from './types';

const headers = {
    "Content-Type": "application/json",
  };

/* GET COST CENTERS */
export const getCostCenters = (
    page,
    sortFieldQuery,
    sortOrderQuery,
    sizePerPageQuery,
    searchText,
) => async dispatch =>{ 
  
    let q = searchText?searchText.trim():'';

    try {
      let res = await axios.get(
          '/api/cost_center' + `?q=${q}&sizePerPage=${sizePerPageQuery}&page=${page}&sortField=${sortFieldQuery}&sortOrder=${sortOrderQuery}`,
          {
            headers: headers,
          }
      );
      dispatch({
          type: GET_ALL_COST_CENTER,
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
      dispatch(setAlert('Failed to fetch Cost Centers', 'danger', 1000))
    }
}


/* Load Cost Center */
export const getCostCenter = (id) => async dispatch =>{ 
    try {
      let res = await axios.get(`/api/cost_center/${id}`);
      dispatch({
          type: GET_COST_CENTER,
          payload: res.data.data
      })
    }catch (err){
      dispatch(setAlert('Failed to fetch company', 'danger', 3000))
    }
  }


/* Store Cost Center */
export const storeCostCenter = (data) => async dispatch =>{ 
    try { 
        const {code, description, remarks} = data;

        const body = {
            code : code,
            description: description,
            remarks: remarks
        }
       
      let res = await axios.post(`/api/cost_center`, body, { headers: headers });
      getCostCenter(res.id);
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

/*  Update Cost Center */
export const updateCostCenter = (data) => async dispatch =>{ 
    try { 
        const {id ,code, description, remarks} = data;
        const body = {
            code : code,
            description: description,
            remarks: remarks
        }
       
      let res = await axios.put(`/api/cost_center/${id}`, body, { headers: headers });
      getCostCenter(res.id);
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


  /* Delete Cost Center */
export const deleteCostCenter = (id) => async dispatch =>{ 
    try {
      let res = await axios.delete(`/api/cost_center/${id}`);
      dispatch(setAlert(res.data.data, 'success', 3000))
      return true;
    }catch (err){
      dispatch(setAlert('Failed to delete the record', 'danger', 3000))
      return false
    }
  }
  
  /* Clear Cost Center in Redux */
  export const clearCostCenter = () => async dispatch =>{ 
        dispatch({type: CLEAR_COST_CENTER})
  }