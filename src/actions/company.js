import axios from 'axios';
import { setAlert } from './alert'; 
import {
    GET_ALL_COMPANY,
    GET_COMPANY,
    CLEAR_COMPANY
} from './types';

const headers = {
    "Content-Type": "application/json",
  };

/* GET CPMPANIES */
export const getCompanies = (
    page,
    sortFieldQuery,
    sortOrderQuery,
    sizePerPageQuery,
    searchText,
) => async dispatch =>{ 
  
    let q = searchText?searchText.trim():'';

    try {
      let res = await axios.get(
          '/api/company' + `?q=${q}&sizePerPage=${sizePerPageQuery}&page=${page}&sortField=${sortFieldQuery}&sortOrder=${sortOrderQuery}`,
          {
            headers: headers,
          }
      );
      dispatch({
          type: GET_ALL_COMPANY,
          payload: res.data
      })
    }catch (err){
      if(err.response && err.response.data && err.response.data.data[0]){
        const errors = err.response.data.data;
        if(errors.length > 0){
            errors.map((value)=>
                dispatch(setAlert(value,'danger'))
            )
        }
      }else{
          dispatch(setAlert('Failed to fetch record', 'danger', 3000))
      }
    }
}


/* Load Company */
export const getCompany = (id) => async dispatch =>{ 
    try {
      console.log(id)
      let res = await axios.get(`/api/company/${id}`);
      dispatch({
          type: GET_COMPANY,
          payload: res.data.data
      })
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
          dispatch(setAlert('Failed to fetch record', 'danger', 3000))
      }
      return false;
    }
  }

  /*  Update Company */
export const updateCompany = (data) => async dispatch =>{ 
    try { 
        const formData = new FormData();
        formData.append('company_logo', data.company_logo); 
        formData.append('company_name', data.company_name); 
        formData.append('nature_of_business', data.nature_of_business); 
        formData.append('address_1', data.address_1); 
        formData.append('address_2', data.address_2); 
        formData.append('rdo', data.rdo); 
        formData.append('zip_code', data.zip_code); 
        formData.append('email', data.email); 
        formData.append('phone', data.phone); 
        formData.append('fax', data.fax); 
        formData.append('tin_no', data.tin_no); 
        formData.append('sss_no', data.sss_no); 
        formData.append('hdmf_no', data.hdmf_no); 
        formData.append('working_hours', data.working_hours); 
        formData.append('working_hours_schedule_type', data.working_hours_schedule_type); 
        formData.append('no_of_shifts', data.no_of_shifts); 
      let res = await axios.post(`/api/company/${data.id}`, formData, { headers: { 'content-type': 'multipart/form-data' } });
      getCompany(res.id);
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
      return false;
    }
  }


  /* Change Access Status */
export const changeStatus = (id) => async dispatch =>{ 
    try {
      let res = await axios.delete(`/api/company/${id}`);
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
         dispatch(setAlert('Failed to update the status', 'danger', 3000))
      }
      return false;
    }
  }
  
  /* Clear Company in Redux */
  export const clearCompany = () => async dispatch =>{ 
        dispatch({type: CLEAR_COMPANY})
  }