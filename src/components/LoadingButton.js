import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

const LoadingButton = (props) => {
  const { classes, loading, done, ...other } = props;

  if (done) {
    return (
      <Button className={classes.button} {...other} disabled>
        <Icon>check</Icon>
      </Button>
    );
  }
  else if (loading) {
    return (
      <Button disabled className={classes.button} style={{color: props.theme.palette.text.primary}} {...other}>
        {props.loadinglabel}
        <CircularProgress size={24} thickness={8} color={props.color} style={{marginLeft:8}} />
      </Button>
    );
  } else {
    return (
      <Button className={classes.button} {...other} />
    );
  }
}

LoadingButton.defaultProps = {
  loading: false,
  loadinglabel: '',
  done: false,
};

LoadingButton.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  loadinglabel: PropTypes.string,
  done: PropTypes.bool,
};

export default withStyles(styles,{withTheme:true})(LoadingButton);