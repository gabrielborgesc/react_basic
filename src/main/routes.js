import React from 'react'
import Login from '../views/login'
import SingUp from '../views/signUp'
// import Home from '../views/home'
import ChangePassword from '../views/changePassword'
import RecoverPassword from '../views/recoverPassword/recoverPassword'

import { Route, Switch, HashRouter, Redirect } from 'react-router-dom'
import { AuthConsumer } from './authProvider'
import SearchProduct from '../views/product/searchProducts'
import ResgisterProduct from '../views/product/resgisterProducts'
import MenuHome from '../views/menuHome'
import Transactions from '../views/transactions/transactions'
import Parametrize from '../views/parametrize/parametrize'


function AuthRoute( {component: Component, isAuth, checkSession, ...props} ) {

    return(
        <Route {...props} render={(componentProps) => {
            checkSession()
            if(props.path === '/'){
                if(isAuth){
                    return (
                        <Redirect to={ {pathname: '/home', state: {from: componentProps.location} } } />
                    )
                }
                else {
                    return (
                        <Redirect to={ {pathname: '/login', state: {from: componentProps.location} } } />
                    )
                }
            }
            else if(isAuth) {
                return (
                    <Component {...componentProps} />
                ) 
            } else{
                return(
                    <Redirect to={ {pathname: '/login', state: {from: componentProps.location} } } />
                )
            }
        } } />
    )
    
}

function Routes(props){
    return (
        <HashRouter>
            <Switch>
                <Route path = "/login" component = {Login} />
                <Route path = "/signUp" component = {SingUp} />
                <Route path = "/recoverPassword/:email?/:hash?" component = {RecoverPassword} />
                {/* <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/home/:name?/:email?" component = {Home} /> */}
                <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/home/:name?/:email?" component = {MenuHome} />
                <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/register" component = {ResgisterProduct} />
                <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/searchProducts" component = {SearchProduct} />
                <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/transactions" component = {Transactions} />
                <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/parameterize" component = {Parametrize} />
                {/* <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/searchEntry" component = {SearchEntry} /> */}
                <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/changePassword" component = {ChangePassword} />
                <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/" />
            </Switch>
        </HashRouter>
    )
}

export default () => (
    <AuthConsumer>
        { (context) => ( <Routes isAuth={context.isAuth} checkSession={context.checkSessionExpirationTime}/> ) }
    </AuthConsumer>
)