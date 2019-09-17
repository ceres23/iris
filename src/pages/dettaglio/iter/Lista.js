import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import DbParametri from 'database/Parametri'

import ItemIter from 'pages/dettaglio/iter/ItemIter'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import Hidden from '@material-ui/core/Hidden'
import Icon from '@material-ui/core/Icon'
import Card from '@material-ui/core/Card'

const styles = theme => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: theme.spacing.unit * 4,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    expandButton: {
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    }
});

class ListaIter extends React.PureComponent {
    state = {
        states: [],
        expanded: false,
    }

    getColor = id => {
        let state=this.state.states.find(state => state.ID_TIPO === id);
        if(state) return state.COLORE;
        return null;
    }

    handleExpandClick = () => {
        this.setState({ expanded: !this.state.expanded });
    };

    componentDidMount() {
        DbParametri.getStati().then(result => this.setState({states:result}));
    }

    render() {
        const { classes } = this.props;

        let first;
        if(this.props.data) first=this.props.data[0];
        let iter = this.props.data.slice(1, this.props.data.length);

        return(
        <Card elevation={3} className={classes.paper}>
            {first && <ItemIter current key={0}
                data={first}
                stateColor={this.getColor(first.PTR_TIPO_STATO)}/>}
            
            {iter.length>0 &&
                <Hidden mdUp>
                    <Collapse in={this.state.expanded}>
                        {iter.map((item,i) => (
                            <ItemIter key={i}
                                data={item}
                                stateColor={this.getColor(item.PTR_TIPO_STATO)}/>
                        ))}
                    </Collapse>
                    <Button className={classes.expandButton} onClick={this.handleExpandClick}>
                        {this.state.expanded ? 'Nascondi' : 'Mostra tutto'}
                        <Icon className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}>keyboard_arrow_down</Icon>
                    </Button>
                </Hidden>
            }

            {iter.length>0 &&
                <Hidden mdDown>
                    {iter.map((item,i) => (
                        <ItemIter key={i}
                            data={item}
                            stateColor={this.getColor(item.PTR_TIPO_STATO)}/>
                    ))}
                </Hidden>
            }
        </Card>
        )
    }
}

ListaIter.propTypes = {
    classes: PropTypes.object,
}

export default withStyles(styles)(ListaIter)