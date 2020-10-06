import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'; 
import { notifyError, notifySuccess, notifyWarn, notifyInfo } from "./Toaster";

const Alert = ({ alerts }) => {
  const { msg, alertType, timeout } = alerts;
  if( alerts != null && alerts.length >0 ){
    switch(alertType)
      {
        case "success":
            return notifySuccess(msg, timeout)
        case "danger":
            return notifyError(msg, timeout)
        case "info":
            return notifyInfo(msg, timeout)
        case "warning":
            return notifyWarn(msg, timeout)
        default:
            return alerts;
    }
  }
  return (
    <>
    </>
  )
}

Alert.propType= {
    alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    alerts: state
})

export default connect(mapStateToProps)(Alert);
