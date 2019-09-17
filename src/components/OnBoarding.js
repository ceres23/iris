import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {isMobile} from 'react-device-detect'
import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel'

import Citta from 'images/citta.jpg'
import Dime from 'images/dime.png'
import Map from 'images/map.png'
import Notif from 'images/notification.png'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    mediaContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    logoCitta: {
        marginTop:theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 2,
        alignSelf: 'flex-start',
        height: 96,
        padding: theme.spacing.unit * 2,
        backgroundColor: '#ffffff',
        borderRadius: theme.spacing.unit * 2
    },
    slideImg: {
        maxWidth: '80%',
        maxHeight: 128,
        alignSelf: 'center'
    }
});

class OnBoarding extends React.PureComponent {

    getColor = id => {
        var color=this.props.states.find(state => state.ID_TIPO === id);
        if(color) return color.COLORE;
        return 'black';
    }

    render() {
        const { classes, theme } = this.props;
    
        return (
            <AutoRotatingCarousel
                label='Inizia subito!'
                autoplay={isMobile}
                interval={5000}
                mobile={isMobile}
                open={this.props.onboarding}
                onStart={this.props.startOnboarding}>
                <Slide
                    media={<div className={classes.mediaContainer}>
                            <img alt="" src={Citta} className={classes.logoCitta}/>
                            <div style={{flexGrow:1}}/>
                            <img alt="" src={Dime} className={classes.slideImg} />
                        </div>}
                    mediaBackgroundStyle={{ backgroundColor: theme.palette.primary.main }}
                    style={{ backgroundColor: theme.palette.primary.main }}
                    title='Benvenuto in IRIS!'
                    subtitle='Partecipa alla vita della tua città e segnala i problemi di manutenzione urbana'/>
                <Slide
                    media={<div className={classes.mediaContainer}>
                            <img alt="" src={Citta} className={classes.logoCitta}/>
                            <div style={{flexGrow:1}}/>
                            <img alt="" src={Map} className={classes.slideImg} />
                        </div>}
                    mediaBackgroundStyle={{ backgroundColor: theme.palette.secondary.main }}
                    style={{ backgroundColor: theme.palette.secondary.main }}
                    title='Segnala'
                    subtitle='Scegli sulla mappa dove si trova il problema'/>
                <Slide
                    media={<div className={classes.mediaContainer}>
                            <img alt="" src={Citta} className={classes.logoCitta}/>
                            <div style={{flexGrow:1}}/>
                            <img alt="" src={Notif} className={classes.slideImg} />
                        </div>}
                    mediaBackgroundStyle={{ backgroundColor: theme.palette.error.main }}
                    style={{ backgroundColor: theme.palette.error.main }}
                    title='Sempre aggiornato'
                    subtitle='Riceverai una notifica ogni volta che la tua segnalazione sarà aggiornata'/>
            </AutoRotatingCarousel>
        )
    }
}

OnBoarding.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return{
        onboarding: state.login.onboarding,
    }
}

export default connect(mapStateToProps)(withStyles(styles,{withTheme:true})(OnBoarding))