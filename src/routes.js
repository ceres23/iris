import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import PrivateRoute from 'components/PrivateRoute'
import Async from 'react-code-splitting'

const Info = props => <Async load={import('pages/Info')} componentProps={props}/>
const Login = props => <Async load={import('pages/Login')} componentProps={props} />
const Operatore = props => <Async load={import('pages/Operatore')} componentProps={props} />
const Segnala = props => <Async load={import('pages/Segnala')} componentProps={props} />
const MappaSegnalazioni = props => <Async load={import('pages/MappaSegnalazioni')} componentProps={props} />
const Dettaglio = props => <Async load={import('pages/Dettaglio')} componentProps={props} />
const NotFound = props => <Async load={import('pages/404')} componentProps={props} />

const pages = [
  {
    path: '/',
    exact: true,
    component: MappaSegnalazioni
  },
  {
    path: '/login',
    exact: true,
    component: Login
  },
  {
    path: '/operatore',
    exact: true,
    component: Operatore
  },
  {
    path: '/info',
    exact: true,
    component: Info
  },
  {
    path: '/dettaglio/:id',
    exact: false,
    component: Dettaglio
  },
  {
    path: '/404',
    exact: false,
    component: NotFound
  },
];

const private_pages = [
  {
    path: '/segnala',
    exact: true,
    component: Segnala
  }
]

const Routes = (
  <Switch>
    {pages.map((tab,i) => <Route key={i}
                                exact={tab.exact}
                                path={tab.path}
                                component={tab.component} />)}
    {private_pages.map((tab,i) => <PrivateRoute key={i}
                                                exact={tab.exact}
                                                path={tab.path}
                                                component={tab.component} />)}
    <Route path="*" render={() => <Redirect to="/404"/>}/>
  </Switch>
);
 
export default Routes