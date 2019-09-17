import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { showSnack } from 'react-redux-snackbar'

import { setLogin, setEndpoint } from 'store/login/Actions'

import {updateNotifications} from 'components/NotificationRequest'
import DbUtente from 'database/Utente'

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
    root: {
        margin: '0px auto',
        maxWidth: theme.breakpoints.values.sm,
        marginBottom: theme.spacing.unit * 2
    }
});

class Anonimo extends React.PureComponent {

    static contextTypes = {
        router: PropTypes.object
    }

    state = {
        nome: '',
        cognome: '',
        email: ''
    }

    handleChange = name => event => this.setState({[name]: event.target.value});

    validateEmail = email => {
        // eslint-disable-next-line
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    doLogin = event => {
        const history=this.context.router.history;

        this.validateEmail(this.state.email)
            ? DbUtente.loginAnonimo(this.state.nome,this.state.cognome,this.state.email).then(resp => {
                if(resp.token) {
                    this.props.setLogin(resp.token);
                    if('PushManager' in window &&
                        'Notification' in window &&
                        Notification.permission === 'granted'){
                        updateNotifications().then(subscription => {
                            DbUtente.salvaEndpoint(JSON.stringify(subscription));
                            this.props.setEndpoint(subscription);
                        });
                    }
                    var {from} = history.location.state || {from: {pathname: '/'}};
                    history.replace(from);
                }
                else this.props.showSnack({
                    label: 'I dati non sono stati accettati',
                    timeout: 3000,
                })
            }).catch(error => this.props.showSnack({
                label: 'I dati non sono stati accettati',
                timeout: 3000,
            }))
            : this.props.showSnack({
                label: 'La mail inserita non è valida',
                timeout: 3000,
            });

        event.preventDefault();
    }

    render() {
        const {classes} = this.props;

        return (
        <form onSubmit={this.doLogin} className={classes.root}>
            <Typography variant="title">
                Fornisci i dati richiesti per continuare
            </Typography>

            {/* NOME COGNOME */}
            <TextField fullWidth
                required
                label="Nome"
                margin="normal"
                inputProps={{maxLength: 200}}
                onChange={this.handleChange('nome')}/>
            <TextField fullWidth
                required
                label="Cognome"
                margin="normal"
                inputProps={{maxLength: 200}}
                onChange={this.handleChange('cognome')}/>
            
            {/* EMAIL */}
            <TextField fullWidth
                required
                id="description"
                label="Email"
                margin="normal"
                onChange={this.handleChange('email')}/>
            
            <Button variant="raised"
                type="submit"
                color="secondary"
                size="large"
                className={classes.loginButton}>
                Accedi
            </Button>
        </form>
        )
    }
}

Anonimo.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    setLogin: login => dispatch(setLogin(login)),
    setEndpoint: endpoint => dispatch(setEndpoint(endpoint)),
    showSnack: options => dispatch(showSnack('snackbar',options)),
});

export default withRouter(connect(null,mapDispatchToProps)(withStyles(styles,{withTheme:true})(Anonimo)))