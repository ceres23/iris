import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { connect } from 'react-redux'
import { showSnack } from 'react-redux-snackbar'
import ImageCompressor from 'image-compressor.js'

import DbSegnalazione from 'database/Segnalazione'
import DbMappa from 'database/Mappa'

import Mappa from 'pages/segnala/Mappa'
import Informazioni from 'pages/segnala/Informazioni'
import InserisciFoto from 'components/InserisciFoto'
import LoadingButton from 'components/LoadingButton'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Card from '@material-ui/core/Card'

const styles = theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  scrollable: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'scroll',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch',
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
  },
  grid: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexBasis: theme.breakpoints.values.md,
  },
  divider: {
    height: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    left: 'calc(50% - 100px)',
  },
  paddedHorizontal: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
  paddedVertical: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  marginBottom: {
    marginBottom: theme.spacing.unit * 4
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  }
});
  
class Segnala extends React.PureComponent {
  
  state = {
    type: '',
    subject: '',
    description: '',
    mappa: {
      lat: 45.436818,
      lng: 12.329605,
      completo: '',
    },
    foto: [],
    loadingPhoto: false,
    showName: false,
    nc_ok: 'N',
    nome: '',
    email: '',
    openConfirmDialog: false,
    loading: false,
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleCheck = event => {
    let value='N';
    if(event.target.checked)
      value='S';
    
    this.setState({
      showName: event.target.checked,
      nc_ok: value,
    });
  };

  //MAPPA
  findLocation = event => {
    DbMappa.nearestPoint(event).then(data => {
      data.latlng=event;
      this.selectLocation(data);
    });
  }

  selectLocation = event => {
    let mappa = this.state.mappa;
    mappa.lat = event.latlng.lat;
    mappa.lng = event.latlng.lng;
    mappa.completo = event.completo;
    this.setState({
      mappa: mappa,
    });
  };

  openConfirmDialog = () => {
    this.setState({openConfirmDialog: true});
  }

  closeConfirmDialog = () => {
    this.setState({openConfirmDialog: false});
  }

  disableButton = () => {
    if(this.state.loading
      || this.state.subject===""
      || this.state.type===""
      || (
        !this.props.login && (
          this.state.nome===""
          || this.state.email===""
        )
      ))
      return true;
    return false;
  }

  controllaSegnalazione = event => {
    let error=false;
    if(this.state.mappa.completo === ''){
      this.props.showSnack({
        label: 'Nessun indirizzo selezionato',
        timeout: 1500,
      });
      error=true;
    }
    if(this.state.type === ''){
      this.props.showSnack({
        label: 'Nessuna tipologia selezionata',
        timeout: 1500,
      });
      error=true;
    }

    if(!error) this.openConfirmDialog();
    event.preventDefault();
  }

  inviaSegnalazione = () => {
    var data={
      INDICAZIONI: this.state.description,
      SUBJECT: this.state.subject,
      FK_TIPOLOGIA: this.state.type,
      NC_OK: this.state.nc_ok,
      DEVICE: navigator.userAgent,
      POSIZIONE: {
        LATITUDINE: this.state.mappa.lat,
        LONGITUDINE: this.state.mappa.lng,
      },
      FOTO: this.state.foto
    };

    if(!this.props.login){
      data.NOME=this.state.nome;
      data.EMAIL=this.state.email;
    }

    this.setState({loading: true});

    const scope=this;
    DbSegnalazione.inviaSegnalazione(data).then(result =>
      setTimeout(() => {
        this.setState({loading: false});

        if(result.Errore){
          scope.props.showSnack({
            label: result.Errore,
            timeout: 3000,
          });
        } else{
          scope.props.showSnack({
            label: 'Segnalazione aggiunta',
            timeout: 3000,
          });
          this.props.history.replace('/dettaglio/'+result.NuovoId);
        }
      },1000)
    ).catch(error => {
      this.setState({loading: false});
      scope.props.showSnack({
        label: 'Impossibile aggiungere la segnalazione. Riprova',
        timeout: 3000,
      });
    });

    this.closeConfirmDialog();
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
            INTERNO: 'N',
            PTR_UTENTE: '',
          });

          scope.setState({
            foto: newImages,
            loadingPhoto: false
          });
        }
      },
      error(e) {
        scope.setState({loadingPhoto: false});
      },
    });
  }

  deleteImage = index => {
    this.setState({
      foto: this.state.foto.filter((x,i) => i !== index),
    });
  }

  componentDidMount() {
    this.props.currentLocation && DbMappa.nearestPoint(this.props.currentLocation).then(data => {
      data.latlng=this.props.currentLocation;
      data.completo=data.COMPLETO;
      this.selectLocation(data);
    });

    if(this.props.location.search){
      let params = qs.parse(this.props.location.search.replace(/^\?/, ''));
      this.setState({type:Number(params.tipologia)});
    }
  }

  render() {
    const { classes } = this.props;

    return(
    <form onSubmit={e => this.controllaSegnalazione(e)} className={classes.root}>
      <div className={classes.scrollable}><div className={classes.content}>
        <div className={classes.divider}/>

        <Typography variant="headline" align="center" paragraph>
          <b>Nuova segnalazione</b>
        </Typography>

        <Card>
          <Typography variant="body2" align="justify" className={classes.paddedHorizontal + " " + classes.paddedVertical}>
            <b>ATTENZIONE:</b> ti ricordiamo che Iris è un sistema per comunicare problemi di manutenzione urbana e non le emergenze che necessitino di un pronto intervento.<br/>
            In casi simili è invece indispensabile contattare gli enti competenti: Vigili del fuoco, Carabinieri, etc.<br/>
            Se necessiti quindi di un intervento tempestivo, ti consigliamo di non proseguire con questa segnalazione ma di rivolgerti ai servizi preposti.
          </Typography>
        </Card>

        <div className={classes.divider} />
        
        {/*MAPPA*/}
        <Typography variant="title" gutterBottom className={classes.paddedHorizontal}>Posizione</Typography>
        <Mappa data={this.state.mappa}
          currentLocation={this.props.currentLocation}
          selectLocation={this.selectLocation}
          history={this.props.history}/>
        
        {/* INFO */}
        <Typography variant="title" gutterBottom className={classes.paddedHorizontal}>Informazioni</Typography>
        <Informazioni data={this.state}
          handleChange={this.handleChange}/>
        
        {/* FOTO */}
        <div className={classes.grid}>
          <Typography variant="title" className={classes.flex}>Foto</Typography>
          <label htmlFor="raised-button-file">
            <LoadingButton
              loading={this.state.loadingPhoto}
              loadinglabel="Sto caricando..."
              variant="outlined"
              size="small"
              color="secondary"
              component="span">
              <Icon className={classes.leftIcon}>photo_camera</Icon>
              AGGIUNGI FOTO
            </LoadingButton>
          </label>
          <input type="file" accept="image/*" id="raised-button-file" hidden={true} onChange={this.handleImageChange}/>
        </div>
        <Card elevation={3} className={classes.marginBottom}>
          <InserisciFoto data={this.state.foto} deleteImage={this.deleteImage}/>
        </Card>
        
        {/* CONSENTI NOME */}
        {/*<FormControlLabel control={
            <Switch
              checked={this.state.showName}
              onChange={this.handleCheck}/>
          }
          label="Consento di visualizzare il mio nome e cognome"
        />*/}

        <div className={classes.divider}/>
        
        <LoadingButton
          loading={this.state.loading}
          loadinglabel="Invio in corso..."
          type="submit"
          variant="extendedFab"
          color="primary"
          disabled={this.disableButton()}
          className={classes.button}>
          Invia segnalazione
          <Icon className={classes.rightIcon}>send</Icon>
        </LoadingButton>

        <Typography variant="body2" color="textSecondary" align="center" paragraph>
          * campo obbligatorio
        </Typography>
      </div>
    </div>

      <Dialog fullWidth disableBackdropClick open={this.state.openConfirmDialog} onClose={this.closeConfirmDialog}>
        <DialogTitle>Invio della segnalazione</DialogTitle>
        <DialogContent>
          <Typography variant="subheading" color="secondary"><b>Indirizzo</b></Typography>
          <Typography variant="body2" gutterBottom><i>{this.state.mappa.completo}</i></Typography>
          <Typography variant="subheading" color="secondary"><b>Titolo</b></Typography>
          <Typography variant="body2" paragraph><i>{this.state.subject}</i></Typography>
          <Typography variant="subheading"><b>
            {this.state.foto.length===1 ? "1 foto aggiunta" : this.state.foto.length + " foto aggiunte"}
          </b></Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeConfirmDialog}>
            Modifica
          </Button>
          <Button variant="outlined" onClick={this.inviaSegnalazione} color="secondary" type="submit" autoFocus>
            Segnala
          </Button>
        </DialogActions>
      </Dialog>
    </form>
    )
  }
}

Segnala.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return{
    currentLocation: state.filtro.currentLocation,
    login: state.login.login
  }
}

const mapDispatchToProps = dispatch => ({
  showSnack: options => dispatch(showSnack('snackbar',options)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Segnala))