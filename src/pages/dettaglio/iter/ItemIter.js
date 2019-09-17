import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
//eslint-disable-next-line
import itLocale from 'moment/locale/it'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

const styles = theme => ({
    item: {
        position: 'relative',
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit,
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
    state: {
        flex: 1,
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'white',
        borderRadius: theme.spacing.unit * 2,
    },
    note: {
        marginTop: theme.spacing.unit,
    }
});

class ItemIter extends React.PureComponent {

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
        
        if(this.props.data.DES_OPER==='-'){
            this.props.data.DES_OPER=this.props.data.REFS;
            this.props.data.REFS='-';
        }
        
        return(<div>
        <div className={classes.item}>
            <Typography variant="caption" color="inherit" align="right" className={classes.data} title={moment(this.props.data.DATA_OPER,'YYYY-MM-DD HH:mm:ss').format('D MMMM YYYY [alle] HH:mm')}>
                {moment(this.props.data.DATA_OPER,'YYYY-MM-DD HH:mm:ss').calendar()}
            </Typography>
            <Typography variant="subheading" gutterBottom>
                da <b>{this.props.data.DES_OPER}</b>
                <span style={{display: this.props.data.REFS==='-' ? 'none' : 'inline' }}>
                    &nbsp;a&nbsp;<b>{this.props.data.REFS}</b>
                </span>
            </Typography>
            <span className={classes.state} style={{backgroundColor: this.props.stateColor}} >{this.props.data.DESCRIZIONE}</span>
            <Typography variant="body1" className={classes.note} style={{display: this.props.data.NOTE==='-' ? 'none' : 'flex' }}>
                <em>{this.props.data.NOTE}</em>
            </Typography>
        </div>
        <Divider/>
        </div>)
    }
}

ItemIter.propTypes = {
    classes: PropTypes.object.isRequired,
    current: PropTypes.bool
};

export default withStyles(styles)(ItemIter)