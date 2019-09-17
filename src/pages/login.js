import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { connect } from 'react-redux'
import { showSnack } from 'react-redux-snackbar'

import { setLogin, setEndpoint } from 'store/login/Actions'

import DbUtente from 'database/Utente'

import {updateNotifications} from 'components/NotificationRequest'
import Footer from 'components/Footer'
import Anonimo from 'pages/login/Anonimo'
import SpidButton from 'pages/login/SpidButton'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
    root: {
        position: 'relative',
        height: '100%',
        overflowY: 'scroll',
        overflowScrolling: 'touch',
        WebkitOverflowScrolling: 'touch',
    },
    content: {
        minHeight: 'calc(100% - '+theme.spacing.unit * 3+'px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        [theme.breakpoints.up('lg')]: {
            flexDirection: 'row'
        }
    },
    card: {
        width: '100%',
        boxSizing: 'border-box',
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        [theme.breakpoints.up('lg')]: {
            width: 'auto',
            margin: theme.spacing.unit * 4,
            borderRadius: theme.spacing.unit
        }
    },
    text: {
        flex: 1,
        padding: theme.spacing.unit * 4,
    }
});

class Login extends React.PureComponent {

    state = {
        username: '',
        password: ''
    }

    handleChange = name => event => this.setState({[name]: event.target.value});

    componentDidMount() {
        let params = qs.parse(this.props.location.search.replace(/^\?/, ''));
        if(params && params.data){
            /*DbUtente.checkToken(params.data).then(result => {
                if(result.valid) {*/
                    this.props.setLogin(params.data);
                    if('PushManager' in window &&
                        'Notification' in window &&
                        Notification.permission === 'granted'){
                        updateNotifications().then(subscription => {
                            DbUtente.salvaEndpoint(JSON.stringify(subscription));
                            this.props.setEndpoint(subscription);
                        });
                    }
                    var {from} = (params.url && {from: {pathname: params.url, search: params.state}}) || this.props.location.state || {from: {pathname: '/'}};
                    this.props.history.replace(from);
                /*}
                else this.props.showSnack({
                    label: 'Impossibile effettuare il login',
                    timeout: 3000,
                })
            });*/
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.login !== this.props.login){
            if (window.opener && window.opener !== window) {
                window.opener.reload();
            }
        }
    }

    render() {
        const { classes } = this.props;

        return(<div className={classes.root}>
            <div className={classes.content}>
                <Paper elevation={3} className={classes.card}>
                    {process.env.REACT_APP_LOGIN_FORM==="1" &&
                        <Anonimo/>
                    }

                    
                    {process.env.REACT_APP_LOGIN_SPID==="1"
                        ? <div>
                            <Typography variant="title" paragraph>
                                oppure
                            </Typography>
                            <SpidButton history={this.props.history} location={this.props.location}/>
                            <Typography variant="body2">
                                Utilizzando Spid potrai ricevere maggiori informazioni sulle tue segnalazioni
                            </Typography>
                        </div>
                        : <Typography variant="body2">
                            Attenzione: l'accesso con SPID è temporaneamente non disponibile per aggiornamenti tecnici
                        </Typography>
                    }
                </Paper>

                <div className={classes.text}>
                    <Typography variant="headline" gutterBottom>
                        <b>Che cos'è IRIS?</b>
                    </Typography>
                    <Typography variant="subheading" paragraph>
                        IRIS è un sistema promosso dal Comune di Venezia per consentire a tutti i cittadini di segnalare problemi di manutenzione urbana nel territorio e contribuire così alla loro soluzione. Le segnalazioni rimangono visibili a tutti e possono essere commentate.
                    </Typography>
                    <Typography variant="headline">
                        <b>Effettua il login per</b>
                    </Typography>
                    <Typography variant="subheading"><ul>
                        <li>Visualizzare le tue segnalazioni e quelle inserite dagli altri cittadini</li>
                        <li>Inserire una nuova segnalazione</li>
                        <li>Aggiungere commenti</li>
                        <li>Riportare le segnalazioni inopportune</li>
                    </ul></Typography>
                </div>
            </div>
            <Footer/>
        </div>)
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return{
        login: state.login.login
    }
}

const mapDispatchToProps = dispatch => ({
    setLogin: login => dispatch(setLogin(login)),
    setEndpoint: endpoint => dispatch(setEndpoint(endpoint)),
    showSnack: options => dispatch(showSnack('snackbar',options)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles,{withTheme:true})(Login))