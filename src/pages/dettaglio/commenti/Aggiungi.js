import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { showSnack } from 'react-redux-snackbar'

import DbCommento from 'database/Commento'

import LoadingButton from 'components/LoadingButton'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'

const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
    },
});

class AggiungiCommento extends React.PureComponent {

    state = {
        titolo: '',
        commento: '',
        openDialog: false,
        loading: false,
    }

    handleChange = name => event => this.setState({[name]: event.target.value});

    openDialog = () => {
        this.setState({openDialog: true});
        //this.props.history.push("/dettaglio/"+this.props.segnalazione+"/#commento");
    }
    closeDialog = () => this.setState({openDialog: false});

    inviaCommento = event => {
        var data={
            PTR_SEGNALAZIONE: this.props.segnalazione,
            TITOLO: this.state.titolo,
            TESTO: this.state.commento,
            INTERNO: 'N'
        }
        
        this.setState({loading:true});
        DbCommento.inviaCommento(data).then(result => {
            this.setState({loading:false});
            if(result.Errore) {
                this.props.showSnack({
                    label: 'Impossibile inviare il commento',
                    timeout: 3000,
                });
            } else {
                this.props.showSnack({
                    label: 'Commento inviato',
                    timeout: 3000,
                });
                this.closeDialog();
                window.location.reload();
            }
        });

        event.preventDefault();
    }

    componentDidMount() {
        window.onpopstate = () => this.state.openDialog && this.setState({openDialog: false});
    }

    render() {
        const { classes } = this.props;

        const commentDialog = (
            <Dialog fullWidth open={this.state.openDialog} onClose={this.closeDialog} className={classes.addComment}><form onSubmit={e => this.inviaCommento(e)}>
                <DialogTitle>Nuovo commento</DialogTitle>
                <DialogContent>
                    <TextField fullWidth
                        required
                        autoFocus
                        inputProps={{maxLength: 50}}
                        value={this.state.titolo}
                        onChange={this.handleChange('titolo')}
                        label="Titolo"
                        margin="none"/>
                    <TextField fullWidth
                        required
                        multiline
                        rowsMax="3"
                        inputProps={{maxLength: 500}}
                        value={this.state.commento}
                        onChange={this.handleChange('commento')}
                        label="Commento"
                        margin="normal"/>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.button}
                        onClick={this.closeDialog}>
                        Annulla
                    </Button>
                    <LoadingButton variant="outlined"
                        loading={this.state.loading}
                        loadinglabel="Commenta"
                        type="submit"
                        color="secondary"
                        className={classes.button}>
                        Commenta
                    </LoadingButton>
                </DialogActions>
            </form></Dialog>
        )
    
        return (<div className={classes.root}>
            <Button variant="outlined"
                color="secondary"
                onClick={this.openDialog}>
                Nuovo commento
            </Button>
            {commentDialog}
        </div>)
    }
}

AggiungiCommento.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    showSnack: options => dispatch(showSnack('snackbar',options)),
});

export default connect(null,mapDispatchToProps)(withStyles(styles)(AggiungiCommento));