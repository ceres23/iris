import React from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import {connect} from 'react-redux'
import { showSnack } from 'react-redux-snackbar'
import moment from 'moment'
//eslint-disable-next-line
import itLocale from 'moment/locale/it'

import Mappa from 'components/Mappa'
import Segnala from 'pages/dettaglio/informazioni/Segnala'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Card from '@material-ui/core/Card'
import Divider from '@material-ui/core/Divider'

const styles = theme => ({
    paper: {
        marginBottom: theme.spacing.unit * 4,
        [theme.breakpoints.up('md')]: {
            marginTop: theme.spacing.unit * 4,
        }
    },
    content: {
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing.unit * 4,
        }
    },
    map: {
        display: 'flex',
        height: 200,
        [theme.breakpoints.up('md')]: {
            height: 360,
        }
    },
    grid: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: theme.spacing.unit * 2,
    },
    gridItem: {
        flex: 1,
    },
    centerVertical: {
        verticalAlign: 'middle',
    },
    marginBottom: {
        marginBottom: theme.spacing.unit,
    },
    icon: {
        fontSize: 21,
        marginLeft: theme.spacing.unit / 2,
        marginRight: theme.spacing.unit * 2,
    },
    iconSmall: {
        fontSize: 18,
        marginRight: theme.spacing.unit / 2,
    },
    socialItem: {
        cursor: 'pointer',
        marginRight: theme.spacing.unit,
    }
  });

class Info extends React.PureComponent {

    constructor(props){
        super(props);
        moment.updateLocale('it',{
            calendar : {
                lastDay : '[ieri alle] LT',
                sameDay : '[oggi alle] LT',
                lastWeek : 'dddd [alle] LT',
                sameElse : 'DD/MM/YYYY [alle] LT'
            }
        });
    }

    render() {
        const { classes } = this.props;
        let location;
        if(this.props.data.location)
            location = new L.latLng(this.props.data.location.lat,this.props.data.location.lon);

        return(
        <Card elevation={3} className={classes.paper}>
            <div className={classes.map}>
                <Mappa data={location}/>
            </div>
            <div className={classes.content}>
                <div className={classes.grid}>
                    <Typography variant="body1" className={classes.gridItem}>
                        Segnalazione {this.props.data.ID_SEGNALAZIONE}
                    </Typography>
                    <Typography variant="body1" align="right" title={moment(this.props.data.DATA_SEGNALAZIONE,'YYYY-MM-DD HH:mm:ss').format('D MMMM YYYY [alle] HH:mm')}>
                        <b>{moment(this.props.data.DATA_SEGNALAZIONE,'YYYY-MM-DD HH:mm:ss').calendar()}</b>
                    </Typography>
                </div>
                <Typography variant="body1"><em>
                    {this.props.data.TIPOLOGIA}
                </em></Typography>
                <Typography variant="headline" gutterBottom>
                    <b>{this.props.data.OGGETTO}</b>
                </Typography>
                <Typography variant="subheading" paragraph>
                    {this.props.data.INDICAZIONI}
                </Typography>

                <Typography variant="body1" paragraph>
                    <Icon className={classes.iconSmall}>place</Icon>
                    <b>{this.props.data.MUNICIPALITA}</b> vicino a {this.props.data.INDIRIZZO_SITO}
                </Typography>

                <Divider light className={classes.marginBottom}/>

                <div className={classes.grid}>
                    <Typography variant="subheading"><b>{this.props.data.FOTO ? this.props.data.FOTO.length : 0}</b></Typography>
                    <Icon className={classes.icon}>photo_camera</Icon>
                    <Typography variant="subheading"><b>{this.props.data.COMMENTI ? this.props.data.COMMENTI.length : 0}</b></Typography>
                    <Icon className={classes.icon}>comment</Icon>
                    {(this.props.data.PTR_TIPO_STATO === 10 && this.props.login) &&
                        <Segnala id={this.props.data.ID_SEGNALAZIONE}
                            history={this.props.history}/>
                    }
                </div>
                {/*<Condividi/>*/}
            </div>
        </Card>
        )
    }
}

Info.propTypes = {
    classes: PropTypes.object,
}

const mapStateToProps = state => {
    return{
        login: state.login.login
    }
}

const mapDispatchToProps = dispatch => ({
    showSnack: options => dispatch(showSnack('snackbar',options)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Info))