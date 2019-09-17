import React from 'react'
import PropTypes from 'prop-types'
import Routes from 'Routes'
import { connect } from 'react-redux'
import { setOnboarding } from 'store/login/Actions'
import { withRouter } from 'react-router-dom'
//import { Snackbar } from 'react-redux-snackbar'

import OnBoarding from 'components/OnBoarding'
import NotificationRequest from 'components/NotificationRequest'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
    root: {
        flexGrow: 1,
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
    },
});

class Main extends React.PureComponent {

    startOnboarding = () => {
        this.props.setOnboarding(false);
        setTimeout(() => this.notifications.getWrappedInstance().requestNotifications(),10000);
    }

    componentDidMount() {
        !this.props.onboarding && setTimeout(() => this.notifications.getWrappedInstance().requestNotifications(),10000);
    }

    render() {
        const { classes } = this.props;

        return(
        <div className={classes.root}>
            {Routes}

            <OnBoarding startOnboarding={this.startOnboarding}/>

            <NotificationRequest ref={ref => (this.notifications=ref)}/>

            {/*<Snackbar id="snackbar" customStyles={{
                snack: {
                    position: 'absolute',
                    backgroundColor: 'rgb(49, 49, 49)',
                    bottom: 0,
                    zIndex: 1600,
                }}}/>*/}
        </div>
        )
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    setOnboarding: onboarding => dispatch(setOnboarding(onboarding)),
});

export default withRouter(connect(null,mapDispatchToProps)(withStyles(styles, { withTheme: true })(Main)))