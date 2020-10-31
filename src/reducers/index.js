import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import user from './user';
import company from './company';
import globalParameter from './globalParameter'
import costCenter from './costCenter'

export default combineReducers({
    alert,
    auth,
    user,
    globalParameter,
    company,
    costCenter
});