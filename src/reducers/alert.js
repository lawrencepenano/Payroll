import  { SET_ALERT} from '../actions/types.js'
import { notifyError, notifySuccess, notifyWarn, notifyInfo } from "../views/notifications/alerts/Toaster";

const initialState = [];


export default function(state = initialState, action){
    const { type , payload} = action;
    if(payload){
        const {msg, alertType, timeout } = payload;
        switch(type) {
            case SET_ALERT:
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
                            return alertType;
                    }
            default:
                return state;
        }
    }else{
        switch(type) {
            case SET_ALERT:
                return state;
            default:
                return state;
        }
    }
}