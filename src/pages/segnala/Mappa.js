import React from 'react'
import PropTypes from 'prop-types'
import Mappa from 'components/Mappa'
import DatabaseMappa from 'database/Mappa'

import { withStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
import Card from '@material-ui/core/Card'
import Slide from '@material-ui/core/Slide'
import IconButton from '@material-ui/core/IconButton'

const styles = theme => ({
    root: {
        marginBottom: theme.spacing.unit * 4,
    },
    appBar: {
        position: 'relative',
        display: 'block',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    flex: {
        flex: 1,
    },
    info: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing.unit * 2,
        '&:hover': {backgroundColor: theme.palette.action.hover},
        '&:active': {backgroundColor: theme.palette.action.selected},
    },
    leftIcon: {
        marginRight: theme.spacing.unit * 2,
    },
    map: {
        height: '100%',
        [theme.breakpoints.up('md')]: {
            height: 500,
        },
    },
    leafletContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
});

function DialogTransition(props) {
    return <Slide direction="up" {...props} />;
}

class MappaInserimento extends React.PureComponent {

    state = {
        completo: '',
        data: {},
        openMapDialog: false,
    }

    openMapDialog = () => {
        this.setState({openMapDialog: true});
        this.props.history.push("/segnala/#mappa");
    }
    closeMapDialog = () => this.props.history.goBack();

    selectLocation = event => {
        this.setState({
            completo: event.completo
        });
        this.props.selectLocation && this.props.selectLocation(event);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            data: nextProps.data,
            completo: nextProps.data.completo
        })
    }

    componentDidMount() {
        this.props.currentLocation && DatabaseMappa.nearestPoint(this.props.currentLocation).then(data => {
            this.setState({
              completo: data.COMPLETO,
            });
        });

        window.onpopstate = () => this.state.openMapDialog
            ? this.setState({openMapDialog: false})
            : this.props.history.location.hash==="#mappa" && this.setState({openMapDialog: true});
    }

    render() {
        const { classes } = this.props;

        return(
            <Card elevation={3} className={classes.root}>

                {/* DESKTOP */}
                <Hidden smDown><div className={classes.map}>
                    <Mappa data={this.state.data}
                        scegliPosizione={true}
                        selectLocation={this.selectLocation}
                        history={this.props.history}/>
                </div></Hidden>

                {/* MOBILE */}
                <Hidden mdUp>
                    <Typography variant="subheading" className={classes.info} onClick={this.openMapDialog}>
                        <Icon className={classes.leftIcon} style={{fontSize:18}}>place</Icon>
                        <span className={classes.leftIcon}>{this.state.completo ? <b>{this.state.completo}</b> : <em>Nessun indirizzo</em>}</span>
                        <Icon style={{fontSize:18}}>keyboard_arrow_right</Icon>
                    </Typography>
                    <Dialog fullScreen
                        TransitionComponent={DialogTransition}
                        open={this.state.openMapDialog}
                        onClose={this.closeMapDialog}
                        className={classes.container}>
                        <AppBar className={classes.appBar}>
                            <Toolbar>
                                <IconButton color="inherit" onClick={this.closeMapDialog}>
                                    <Icon>close</Icon>
                                </IconButton>
                                <Typography variant="title" color="inherit" className={classes.flex}>
                                    Punto della segnalazione
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Mappa data={this.state.data}
                            scegliPosizione={true}
                            selectLocation={this.selectLocation}
                            closeMapDialog={this.closeMapDialog}
                            history={this.props.history}/>
                    </Dialog>
                </Hidden>
            </Card>
        )
    }
}

MappaInserimento.propTypes = {
    classes: PropTypes.object,
    theme: PropTypes.object.isRequired,
}

export default withStyles(styles,{withTheme:true})(MappaInserimento)