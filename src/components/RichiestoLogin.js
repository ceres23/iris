import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit *2,
        textAlign: 'center'
    }
});

class RichiestoLogin extends React.PureComponent {

  render() {
    const { classes } = this.props;

    return(
    <div className={classes.root}>
        <Typography variant="subheading" paragraph>
            Per visualizzare questa pagina, devi effettuare il login
        </Typography>
        <Button variant="outlined"
            color="secondary"
            size="large"
            component={Link} to="/login">
            Accedi
        </Button>
    </div>
    )
  }
}

RichiestoLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles,{withTheme:true})(RichiestoLogin);