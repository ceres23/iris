import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setFilter, setData, setDataRange } from 'store/filtro/Actions'
import {
  MuiPickersUtilsProvider,
  DatePicker
} from 'material-ui-pickers'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import itLocale from 'moment/locale/it'
import moment from 'moment'

import DbParametri from 'database/Parametri'

import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import DialogActions from '@material-ui/core/DialogActions'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
  flex: {
    flex: 1,
  },
});

class Filtro extends React.PureComponent {

    state = {
      types: [],
      municipalita: [],
      states: [],
      q: '',
      id_segnalazione: '',
      type: '',
      munic: '',
      state: '',
      data: '',
      dtinizio: null,
      dtfine: null,
    };

    handleChange = name => event => {
      this.setState({
          [name]: event.target.value,
      });
    }

    handleDateChange = event => {
      this.setState({
        data: event.target.value,
      })
      switch(event.target.value) {
        case 'oggi': this.startDateChange(moment());
                     this.endDateChange(moment());
                     break;
        case 'settimana': this.startDateChange(moment().subtract(7, 'day'));
                          this.endDateChange(moment());
                          break;
        case 'mese': this.startDateChange(moment().startOf('month'));
                     this.endDateChange(moment());
                     break;
        case '':
        case 'custom': this.startDateChange(null);
                       this.endDateChange(null);
                       break;
        default: break;
      }
    }

    startDateChange = date => {
      if(date===null)
        this.setState({ dtinizio: null });
      else
        this.setState({ dtinizio: moment(date).format('YYYY-MM-DD') });
    }

    endDateChange = date => {
      if(date===null)
        this.setState({ dtfine: null });
      else
        this.setState({ dtfine: moment(date).format('YYYY-MM-DD') });
    }

    buildFilter = event => {
      var filtro={};

      if(this.state.id_segnalazione!=='')
        filtro['ID_SEGNALAZIONE']=this.state.id_segnalazione;
      if(this.state.type!=='')
        filtro['FK_TIPOLOGIA']=this.state.type;
      if(this.state.munic!=='')
        filtro['PTR_MUNIC']=this.state.munic;
      if(this.state.state!=='')
        filtro['PTR_TIPO_STATO']=this.state.state;
      
      if(this.state.dtinizio!==null && this.state.dtfine!==null)
        this.props.setDataRange({dtinizio:this.state.dtinizio,dtfine:this.state.dtfine});
      else
        this.props.setDataRange({dtinizio:null,dtfine:null});

      this.props.setData(this.state.data);

      if(Object.keys(filtro).length === 0)
        this.props.setFilter('');
      else
        this.props.setFilter(filtro);
      
      this.props.closeFilterDialog();

      event.preventDefault();
    }

    clearFilter = () => {
      this.props.setFilter('');
      this.props.setData('');
      this.props.setDataRange({dtinizio:null,dtfine:null});
      this.props.closeFilterDialog();
    }

    componentDidMount() {
      DbParametri.getTipologie().then(data => this.setState({types: data}));
      DbParametri.getStati().then(data => this.setState({states: data}));
      DbParametri.getMunicipalita().then(data => this.setState({municipalita: data}));
      
      if(this.props.filter || this.props.data || this.props.dtinizio || this.props.dtfine){
        this.setState({
          id_segnalazione: this.props.filter.ID_SEGNALAZIONE || '',
          type: this.props.filter.FK_TIPOLOGIA || '',
          munic: this.props.filter.PTR_MUNIC || '',
          state: this.props.filter.PTR_TIPO_STATO || '',
          data: this.props.data || '',
          dtinizio: this.props.dtinizio || null,
          dtfine: this.props.dtfine || null,
        })
      }
    }

    componentWillReceiveProps(nextProps){
      if(this.props.filter !== nextProps.filter ||
         this.props.data !== nextProps.data ||
         this.props.dtinizio !== nextProps.dtinizio ||
         this.props.dtfine !== nextProps.dtfine)
        this.setState({
          id_segnalazione: nextProps.filter.ID_SEGNALAZIONE || '',
          type: nextProps.filter.FK_TIPOLOGIA || '',
          munic: nextProps.filter.PTR_MUNIC || '',
          state: nextProps.filter.PTR_TIPO_STATO || '',
          data: nextProps.data || '',
          dtinizio: nextProps.dtinizio || null,
          dtfine: nextProps.dtfine || null,
        })
    }

    render() {
        const { classes, theme } = this.props;
        
        return(
        <form onSubmit={e => this.buildFilter(e)}>

          {/* TIPOLOGIA */}
          <div className={classes.container}>
            <Icon className={classes.icon}>pie_chart</Icon>
            <TextField fullWidth
              select
              label="Tipologia"
              margin="dense"
              value={this.state.type}
              onChange={this.handleChange('type')}>
              <MenuItem key={0} value="">
                <em>Nessun filtro</em>
              </MenuItem>
              {this.state.types.map(type => (
                <MenuItem key={type.ID_TIPO} value={type.ID_TIPO}>
                  {type.DESCRIZIONE}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* MUNICIPALITA */}
          <div className={classes.container}>
            <Icon className={classes.icon}>location_city</Icon>
            <TextField fullWidth
              select
              label="Municipalità"
              margin="dense"
              value={this.state.munic}
              onChange={this.handleChange('munic')}>
              <MenuItem key={0} value="">
                <em>Nessun filtro</em>
              </MenuItem>
              {this.state.municipalita.map(munic => (
                <MenuItem key={munic.COD_MUNIC} value={munic.COD_MUNIC}>
                  {munic.DESCRIZIONE}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* STATO */}
          <div className={classes.container}>
            <Icon className={classes.icon}>show_chart</Icon>
            <TextField fullWidth
              select
              label="Stato segnalazione"
              margin="dense"
              value={this.state.state}
              onChange={this.handleChange('state')}>
              <MenuItem key={0} value="">
                <em>Nessun filtro</em>
              </MenuItem>
              {this.state.states.map(state => (
                <MenuItem key={state.ID_TIPO} value={state.ID_TIPO}>
                  {state.DESCRIZIONE}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* DATA */}
          <div className={classes.container}>
            <Icon className={classes.icon}>today</Icon>
            <TextField fullWidth
              select
              label="Inserite in data"
              margin="dense"
              value={this.state.data}
              onChange={this.handleDateChange}>
              <MenuItem key={0} value="">
                <em>Nessun filtro</em>
              </MenuItem>
              <MenuItem key={1} value="oggi">Oggi</MenuItem>
              <MenuItem key={2} value="settimana">Nell'ultima settimana</MenuItem>
              <MenuItem key={3} value="mese">Da inizio mese</MenuItem>
              <MenuItem key={4} value="custom">Scegli date</MenuItem>
            </TextField>
          </div>
          {this.state.data === 'custom' &&
            <div className={classes.container}>
              <Icon className={classes.icon}>date_range</Icon>
              <MuiPickersUtilsProvider utils={MomentUtils} locale={itLocale}>
                <Grid container spacing={16}>
                  <Grid item md={6} xs={12}>
                    <DatePicker fullWidth
                      disableFuture
                      clearable
                      autoOk
                      format="D MMMM YYYY"
                      label="Dalla data"
                      value={this.state.dtinizio}
                      onChange={this.startDateChange}/>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <DatePicker fullWidth
                      disableFuture
                      clearable
                      autoOk
                      format="D MMMM YYYY"
                      label="Alla data"
                      minDateMessage="La data dev'essere successiva alla data di inizio"
                      minDate={this.state.dtinizio}
                      value={this.state.dtfine}
                      onChange={this.endDateChange}/>
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
            </div>
          }

          {/* NUMERO SEGNALAZIONE */}
          <TextField fullWidth
            label="Numero segnalazione"
            margin="dense"
            type="number"
            value={this.state.id_segnalazione}
            onChange={this.handleChange('id_segnalazione')}/>

          {/* AZIONI */}
          <DialogActions>
            <Button className={classes.button}
              style={{color: theme.palette.error.main}}
              onClick={this.clearFilter}>
              Rimuovi filtro
            </Button>
            <Button variant="outlined"
              type="submit"
              color="secondary"
              className={classes.button}
              autoFocus>
              Filtra
            </Button>
          </DialogActions>
        </form>
        )
    }
}

Filtro.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return{
    filter: state.filtro.filter,
    data: state.filtro.data,
    dtinizio: state.filtro.dtinizio,
    dtfine: state.filtro.dtfine,
  }
}

const mapDispatchToProps = dispatch => ({
  setFilter: filter => dispatch(setFilter(filter)),
  setData: data => dispatch(setData(data)),
  setDataRange: data_range => dispatch(setDataRange(data_range)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles,{withTheme:true})(Filtro))