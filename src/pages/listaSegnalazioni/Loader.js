import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'

const styles = theme => ({
    root: {
        height: 28,
        minHeight: 28,
        lineHeight: '14px',
        position: 'absolute',
        left: theme.spacing.unit,
        bottom: theme.spacing.unit,
        display: 'flex',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#ffffff',
    },
    iconLeft: {
        fontSize: 16,
        marginRight: theme.spacing.unit / 2,
    }
});

class Loader extends React.PureComponent{
    render() {
        const {classes} = this.props;

        return(
            <Button key={0}
                disableRipple
                variant="extendedFab"
                size="small"
                className={classes.root}>
                <Icon className={classes.iconLeft}>hourglass_full</Icon>
                <b>Caricamento...</b>
            </Button>
        )
    }
}

Loader.propTypes = {
    classes: PropTypes.object,
}

export default withStyles(styles)(Loader)