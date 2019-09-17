import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import { doLogout, setNotificationRequest, disableEndpoint } from 'store/login/Actions'
import { setTitle } from 'store/routing/Actions'

import DbUtente from 'database/Utente'
import Head from 'images/header.png'
import LogoDime from 'images/dime.png'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    flex: {
        flex: 1,
        [theme.breakpoints.down('md')]: {
            lineHeight: 2,
        }
    },
    menuItem: {
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        paddingTop: theme.spacing.unit * 3 / 2,
        paddingBottom: theme.spacing.unit * 3 / 2,
    },
    head: {
        flexGrow: 1,
        verticalAlign: 'middle',
        height: 36,
        padding: theme.spacing.unit,
        borderRadius: theme.spacing.unit,
        [theme.breakpoints.up('md')]: {
            height: 42,
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit
        }
    },
    logo: {
        cursor: 'pointer',
        marginRight: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.2)'},
        '&:active': {backgroundColor: 'rgba(255, 255, 255, 0.3)'},
    }
});

class Header extends React.PureComponent {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    state = {
        user: '',
        isHome: true,
        anchorEl: null,
        openMenu: false,
    }

    checkIsHome = props => {
        this.setState({
            isHome: props.history.location.pathname === "/"
        });

        switch(props.history.location.pathname){
            case "/": this.props.setTitle(""); break;
            case "/login": this.props.setTitle("Area segnalazioni - Accedi"); break;
            case "/operatore": this.props.setTitle("Login operatore"); break;
            case "/segnala": this.props.setTitle("Nuova segnalazione"); break;
            case "/info": this.props.setTitle("Info e statistiche"); break;
            case "/404": this.props.setTitle(""); break;
            default: break;
        }
    }

    openMenu = event => this.setState({
        anchorEl: event.currentTarget,
        openMenu:true
    });

    closeMenu = () => this.setState({
        anchorEl: null,
        openMenu:false
    });

    backClick = () => this.context.router.history.goBack();

    returnHome = () => this.props.history.location.pathname!=='/' && this.context.router.history.push('/');

    doLogout = () => {
        DbUtente.disableEndpoint();
        this.props.disableEndpoint();
        this.props.doLogout();
        this.props.setNotificationRequest(true);
        this.context.router.history.replace('/login');
        this.closeMenu();
    }

    componentDidMount() {
        this.props.login && DbUtente.echoUser().then(result => this.setState({user: result}));
        this.checkIsHome(this.props);
    }

    componentWillReceiveProps(nextProps) {
        nextProps.login && DbUtente.echoUser().then(result => this.setState({user: result}));
        this.checkIsHome(nextProps);
    }

    render() {
        const { classes } = this.props;

        return(
        <AppBar className={classes.appBar}>
            <Toolbar>
                {!this.state.isHome &&
                    <IconButton
                        color="inherit"
                        title="Torna alla pagina precedente"
                        onClick={this.backClick}>
                        <Icon>arrow_back</Icon>
                    </IconButton>
                }
                <Typography noWrap variant="title" color="inherit" className={classes.flex}>
                    <img src={LogoDime}
                        alt={process.env.REACT_APP_NOME}
                        title={process.env.REACT_APP_NOME}
                        className={classes.head+' '+classes.logo}
                        onClick={this.returnHome}/>
                    <Hidden mdDown>
                        {this.state.isHome
                            ? <img src={Head} alt="Città di venezia" className={classes.head}/>
                            : this.props.title
                        }
                    </Hidden>
                </Typography>
                {this.props.login
                    ? <div>
                        <IconButton color="inherit"
                            title="Profilo"
                            onClick={this.openMenu}>
                            <Icon>account_circle</Icon>
                        </IconButton>
                        <Menu anchorEl={this.state.anchorEl} open={this.state.openMenu} onClose={this.closeMenu}>
                            <Typography variant="subheading" noWrap className={classes.menuItem}>
                                Ciao, <b>{this.state.user}</b>
                            </Typography>
                            <MenuItem onClick={this.doLogout}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                    : this.context.router.history.location.pathname!=='/login' &&
                        <IconButton color="inherit"
                            title="Login"
                            onClick={this.closeMenu}
                            component={Link} to="/login">
                            <Icon>input</Icon>
                        </IconButton>
                }
                {this.context.router.history.location.pathname!=='/info' &&
                    <IconButton color="inherit"
                        title="Info e Statistiche"
                        onClick={this.closeMenu}
                        component={Link} to="/info">
                        <Icon>info</Icon>
                    </IconButton>
                }
            </Toolbar>
        </AppBar>
        )
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return{
        login: state.login.login,
        title: state.routing.title,
    }
}

const mapDispatchToProps = dispatch => ({
    setTitle: title => dispatch(setTitle(title)),
    doLogout: () => dispatch(doLogout()),
    setNotificationRequest: notificationRequest => dispatch(setNotificationRequest(notificationRequest)),
    disableEndpoint: () => dispatch(disableEndpoint()),
});

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(withStyles(styles, { withTheme: true })(Header)));