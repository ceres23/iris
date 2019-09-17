import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import PrivateRoute from 'components/PrivateRoute'

import Info from 'pages/Info'
import Login from 'pages/Login'
import Segnala from 'pages/Segnala'
import MappaSegnalazioni from 'pages/MappaSegnalazioni'
import Dettaglio from 'pages/Dettaglio'
import NotFound from 'pages/404'

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
  },
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