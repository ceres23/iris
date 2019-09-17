import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { showSnack } from 'react-redux-snackbar'
import moment from 'moment'
//eslint-disable-next-line
import itLocale from 'moment/locale/it'

import Segnala from 'pages/dettaglio/commenti/itemCommento/Segnala'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

const styles = theme => ({
    item: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    content: {
        paddingBottom: 0,
    },
    data: {
        [theme.breakpoints.up('md')]: {
            float: 'right',
        }
    },
    grid: {
        width: '100%',
        display: 'flex',
    },
    gridItem: {
        flex: 1,
    },
});

class ItemCommento extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            openReportDialog: false,
            reportComment: '',
        }
        moment.updateLocale('it',{
            calendar : {
                lastDay : '[ieri alle] LT',
                sameDay : '[oggi alle] LT',
                lastWeek : 'dddd [alle] LT',
                sameElse : 'DD/MM/YYYY [alle] LT'
            }
        });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    openReportDialog = () => {
        this.setState({openReportDialog: true});
    }
    
    closeReportDialog = () => {
        this.setState({openReportDialog: false});
    }

    render() {
        const { classes } = this.props;
        
        return(
        <div>
            <div className={classes.item}>
                <Typography variant="caption" color="inherit" align="right" className={classes.data} title={moment(this.props.data.DATA_COMMENTO,'YYYY-MM-DD HH:mm:ss').format('D MMMM YYYY [alle] HH:mm')}>
                    {moment(this.props.data.DATA_COMMENTO,'YYYY-MM-DD HH:mm:ss').calendar()}
                </Typography>
                <Typography variant="subheading"><b>{this.props.data.TITOLO}</b></Typography>
                <Typography variant="body1" gutterBottom><em>{this.props.data.TESTO}</em></Typography>

                {this.props.login &&
                    <Segnala id={this.props.data.PTR_SEGNALAZIONE}
                        progr={this.props.data.PROGR}/>
                }
            </div>
            <Divider/>
        </div>
        )
    }
}

ItemCommento.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return{
        login: state.login.login
    }
}

const mapDispatchToProps = dispatch => ({
    showSnack: options => dispatch(showSnack('snackbar',options)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(ItemCommento))