import React from 'react'
import Login from '../views/login'
// import Home from '../views/home'

import { Route, Switch, HashRouter, Redirect } from 'react-router-dom'
import { AuthConsumer } from './authProvider'
import MenuHome from '../views/menuHome'


function AuthRoute( {component: Component, isAuth, checkSession, ...props} ) {

    return(
        <Route {...props} render={(componentProps) => {
            checkSession()
            if(props.path === '/'){
                    return (
                        <Redirect to={ {pathname: '/home', state: {from: componentProps.location} } } />
                    )
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
                {/* <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/home/:name?/:email?" component = {Home} /> */}
                <Route  isAuth={props.isAuth} checkSession={props.checkSession} path = "/home/:name?/:email?" component = {MenuHome} />
                <Route  isAuth={props.isAuth} checkSession={props.checkSession} path = "/" component = {MenuHome}/>
            </Switch>
        </HashRouter>
    )
}

export default () => (
    <AuthConsumer>
        { (context) => ( <Routes isAuth={context.isAuth} checkSession={context.checkSessionExpirationTime}/> ) }
    </AuthConsumer>
)