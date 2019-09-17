import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  offline: {
    flexShrink: 0,
    height: theme.spacing.unit * 2,
    backgroundColor: theme.palette.error.main,
    color: '#ffffff',
    paddingLeft: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
});

class StatoConnessione extends React.PureComponent {

  state = {
    online: true,
  }

  componentDidMount() {
    window.addEventListener('online', () => {this.setState({online:true})});
    window.addEventListener('offline', () => {this.setState({online:false})});
  }

  render() {
    const { classes } = this.props;

    return(
    <div className={classes.offline} style={{display: this.state.online ? 'none' : 'inherit'}}>
        Sembra che tu sia offline al momento.
    </div>
    )
  }
}

StatoConnessione.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles,{withTheme:true})(StatoConnessione);