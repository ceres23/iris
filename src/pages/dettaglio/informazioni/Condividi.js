import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { showSnack } from 'react-redux-snackbar'
import {
    FacebookShareButton,
    GooglePlusShareButton,
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    EmailShareButton,
} from 'react-share'
import {
    FacebookIcon,
    GooglePlusIcon,
    TwitterIcon,
    TelegramIcon,
    WhatsappIcon,
    EmailIcon,
} from 'react-share'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
    grid: {
        display: 'flex',
        alignItems: 'center',
    },
    socialItem: {
        cursor: 'pointer',
        marginRight: theme.spacing.unit,
    }
  });

class Info extends React.PureComponent {

    render() {
        const { classes } = this.props;

        return(<div>
            <Typography variant="body1">Condividi su</Typography>
            <div className={classes.grid}>
                <FacebookShareButton url={window.location.href} className={classes.socialItem}>
                    <FacebookIcon size={32} round/>
                </FacebookShareButton>
                <GooglePlusShareButton url={window.location.href} className={classes.socialItem}>
                    <GooglePlusIcon size={32} round/>
                </GooglePlusShareButton>
                <TwitterShareButton url={window.location.href} className={classes.socialItem}>
                    <TwitterIcon size={32} round/>
                </TwitterShareButton>
                <TelegramShareButton url={window.location.href} className={classes.socialItem}>
                    <TelegramIcon size={32} round/>
                </TelegramShareButton>
                <WhatsappShareButton url={window.location.href} className={classes.socialItem}>
                    <WhatsappIcon size={32} round/>
                </WhatsappShareButton>
                <EmailShareButton url={window.location.href} className={classes.socialItem}>
                    <EmailIcon size={32} round/>
                </EmailShareButton>
            </div>
        </div>)
    }
}

Info.propTypes = {
    classes: PropTypes.object,
}

const mapStateToProps = state => {
    return{
        login: state.login.login
    }
}

const mapDispatchToProps = dispatch => ({
    showSnack: options => dispatch(showSnack('snackbar',options)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Info))