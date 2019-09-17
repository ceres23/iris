import React from 'react'
import {connect} from 'react-redux'
import { showSnack } from 'react-redux-snackbar'

import DbCommento from 'database/Commento'

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
    }
    
    closeReportDialog = () => {
        this.setState({openReportDialog: false});
    }

    inviaInopportuno = e => {
        var segn={};
        segn.PTR_SEGNALAZIONE=this.props.id;
        segn.PROGR=this.props.progr;
        segn.MOTIVO=this.state.reportComment;
        DbCommento.rimuoviCommento(segn).then(result => {
            this.props.showSnack({
                label: 'Grazie per aver segnalato questo commento',
                timeout: 1500,
            });
            this.closeReportDialog();
            window.location.reload();
        });

        e.preventDefault();
    }

    render() {
        return(
        <div>
            <Button color="secondary"
                size="small"
                onClick={this.openReportDialog}>
                Commento inopportuno
            </Button>

            <Dialog fullWidth open={this.state.openReportDialog} onClose={this.closeReportDialog}><form onSubmit={this.inviaInopportuno}>
                <DialogTitle>Commento inopportuno</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Stai comunicando la presenza di un commento che ritieni inopportuno.<br/><br/>
                        Questo sarà temporaneamente rimosso dalla lista e, a seguito di una nostra verifica, ripristinato o cancellato definitivamente<br/><br/>
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