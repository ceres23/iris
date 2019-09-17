import React from 'react'
import {connect} from 'react-redux'
import { showSnack } from 'react-redux-snackbar'

import DbSegnalazione from 'database/Segnalazione'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'

class Segnala extends React.PureComponent {

    state = {
        openReportDialog: false,
        reportComment: '',
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    openReportDialog = () => {
        this.setState({openReportDialog: true});
        this.props.history.push("/dettaglio/"+this.props.id+"/#segnala");
    }
    closeReportDialog = () => this.props.history.goBack();

    inviaInopportuna = e => {
        var segn={};
        segn.PTR_SEGNALAZIONE=this.props.id;
        segn.MOTIVO=this.state.reportComment;
        DbSegnalazione.rimuoviSegnalazione(segn).then(result => {
            this.props.showSnack({
                label: 'Grazie per aver segnalato il problema',
                timeout: 1500,
            });
            this.closeReportDialog();
            window.location.reload();
        });

        e.preventDefault();
    }

    componentDidMount() {
        window.onpopstate = () => this.state.openReportDialog && this.setState({openReportDialog: false});
    }

    render() {
        return(
        <div>
            <Button variant="outlined"
                color="secondary"
                size="small"
                onClick={this.openReportDialog}>
                Segnalazione inopportuna
            </Button>

            <Dialog fullWidth open={this.state.openReportDialog} onClose={this.closeReportDialog}><form onSubmit={this.inviaInopportuna}>
                <DialogTitle>Segnalazione inopportuna</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Stai comunicando la presenza di una segnalazione che ritieni inopportuna.<br/><br/>
                        Questa sarà temporaneamente rimossa dalla lista e, a seguito di una nostra verifica, ripristinata o cancellata definitivamente<br/><br/>
                    </DialogContentText>
                    <TextField fullWidth
                        required
                        autoFocus
                        inputProps={{maxLength: 200}}
                        label="Commento"
                        onChange={this.handleChange('reportComment')}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.closeReportDialog}>
                        Annulla
                    </Button>
                    <Button variant="outlined" type="submit" color="secondary">
                        Segnala
                    </Button>
                </DialogActions>
            </form></Dialog>
        </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        login: state.login.login
    }
}

const mapDispatchToProps = dispatch => ({
    showSnack: options => dispatch(showSnack('snackbar',options)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Segnala)