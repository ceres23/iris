import React from 'react'
import urlsafeBase64 from 'urlsafe-base64'
import { connect } from 'react-redux'
import { setEndpoint, setNotificationRequest } from 'store/login/Actions'
import { showSnack } from 'react-redux-snackbar'

import DbUtente from 'database/Utente'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'

const updateNotifications = () => {
    return navigator.serviceWorker.getRegistration().then(async registration => {
        var result = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlsafeBase64.decode(process.env.REACT_APP_SERVER_KEY)
        }).then(subscription => {
            return subscription;
        });

        return result;
    });
}

class NotificationRequest extends React.PureComponent {

    state = {
        showNotificationDialog: false,
    }

    closeDialog = () => {
        this.setState({showNotificationDialog:false});
        this.props.setNotificationRequest(false);
    }

    requestNotifications = () => {
        if(this.props.login &&
            'PushManager' in window &&
            'Notification' in window &&
            (
                (
                    Notification.permission !== 'granted' &&
                    Notification.permission !== 'denied'
                ) ||
                Notification.permission === "default"
            )) {
            this.props.notificationRequest
                ? this.setState({showNotificationDialog:true})
                : this.activateNotifications();
        }
    }

    activateNotifications = () => {
        const scope=this;
        navigator.serviceWorker.getRegistration().then(async registration => {
            await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlsafeBase64.decode(process.env.REACT_APP_SERVER_KEY)
            }).then(subscription => {
                DbUtente.salvaEndpoint(JSON.stringify(subscription));
                scope.props.showSnack({
                    label: 'Le notifiche sono state attivate',
                    timeout: 3000,
                });
                scope.props.setEndpoint(subscription);
                this.closeDialog();
            })
            .catch(() => {
                scope.props.showSnack({
                    label: 'Non è stato possibile attivare le notifiche',
                    timeout: 3000,
                });
                this.closeDialog();
            });
        });
    }

    render() {
        return (
            <Dialog fullWidth open={this.state.showNotificationDialog} onClose={this.closeDialog}>
                <DialogTitle>Rimani aggiornato</DialogTitle>
                <DialogContent><DialogContentText>
                    Attiva le notifiche sul tuo browser per ricevere aggiornamenti sullo stato delle tue segnalazioni
                </DialogContentText></DialogContent>
                <DialogActions>
                    <Button onClick={this.closeDialog}>
                        Non ora
                    </Button>
                    <Button variant="outlined"
                        type="submit"
                        color="secondary"
                        onClick={this.activateNotifications}>
                        Attiva
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = state => {
    return{
        login: state.login.login,
        notificationRequest: state.login.notificationRequest
    }
}

const mapDispatchToProps = dispatch => ({
    setEndpoint: endpoint => dispatch(setEndpoint(endpoint)),
    setNotificationRequest: notificationRequest => dispatch(setNotificationRequest(notificationRequest)),
    showSnack: options => dispatch(showSnack('snackbar',options))
});

export default connect(mapStateToProps,mapDispatchToProps,null,{withRef:true})(NotificationRequest)
export {updateNotifications}