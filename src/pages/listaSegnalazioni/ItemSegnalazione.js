import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/it'
import { connect } from 'react-redux'
import { showSnack } from 'react-redux-snackbar'

import DbSegnalazione from 'database/Segnalazione'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
    item: {
        cursor: 'pointer',
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        '&:hover': {backgroundColor: theme.palette.action.hover},
        '&:active': {backgroundColor: theme.palette.action.selected},
    },
    grid: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing.unit / 2,
    },
    gridItem: {
        flex: 1,
    },
    icon: {
        fontSize: 18,
        marginLeft: theme.spacing.unit / 2,
        marginRight: theme.spacing.unit * 2,
        verticalAlign: 'middle',
    },
    state: {
        flex: 1,
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingTop: 2,
        paddingBottom: 2,
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'white',
        borderRadius: theme.spacing.unit * 2,
    }
});

class SegnalazioneItem extends React.PureComponent {

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

    openDetail = () => this.props.data.PTR_TIPO_STATO === 10
        ? DbSegnalazione.miaSegnalazione(this.props.data.ID_SEGNALAZIONE).then(result => result.vedi === 'no'
            ? this.props.showSnack({
                label: 'Le segnalazioni possono essere viste quando prese in carico',
                timeout: 1500,
            })
            : this.props.history.push("/dettaglio/" + this.props.data.ID_SEGNALAZIONE)
        )
        : this.props.history.push("/dettaglio/" + this.props.data.ID_SEGNALAZIONE);

    /*openDetail = () => this.props.history.push("/dettaglio/" + this.props.data.ID_SEGNALAZIONE);*/

    render() {
        const { classes, theme } = this.props;
        
        return(
        <div className={classes.item} onClick={this.openDetail}>
            <div className={classes.grid}>
                <Typography variant="caption" className={classes.gridItem}>
                    Segnalazione {this.props.data.ID_SEGNALAZIONE}
                </Typography>
                <Typography variant="caption" align="right" color="textSecondary" title={moment(this.props.data.DATA_SEGNALAZIONE,'YYYY-MM-DD HH:mm:ss').format('D MMMM YYYY [alle] HH:mm')}>
                    <b>{moment(this.props.data.DATA_SEGNALAZIONE,'YYYY-MM-DD HH:mm:ss').calendar()}</b>
                </Typography>
            </div>
            <Typography variant="title" gutterBottom>
                <b>{this.props.data.OGGETTO}</b>
            </Typography>
            <div className={classes.grid}>
                <span>
                    <div className={classes.state} title={this.props.data.STATO.split(': ')[1]} style={{backgroundColor: this.props.stateColor}}>
                        {this.props.data.STATO.split(': ')[0]}
                    </div>
                </span>
                <Typography variant="body2" noWrap className={classes.gridItem}><em>
                    {this.props.data.TIPOLOGIA}
                </em></Typography>
                    {this.props.data.FOTO.length > 0 &&
                        <Typography variant="body2">
                            <b>{this.props.data.FOTO.length}</b>
                            <Icon className={classes.icon}>photo_camera</Icon>
                        </Typography>
                    }
                    {this.props.data.COMMENTI.length > 0 &&
                        <Typography variant="body2">
                            <b>{this.props.data.COMMENTI.length}</b>
                            <Icon className={classes.icon}>comment</Icon>
                        </Typography>
                    }
            </div>
            <Typography variant="body2" style={{marginLeft: theme.spacing.unit}}>
                <b>{this.props.data.MUNICIPALITA}</b> | {this.props.data.INDIRIZZO_SITO}
            </Typography>
        </div>
        )
    }
}

SegnalazioneItem.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    showSnack: options => dispatch(showSnack('snackbar',options)),
});

export default connect(null,mapDispatchToProps)(withStyles(styles,{withTheme: true})(SegnalazioneItem))