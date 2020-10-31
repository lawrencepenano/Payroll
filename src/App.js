import React, { Component, useEffect } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './scss/style.scss';
import './App.css';
import Alert from './views/notifications/alerts/Alerts';
import setAuthToken from './utils/setAuthToken';
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/auth'
import { getModules, getRoles } from './actions/globalParameter';


if(localStorage.token){
  setAuthToken(localStorage.token);
}

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Landing
const Landing = React.lazy(() => import('./views/pages/landing/Landing'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
    useEffect(()=>{
      store.dispatch(loadUser())
      store.dispatch(getModules())
      store.dispatch(getRoles())
    },[])

    return (
    <Provider store={store}>
        <HashRouter>
            <React.Suspense fallback={loading}>
              <Alert/> 
              <Switch>
                <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
                <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>}/>
                <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
                <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
                <Route path="/home" name="Home" render={props => <Landing {...props}/>} />
                <Route path="/" name="Dashboard" render={props => <TheLayout {...props}/>} />
              </Switch>
            </React.Suspense>
        </HashRouter>
      </Provider>
    );
}

export default App;
