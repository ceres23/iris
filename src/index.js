import React from 'react'
import ReactDOM from 'react-dom'
import 'es6-shim'
import 'index.css'
import {Router} from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import store from 'store'
import {Provider} from 'react-redux'
import registerServiceWorker from 'registerServiceWorker'
import createHistory from 'history/createBrowserHistory'
import { Snackbar } from 'react-redux-snackbar'
import Analytics from 'react-router-ga'

import StatoConnessione from 'components/StatoConnessione'
import Header from 'components/Header'
import Main from 'components/Main'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const history = createHistory();

const persistor = persistStore(store);

const theme = createMuiTheme({
  palette: {
    primary: {main: process.env.REACT_APP_COLORE_PRIMARIO},
    secondary: {main: process.env.REACT_APP_COLORE_SECONDARIO},
    error: {main: process.env.REACT_APP_COLORE_ERRORE},
    background: {default: process.env.REACT_APP_SFONDO},
  },
  typography: {
    fontFamily: '"Titillium Web",sans-serif !important',
  },
});

theme.overrides.MuiToolbar = {
  gutters: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  }
};

theme.overrides.MuiButton = {
  root: {
    borderRadius: theme.spacing.unit * 3,
    whiteSpace: 'nowrap',
  },
  label: {
    fontWeight: 'bold',
  }
};

theme.overrides.MuiDialog = {
  paper: {
    borderRadius: theme.spacing.unit,
    margin: theme.spacing.unit * 2,
  }
};

theme.overrides.MuiDialogContent = {
  root: {
    padding: '0px '+(theme.spacing.unit * 2)+'px '+theme.spacing.unit+'px '+(theme.spacing.unit * 2)+'px',
  }
};

theme.overrides.MuiCard = {
  root: {
    borderRadius: 0,
    [theme.breakpoints.up('md')]: {
      borderRadius: theme.spacing.unit,
    }
  }
};

theme.overrides.MuiPaper = {
  rounded: {
    borderRadius: 0,
  }
};

const styles = {
  root: {
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.default,
  },
  offline: {
    flexShrink: 0,
    height: theme.spacing.unit * 2,
    backgroundColor: theme.palette.error.main,
    color: '#ffffff',
    paddingLeft: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
}

ReactDOM.render(<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <Analytics id="UA-6830106-12">
            <div style={styles.root}>
                <StatoConnessione/>
                <Header history={history}/>
                <Main/>
            </div>
          </Analytics>
        </Router>
        </MuiThemeProvider>
    </PersistGate>
    </Provider>
,document.getElementById('root'));

ReactDOM.render(<Provider store={store}>
  <Snackbar id="snackbar" customStyles={{
    snack: {
      position: 'absolute',
      backgroundColor: 'rgb(49, 49, 49)',
      bottom: 0,
      zIndex: 1600,
    }}}/>
</Provider>,document.getElementById('snackbar_container'));

registerServiceWorker();