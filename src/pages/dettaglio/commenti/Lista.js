import React from 'react'
import PropTypes from 'prop-types'
import ItemCommento from 'pages/dettaglio/commenti/ItemCommento'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'

const styles = theme => ({
    paper: {
        marginBottom: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    noItems: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class ListaCommenti extends React.PureComponent {

    state = {
        commenti: [],
        titolo: '',
        commento: '',
    }

    componentWillReceiveProps(nextProps) {
        this.setState({commenti: nextProps.data});
    }

    render() {
        const { classes } = this.props;

        return(
        <Card elevation={3} className={classes.paper}>
            {!this.state.commenti.length ?
                <Typography variant="subheading" color="textSecondary" align="center" className={classes.noItems}><em>Nessun commento inserito</em></Typography>
                :this.state.commenti.map((comment,i) => (
                    <ItemCommento key={i} data={comment}/>
                ))
            }
        </Card>
        )
    }
}

ListaCommenti.propTypes = {
    classes: PropTypes.object,
}

export default withStyles(styles)(ListaCommenti)