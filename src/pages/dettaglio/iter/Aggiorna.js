import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { showSnack } from 'react-redux-snackbar'
import ImageCompressor from 'image-compressor.js'

import DbSegnalazione from 'database/Segnalazione'
import DbParametri from 'database/Parametri'

import LoadingButton from 'components/LoadingButton'
import InserisciFoto from 'components/InserisciFoto'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
});

class AggiornaIter extends React.PureComponent {

    state = {
        statiOperazione: [],
        subStatiOperazione: [],
        nextState: '',
        nextSubState: '',
        foto: [],
        openDialog: false,
        loading: false,
        loadingPhoto: false,
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    toggleDialog = () => {
        this.setState({
            openDialog: !this.state.openDialog,
        });
    }

    aggiornaIter = event => {
        var data={
            ID: this.props.segnalazione,
            NOTE: this.state.commento,
            STATO: this.state.nextState,
            SUBSTATO: this.state.nextSubState,
            FOTO: this.state.foto,
        }

        if(data.STATO === '' || (data.STATO === 30 && data.SUBSTATO === '')){
            this.props.showSnack({
                label: 'Seleziona uno stato',
                timeout: 1500,
            });
        } else {
            this.setState({loading:true});
            DbSegnalazione.aggiornaIter(data).then(result => {
                this.setState({loading:false});
                this.props.showSnack({
                    label: 'Iter aggiornato',
                    timeout: 3000,
                });
                this.toggleDialog();
                window.location.reload();
            });
        }

        event.preventDefault();
    }

    //FOTO
    handleImageChange = (e) => {
        if(e.target.files.length===0) return;
        const scope = this;
        this.setState({loadingPhoto:true});
        new ImageCompressor(e.target.files[0], {
        quality: .8,
        maxWidth: 1920,
        maxHeight: 1920,
        convertSize: 1000000,
        success(result) {
            let reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onloadend = () => {
            var newImages = scope.state.foto.slice();
            newImages.push({
                NOME_FILE: result.name,
                IMMAGINE: reader.result,
                INTERNO: 'S',
                PTR_UTENTE: '',
            });

            scope.setState({
                foto: newImages,
                loadingPhoto: false,
            });
            }
        },
        error(e) {
            console.log(e.message);
            this.setState({loadingPhoto:false});
        },
        });
    }

    deleteImage = index => {
        this.setState({
        foto: this.state.foto.filter((x,i) => i !== index),
        });
    }

    componentDidMount() {
        DbParametri.getStatiOperazione().then(data => this.setState({statiOperazione: data}));
        DbParametri.getSubStati().then(data => this.setState({subStatiOperazione: data}));

        switch(this.props.stato){
            case 10: this.setState({nextState: 20}); break;
            default: break;
        }
    }

    render() {
        const { classes } = this.props;

        const iterDialog = (
            <Dialog fullWidth open={this.state.openDialog} onClose={this.toggleDialog}>
                <DialogTitle>
                    {this.props.stato === 10 ? 'Prendi in carico' : 'Aggiorna iter'}
                </DialogTitle>
                <DialogContent>
                <form onSubmit={e => this.aggiornaIter(e)}>
                    {this.props.stato !== 10 &&
                        <TextField fullWidth
                            select
                            required
                            label="Prossimo stato"
                            margin="normal"
                            value={this.state.nextState}
                            onChange={this.handleChange('nextState')}>
                            {this.state.statiOperazione.map(state => (state.ID_TIPO!==20) && (
                                <MenuItem key={state.ID_TIPO} value={state.ID_TIPO}>
                                    {state.DESCRIZIONE}
                                </MenuItem>
                            ))}
                        </TextField>
                    }
                    {this.state.nextState === 30 &&
                        <TextField fullWidth
                            select
                            required
                            label="Tipo conclusione"
                            margin="normal"
                            value={this.state.nextSubState}
                            onChange={this.handleChange('nextSubState')}
                            >
                            {this.state.subStatiOperazione.map(state => (
                                <MenuItem key={state.ID_SUBTIPO} value={state.ID_SUBTIPO}>
                                    {state.DESCRIZIONE}
                                </MenuItem>
                            ))}
                        </TextField>
                    }
                    <TextField fullWidth
                        multiline
                        required
                        rowsMax="3"
                        inputProps={{maxLength: 2000}}
                        value={this.state.commento}
                        onChange={this.handleChange('commento')}
                        className={classes.commentInput}
                        label="Note"
                        margin="normal"/>

                    <label htmlFor="raised-button-file">
                        <LoadingButton
                            loading={this.state.loadingPhoto}
                            loadinglabel="Sto caricando..."
                            variant="outlined"
                            color="secondary"
                            component="span">
                            <Icon className={classes.leftIcon}>photo_camera</Icon>
                            AGGIUNGI FOTO
                        </LoadingButton>
                    </label>
                    <input accept="image/*" id="raised-button-file" type="file" hidden={true} onChange={this.handleImageChange}/>

                    <InserisciFoto data={this.state.foto}
                        handleImageChange={this.handleImageChange}
                        deleteImage={this.deleteImage}/>

                    <DialogActions>
                        <Button onClick={this.toggleDialog}>
                            Annulla
                        </Button>
                        <LoadingButton variant="outlined"
                            loading={this.state.loading}
                            loadinglabel="Aggiorna"
                            type="submit"
                            color="secondary">
                            Aggiorna
                        </LoadingButton>
                    </DialogActions>
                </form>
                </DialogContent>
            </Dialog>
        )
    
        return (<div>
            {this.props.stato === 30 ? <Typography variant="subheading" color="textSecondary">Segnalazione conclusa</Typography>
            :<div className={classes.root}>
                <Button variant="outlined"
                    color="secondary"
                    onClick={this.toggleDialog}>
                    Aggiorna iter
                </Button>
                {iterDialog}
            </div>}
        </div>)
    }
}

AggiornaIter.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    showSnack: options => dispatch(showSnack('snackbar',options)),
});

export default connect(null,mapDispatchToProps)(withStyles(styles)(AggiornaIter));