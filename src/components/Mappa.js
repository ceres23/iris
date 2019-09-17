import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { setCurrentLocation } from 'store/filtro/Actions'
import { showSnack } from 'react-redux-snackbar'
import L from 'leaflet'
import {basemapLayer, tiledMapLayer, featureLayer} from 'esri-leaflet'
import {featureLayer as clusteredFeatureLayer} from 'esri-leaflet-cluster'
import 'leaflet-easybutton/src/easy-button.css'
import {isMobile} from 'react-device-detect'
import moment from 'moment'
// eslint-disable-next-line
import {easyButton} from 'leaflet-easybutton'
// eslint-disable-next-line
import {markerClusterGroup} from 'leaflet.markercluster'
//eslint-disable-next-line
import itLocale from 'moment/locale/it'

import DbParametri from 'database/Parametri'
import DbMappa from 'database/Mappa'
import DbSegnalazione from 'database/Segnalazione'

import CercaIndirizzo from 'components/mappa/CercaIndirizzo'
import Legenda from 'components/mappa/Legenda'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
  root: {
    position: 'relative',
    flex: 1,
    [theme.breakpoints.up('md')]: {
      height: '100%',
    },
    webkitUserSelect: 'none',
    mozkitUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  form: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
    [theme.breakpoints.up('md')]: {
        bottom: 'auto',
        right: 'auto',
        width: 360,
    }
  },
  fab: {
    position: 'absolute',
    //right: 'calc(50% - 28px)',
    right: theme.spacing.unit * 2,
    bottom: 28,
    zIndex: 1500,
    [theme.breakpoints.up('md')]: {
      //right: theme.spacing.unit * 2,
      bottom: theme.spacing.unit * 2
    }
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  }
});

class Mappa extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = {
      states: [],
      zoom: 11,
      latlng: {
        lat: 45.436818,
        lng: 12.329605,
      },
      completo: '',
      openLegendDialog: false,
      layerLoaded: false,
    }
    moment.updateLocale('it',{
        calendar : {
            lastDay : '[ieri alle] LT',
            sameDay : '[oggi alle] LT',
            lastWeek : 'dddd [alle] LT',
            sameElse : 'DD/MM/YYYY [alle] LT'
        }
    });
  }

  closeLegendDialog = () => this.setState({openLegendDialog:false});

  getColor = id => {
    var color=this.state.states.find(state => state.ID_TIPO === id);
    if(color) return color.COLORE;
    return 'black';
  }

  buildFilter = props => {
    let filter=[];

    if(props.q){
      var query="(upper(OGGETTO) LIKE upper('"+props.q+"%') OR upper(OGGETTO) LIKE upper('% "+props.q+"%')";
      query+=   " OR upper(INDICAZIONI) LIKE upper('"+props.q+"%') OR upper(INDICAZIONI) LIKE upper('% "+props.q+"%'))";
      filter.push(query);
    }

    if(props.filter){
      props.filter.ID_SEGNALAZIONE && filter.push("ID_SEGNALAZIONE="+props.filter.ID_SEGNALAZIONE);
      props.filter.FK_TIPOLOGIA && filter.push("COD_TIPOLOGIA="+props.filter.FK_TIPOLOGIA);
      props.filter.PTR_TIPO_STATO && filter.push("COD_STATO="+props.filter.PTR_TIPO_STATO);
      props.filter.PTR_MUNIC && filter.push("PTR_MUNIC="+props.filter.PTR_MUNIC);
    }

    if(props.dataFilter !== 'custom'){
      switch(props.dataFilter) {
        case 'oggi': filter.push("DATA_SEGNALAZIONE >= date '"+moment().format('YYYY-MM-DD')+"'");
                     filter.push("DATA_SEGNALAZIONE <= date '"+moment().format('YYYY-MM-DD')+" 23:59:59'");
                     break;
        case 'settimana': filter.push("DATA_SEGNALAZIONE >= date '"+moment().subtract(7, 'day').format('YYYY-MM-DD')+"'");
                          filter.push("DATA_SEGNALAZIONE <= date '"+moment().format('YYYY-MM-DD')+" 23:59:59'");
                          break;
        case 'mese': filter.push("DATA_SEGNALAZIONE >= date '"+moment().startOf('month').format('YYYY-MM-DD')+"'");
                     filter.push("DATA_SEGNALAZIONE <= date '"+moment().format('YYYY-MM-DD')+" 23:59:59'");
                     break;
        default: filter.push("DATA_SEGNALAZIONE >= date '"+moment().subtract(365, 'day').format('YYYY-MM-DD')+"'");
                 filter.push("DATA_SEGNALAZIONE <= date '"+moment().format('YYYY-MM-DD')+" 23:59:59'");
                 break;
      }
    }
    else{
      props.dtinizio && filter.push("DATA_SEGNALAZIONE >= date '"+props.dtinizio+"'");
      props.dtfine && filter.push("DATA_SEGNALAZIONE <= date '"+props.dtfine+" 23:59:59'");
    }
    
    if(filter.length>0) return filter.join(" AND ");
    return '';
  }

  selectLocation = latlng => {
    this.setState({latlng: latlng});

    if(this.props.scegliPosizione && this.props.currentLocation !== latlng)
      this.props.setCurrentLocation(latlng);
    
    var targetPoint = this.map.project(latlng, this.map.getZoom()).subtract([0, 50]);
    var targetLatLng = this.map.unproject(targetPoint, this.map.getZoom());
    this.map.setView(targetLatLng, this.map.getZoom());
    
    DbMappa.nearestPoint(latlng).then(data => {
      this.setState({completo: data.COMPLETO},() => this.marker.openPopup());
      this.props.selectLocation && this.props.selectLocation(this.state);
    });
  }

  getLocationPermission = () => {
    if(localStorage['authorizedGeoLocation'] === undefined ||
       localStorage['authorizedGeoLocation'] === "0" )
      return false;
    return true;
  }

  relocate = () => {
    navigator.geolocation && navigator.geolocation.getCurrentPosition(
      result => {
        this.aggiornaMarker({lat:result.coords.latitude,lng:result.coords.longitude})
        localStorage['authorizedGeoLocation'] = 1;
      },
      error => {
        this.props.showSnack({
          label: 'Impossibile trovare la posizione attuale',
          timeout: 1500,
        });
        localStorage['authorizedGeoLocation'] = 0;
      },
      {enableHighAccuracy:true,timeout:10000}
    );
  }

  aggiornaMarker = coords => {
    const scope=this;
    this.confini ? this.confini.query().contains(new L.latLng(coords.lat,coords.lng)).ids((error,ids) => {
      if(ids) scope.selectLocation(coords);
      else{
        this.props.showSnack({
          label: 'Punto fuori dai confini comunali',
          timeout: 1500,
        });
        scope.selectLocation(this.state.latlng);
      }
    })
    :scope.selectLocation(coords);
  }

  aggiornaPopupInserimento = marker => {
    let popup, popup_ele;

    if(this.props.linkInserimento) {
      popup = '<div class="content">'
            +   'Numero civico più vicino a questo punto:'
            +   '<div class="subtitle">'
            +     this.state.completo
            +   '</div>'
            + '</div>'
            + '<div class="action">'
            +   '<i class="material-icons">add_circle</i>'
            +   'Aggiungi segnalazione'
            + '</div>';

      popup_ele = document.createElement('div');
      popup_ele.className='popup_link';
      popup_ele.innerHTML=popup;

      const scope=this;
      L.DomEvent.addListener(popup_ele, 'click', () => {
        scope.props.history.push({pathname: '/segnala'})
      }, this);
    }
    else {
      popup = '<div class="content">'
            +   '<div class="subtitle">'
            +     this.state.completo
            +   '</div>'
            + '</div>';
      if(this.props.scegliPosizione && isMobile){
        popup += '<div class="action">'
              +    '<i class="material-icons">check_circle</i>'
              +    'Usa questo indirizzo'
              +  '</div>';
      }

      popup_ele = document.createElement('div');
      popup_ele.className='popup_link';
      popup_ele.innerHTML=popup;

      const scope=this;
      L.DomEvent.addListener(popup_ele, 'click', () => {
        scope.props.closeMapDialog && scope.props.closeMapDialog();
      }, this);
    }

    marker.bindPopup(popup_ele);
  }

  aggiornaPopupDettaglio = event => {
    let popup = '<div class="content">'
              +   moment.utc(event.feature.properties.DATA_SEGNALAZIONE).calendar()
              +   '<div class="title">'
              +     event.feature.properties.OGGETTO
              +   '</div>'
              +   '<span class="state" style="background-color:'+this.getColor(event.feature.properties.COD_STATO)+'">'
              +     event.feature.properties.STATO
              +   '</span>'
              +   '<em>'+event.feature.properties.TIPOLOGIA+'</em><br/>'
              + '</div>'
              + '<div class="action">'
              +   '<i class="material-icons">info</i>'
              +   'Vedi dettaglio segnalazione'
              + '</div>';

    let popup_ele = document.createElement('div');
    popup_ele.className='popup_link';
    popup_ele.innerHTML=popup;

    const scope=this;
    L.DomEvent.addListener(popup_ele, 'click', e => event.feature.properties.COD_STATO===10
      ? DbSegnalazione.miaSegnalazione(event.feature.properties.ID_SEGNALAZIONE).then(result => result.vedi === 'no'
        ? scope.props.showSnack({
          label: 'Le segnalazioni possono essere viste quando prese in carico',
          timeout: 1500,
        })
        : scope.props.history.push({
          pathname: '/dettaglio/'+event.feature.properties.ID_SEGNALAZIONE,
        })
      )
      : scope.props.history.push({
        pathname: '/dettaglio/'+event.feature.properties.ID_SEGNALAZIONE,
      })
      /*scope.props.history.push({
        pathname: '/dettaglio/'+event.feature.properties.ID_SEGNALAZIONE,
      })*/
    , this);

    return popup_ele;
  }

  componentDidMount() {
    this.map = L.map('map', {attributionControl: false}).setView(this.state.latlng, this.state.zoom);
    L.control.attribution({position: 'topright'}).addTo(this.map);

    // RETTANGOLO
    var southWest = L.latLng(45.000, 12.000), northEast = L.latLng(45.800, 12.800);
    this.map.setMaxBounds(L.latLngBounds(southWest, northEast));

    this.map.createPane('base').style.zIndex=399;
    this.map.createPane('satellite').style.zIndex=399;
    this.map.createPane('confini').style.zIndex=401;
    this.map.createPane('segnalazioni').style.zIndex=402;

    this.streets=basemapLayer("Streets",{pane:'base'}).addTo(this.map);
    this.imagery=basemapLayer("Imagery",{pane:'base'});

    const scope=this;

    // SATELLITE
    if(process.env.REACT_APP_MAPPA_COMUNALE){
      this.satellite=tiledMapLayer({ url: process.env.REACT_APP_MAPPA_COMUNALE, pane: 'satellite'});
      this.satelliteGroup=L.layerGroup([this.imagery,this.satellite]);
      L.control.layers({"Strade":this.streets,"Satellite":this.satelliteGroup},null,{position: 'bottomleft'}).addTo(this.map);
    }

    // CONFINI
    if(process.env.REACT_APP_MAPPA_CONFINI && this.props.scegliPosizione)
      this.confini = featureLayer({ url: process.env.REACT_APP_MAPPA_CONFINI, pane: 'confini',
        style:{
          color: this.props.theme.palette.primary.main,
          weight: 4,
          fill: false
        }
      }).addTo(this.map);

    if(process.env.REACT_APP_MAPPA_CONFINI_SECONDARIO && this.props.scegliPosizione)
      featureLayer({ url: process.env.REACT_APP_MAPPA_CONFINI_SECONDARIO, pane: 'confini',
        style:{
          color: this.props.theme.palette.primary.main,
          weight: 1,
          fill: false
        }
      }).addTo(this.map);
    
    // SEGNALAZIONI
    if(process.env.REACT_APP_MAPPA_SEGNALAZIONI && this.props.scegliPosizione) {
      DbParametri.getStati().then(result => {
        this.setState({states:result})
        this.segnalazioni=clusteredFeatureLayer({url: process.env.REACT_APP_MAPPA_SEGNALAZIONI, clusterPane: 'segnalazioni',
          pointToLayer: (evt,latlng) => {
            return L.circleMarker(latlng,{
              radius: 9,
              weight: 4,
              color: scope.getColor(evt.properties.COD_STATO),
              fillColor: '#ffffff',
              fillOpacity: 0.5,
            });
          },
          where: this.buildFilter(this.props),
          removeOutsideVisibleBounds: false,
          showCoverageOnHover: false,
          simplifyFactor: 6,
        }).addTo(this.map);

        this.segnalazioni.on('load', () => {
          if(!this.state.layerLoaded){
            this.setState({layerLoaded:true});
            this.segnalazioni.bindPopup(event => this.aggiornaPopupDettaglio(event));
          }
        });
      });

      L.easyButton('<b>?</b>', () => this.setState({openLegendDialog: true}),{position:'bottomleft'}).addTo(this.map);
    }

    this.map.zoomControl.setPosition('bottomleft');
    this.map.doubleClickZoom.disable();

    this.map.on('zoomend', e => scope.setState({zoom: e.target._zoom}));

    this.marker = L.marker(this.state.latlng,{draggable:this.props.scegliPosizione}).addTo(this.map);

    if(this.props.scegliPosizione){
      isMobile
        ? this.map.on('click', e => {
          if(this.map._panes.popupPane.childElementCount===0)
            scope.aggiornaMarker(e.latlng);
        })
        : this.map.on('dblclick', e => scope.aggiornaMarker(e.latlng));
      
      this.marker.on('dragend', e => scope.aggiornaMarker(this.marker.getLatLng()));

      !this.props.currentLocation && this.getLocationPermission() && this.relocate();
    }

    if(this.props.scegliPosizione && isMobile){
      var cols = document.getElementsByClassName('leaflet-top');
      for(var i=0; i<cols.length; i++)
        cols[i].style.marginTop="46px";
    }

    if(this.props.mostraFab && isMobile){
      cols = document.getElementsByClassName('leaflet-bottom');
      for(i=0; i<cols.length; i++)
        cols[i].style.marginBottom="56px";
    }

    this.props.currentLocation && this.props.scegliPosizione && this.aggiornaMarker(this.props.currentLocation);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.scegliPosizione){
      if(this.segnalazioni && (
          nextProps.q ||
          nextProps.filter ||
          nextProps.dataFilter ||
          nextProps.dtinizio ||
          nextProps.dtfine
        ))
        this.segnalazioni.setWhere(this.buildFilter(nextProps));
      else
      this.segnalazioni.setWhere(this.buildFilter({}));
    }
    else if(nextProps.data)
      this.aggiornaMarker(nextProps.data);
  }

  componentDidUpdate() {
    this.marker.setLatLng(this.state.latlng);
    this.aggiornaPopupInserimento(this.marker);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div id="map" className={classes.map}/>

        {this.props.scegliPosizione &&
          <div className={classes.form}>
            <CercaIndirizzo selectLocation={this.selectLocation}
              indirizzo={this.state.completo}
              relocate={this.relocate}/>
          </div>
        }
        
        {this.props.mostraFab && (!isMobile
          ? <Button component={Link}
            to="/segnala"
            variant="extendedFab"
            color="primary"
            className={classes.fab}>
            <Icon color="inherit" className={classes.leftIcon}>add</Icon>
            Aggiungi segnalazione
          </Button>
          : <Button component={Link}
            to="/segnala"
            variant="fab"
            color="primary"
            className={classes.fab}>
            <Icon color="inherit">add</Icon>
          </Button>
        )}

        <Legenda open={this.state.openLegendDialog}
          closeDialog={this.closeLegendDialog}
          states={this.state.states}/>
      </div>
    )
  }
}

Mappa.propTypes = {
  classes: PropTypes.object,
  theme: PropTypes.object,
}

Mappa.defaultProps = {
  linkInserimento: false,
  scegliPosizione: false,
  mostraFab: false,
};

const mapStateToProps = state => {
  return{
    q: state.filtro.q,
    filter: state.filtro.filter,
    dataFilter: state.filtro.data,
    dtinizio: state.filtro.dtinizio,
    dtfine: state.filtro.dtfine,
    currentLocation: state.filtro.currentLocation,
  }
}

const mapDispatchToProps = dispatch => ({
  setCurrentLocation: currentLocation => dispatch(setCurrentLocation(currentLocation)),
  showSnack: options => dispatch(showSnack('snackbar',options)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles,{withTheme:true})(Mappa));