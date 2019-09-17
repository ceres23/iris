import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import Footer from 'components/Footer'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
    root: {
        height: '100%',
        overflowY: 'scroll',
        overflowScrolling: 'touch',
        WebkitOverflowScrolling: 'touch',
    },
    content: {
        minHeight: 'calc(100% - '+theme.spacing.unit * 3+'px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    icon: {
        fontSize: 64,
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 2,
    }
});

class NotFound extends React.PureComponent {

    componentDidMount() {
        document.title="Pagina non trovata";
    }

    render() {
        const { classes } = this.props;
        
        return(<div className={classes.root}>
            <div className={classes.content}>
                <Icon color="error" className={classes.icon}>error</Icon>
                <Typography variant="headline" paragraph>Questa pagina non esiste</Typography>
                <Button variant="outlined"
                    color="secondary"
                    component={Link}
                    replace
                    to="/">
                    Vai alla homepage
                </Button>
            </div>
            <Footer/>
        </div>)
    }
}

NotFound.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotFound)