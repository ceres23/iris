import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { showSnack } from 'react-redux-snackbar'

import { setLogin, setEndpoint } from 'store/login/Actions'

import DbUtente from 'database/Utente'

import {updateNotifications} from 'components/NotificationRequest'
import Footer from 'components/Footer'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'

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
        alignItems: 'center',
    },
    card: {
        width: '100%',
        maxWidth: theme.breakpoints.values.md,
        boxSizing: 'border-box',
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        [theme.breakpoints.up('md')]: {
            margin: theme.spacing.unit * 4,
            borderRadius: theme.spacing.unit
        }
    },
    form: {
        margin: '0px auto',
        width: '100%'
    },
    loginButton: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 2,
    }
});

class Operatore extends React.PureComponent {

    state = {
        username: '',
        password: ''
    }

    handleChange = name => event => this.setState({[name]: event.target.value});

    doLogin = event => {
        const scope=this;
        DbUtente.login(this.state.username,this.state.password).then(resp => {
            if(resp.headers.get("authorization")) {
                this.props.setLogin(resp.headers.get("authorization"));
                if('PushManager' in window &&
                    'Notification' in window &&
                    Notification.permission === 'granted'){
                    updateNotifications().then(subscription => {
                        DbUtente.salvaEndpoint(JSON.stringify(subscription));
                        this.props.setEndpoint(subscription);
                    });
                }
                var {from} = scope.props.location.state || {from: {pathname: '/'}};
                scope.props.history.replace(from);
            }
            else this.props.showSnack({
                label: 'Nome utente o password errati',
                timeout: 3000,
            })
        }).catch(error => this.props.showSnack({
            label: 'Nome utente o password errati',
            timeout: 3000,
        }));

        event.preventDefault();
    }

    render() {
        const { classes } = this.props;

        return(<div className={classes.root}>
            <div className={classes.content}>
                <Paper elevation={3} className={classes.card}>
                    <form onSubmit={this.doLogin} className={classes.form}>
                        <TextField fullWidth
                            required
                            autoFocus
                            name="username"
                            label="Nome utente"
                            autoComplete="username"
                            onChange={this.handleChange('username')}
                            margin="normal"/><br/>
                        <TextField fullWidth
                            required
                            name="password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            onChange={this.handleChange('password')}
                            margin="normal"/><br/>
                        <Button variant="raised"
                            type="submit"
                            color="secondary"
                            size="large"
                            className={classes.loginButton}>
                            Login
                        </Button>
                    </form>
                </Paper>
            </div>
            <Footer/>
        </div>
        )
    }
}

Operatore.propTypes = {
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

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles,{withTheme:true})(Operatore))