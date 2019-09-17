import React from 'react'
import PropTypes from 'prop-types'

import Mappa from 'components/Mappa'
import ListaSegnalazioni from 'pages/ListaSegnalazioni'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        width: '100%',
        height: '100%',
    }
});

class MappaSegnalazioni extends React.PureComponent {

    render() {
        const { classes } = this.props;
        
        return(
        <div className={classes.root}>
            <Mappa scegliPosizione={true}
                linkInserimento={true}
                mostraFab={true}
                history={this.props.history}/>
            <ListaSegnalazioni/>
        </div>
        )
    }
}

MappaSegnalazioni.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MappaSegnalazioni)