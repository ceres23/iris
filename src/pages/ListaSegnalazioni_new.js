import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { setQuery } from 'store/filtro/Actions'
import { isMobile } from 'react-device-detect'
import { Link } from 'react-router-dom'
import 'react-leaflet-markercluster/dist/styles.min.css'
import { InfiniteLoader, WindowScroller, List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'

import DbSegnalazione from 'database/Segnalazione'
import DbParametri from 'database/Parametri'

import ItemSegnalazione from 'pages/listaSegnalazioni/ItemSegnalazione'
import Filtro from 'pages/listaSegnalazioni/Filtro'
import Loader from 'pages/listaSegnalazioni/Loader'

import { withStyles } from '@material-ui/core/styles'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import Paper from '@material-ui/core/Paper'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import InputAdornment from '@material-ui/core/InputAdornment'

const styles = theme => ({
  root: {
    width: '100%',
    height: 56,
    backgroundColor: '#ffffff',
    position: 'absolute',
    webkitUserSelect: 'none',
    mozkitUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    bottom: 0,
    zIndex: 1200,
    [theme.breakpoints.up('md')]: {
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      flexBasis: 480,
      top: 0,
      right: 0,
      bottom: 'auto',
      left: 'auto',
    }
  },
  scrollable: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch',
  },
  dialogTitle: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: theme.spacing.unit * 2,
  },
  grid: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  flex: {
    flexGrow: 1,
  },
  numSegnalazioni: {
    flexGrow: 1,
    alignSelf: 'flex-end'
  },
  paddedHorizontal: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
  input: {
    flexGrow: 1,
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing.unit * 2
    }
  },
  filter: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

const cache = new CellMeasurerCache({
  defaultHeight: 100,
  fixedWidth: true
});

const loading=[];
  
class ListaSegnalazioni extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  
  state = {
    reports: [],
    states: [],
    isLoading: false,
    total: 0,
    openDialog: false,
    openFilterDialog: false,
    onlyMine: false,
    searchValue: '',
    map: {
      lat: 45.436818,
      lng: 12.329605,
      zoom: 10,
    },
  }

  search(q) {
    this.props.setQuery(q);
  }

  refresh = () => {
    this.setState({reports: []}, () => {
      cache.clearAll();
      this.loadMore(0,50);
    });
  }

  loadMore = ({ startIndex, stopIndex }) => {
    console.log("loadMore");
    for(var i=startIndex;i<=stopIndex;i++) loading[i]=true;

    this.setState({isLoading: true});
    DbSegnalazione.search(
      this.props.q,
      this.props.filter,
      this.props.dtinizio,
      this.props.dtfine,
      startIndex,
      stopIndex,
      this.state.onlyMine
    ).then(data => {
      if (data && data.hits){
        this.setState({
          reports: this.state.reports.concat(data.hits.hits),
          total: data.hits.total,
        });

        setTimeout(() => this.setState({isLoading: false}), 500);
        for(var i=startIndex;i<=stopIndex;i++) loading[i]=false;
      }
    });
  }

  isRowLoaded = ({ index }) => {
    return !!this.state.reports[index];
  }

  rowRenderer = ({ index, isScrolling, key, parent, style }) => {
    let item=this.state.reports[index];
    let itemColor=this.getColor(item._source.PTR_TIPO_STATO);

    /*if(loading[index]){
      return (
        <div key={key} style={style}>
          <Typography variant="subheading">Caricamento...</Typography>
        </div>
      )
    } else */
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}>
        {({ measure }) => (
          <div key={key} style={style}>
            <ItemSegnalazione key={item._source.ID_SEGNALAZIONE}
              data={item._source}
              history={this.props.history}
              stateColor={itemColor}/>
          </div>
        )}
      </CellMeasurer>
    )
  }

  handleSearchChange = event => {
    const value = event.target.value;
    this.state.typingTimeout && clearTimeout(this.state.typingTimeout);

    this.setState({
       searchValue: value,
       typingTimeout: setTimeout(() => this.search(value), 500)
    });
  }
  handleChange = name => event => this.setState({[name]: event.target.value});
  handleCheck = event => this.setState({onlyMine: event.target.checked},() => this.refresh());

  openDialog = () => {
    !this.state.openDialog && this.props.history.push("/#lista");
    this.setState({openDialog: true});
  }
  closeDialog = () => this.props.history.goBack();

  openFilterDialog = e => {
    e.stopPropagation();
    !this.state.openFilterDialog && this.props.history.push("/#filtro");
    this.setState({openFilterDialog: true});
  }
  closeFilterDialog = () => this.props.history.goBack();
  toggleFilterDialog = () => this.setState({openFilterDialog: !this.state.openFilterDialog});

  getColor = id => {
    let state=this.state.states.find(state => state.ID_TIPO === id);
    if(state) return state.COLORE;
    return null;
  }

  componentDidMount() {
    DbParametri.getStati().then(result => {
      this.setState({states:result});
      this.loadMore(0,50);
    });
    this.setState({searchValue: this.props.q});

    window.onpopstate = () => {
      isMobile && this.state.openFilterDialog
        ? this.setState({openFilterDialog: false})
        : this.state.openDialog
            ? this.setState({openDialog: false})
            :this.props.history.location.hash==="#lista" && this.setState({openDialog: true});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.filter!==this.props.filter ||
      prevProps.q!==this.props.q ||
      prevProps.dtinizio!==this.props.dtinizio ||
      prevProps.dtfine!==this.props.dtfine)
      this.refresh();
  }

  render() {
    const { classes, theme } = this.props;

    const searchInput = (
      <div className={classes.grid}>
        <Input classes={{
            root: classes.input
          }}
          placeholder="Cerca una segnalazione"
          value={this.state.searchValue}
          onChange={this.handleSearchChange}
          startAdornment={<InputAdornment position="start">
            <Icon className={classes.leftIcon}>search</Icon>
          </InputAdornment>}/>
        <IconButton
          color={this.state.openFilterDialog ? "secondary" : "inherit"}
          title={this.state.openFilterDialog ? "Chiudi" : "Filtra"}
          onClick={isMobile ? this.openFilterDialog : this.toggleFilterDialog}>
          <Icon>filter_list</Icon>
        </IconButton>
      </div>
    )

    const searchInputMobile = (
      <Toolbar elevation={0}>
        <IconButton color="inherit" onClick={this.closeDialog}>
          <Icon>keyboard_arrow_down</Icon>
        </IconButton>
        {searchInput}
      </Toolbar>
    )

    const toggleMine = (
      <div className={classes.grid}>
        {isMobile && this.state.onlyMine &&
          <IconButton color="inherit" onClick={this.closeDialog}>
            <Icon>keyboard_arrow_down</Icon>
          </IconButton>
        }
        <FormControlLabel label="Soltanto le mie"
          className={classes.flex+' '+classes.paddedHorizontal}
          control={<Switch checked={this.state.onlyMine} onChange={this.handleCheck}/>}/>
        <Typography variant="body2"
          color="secondary"
          align="center"
          className={classes.paddedHorizontal}><b>
          {this.state.total>0
            ? this.state.total+" risultati"
            : "Nessun risultato"
          }
        </b></Typography>
      </div>
    )

    const list = (
      <div className={classes.scrollable}>
        {(!this.state.isLoading && this.state.total===0) && <div style={{textAlign: 'center', marginTop: theme.spacing.unit * 2}}>
          <Typography variant="subheading" color="textSecondary" align="center" paragraph><em>Nessun risultato trovato</em></Typography>
          <Button variant="outlined" color="secondary" component={Link} to="/segnala">
            Nuova segnalazione
          </Button>
        </div>}
        <InfiniteLoader isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMore}
          rowCount={this.state.total}
          minimumBatchSize={50}
          threshold={50}>{({ onRowsRendered, registerChild }) => (
          <WindowScroller>{({ height, isScrolling, scrollTop }) => (
            <AutoSizer disableHeight>{({ width }) => (
              <List ref={registerChild}
                autoHeight
                width={width}
                height={height}
                rowCount={this.state.reports.length}
                rowHeight={cache.rowHeight}
                onRowsRendered={onRowsRendered}
                rowRenderer={this.rowRenderer}
                isScrolling={isScrolling}
                scrollTop={scrollTop}/>
            )}</AutoSizer>
          )}</WindowScroller>
        )}</InfiniteLoader>
        {this.state.isLoading && <Loader/>}
      </div>
    )

    const list_test = (<div className={classes.scrollable}>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      test<br/>
      </div>)

    return(
      <div className={classes.root}>
        {/* MOBILE */}
        <Hidden mdUp>
          <SwipeableBottomSheet fullScreen
            open={this.state.openDialog}
            overflowHeight={56}
            marginTop={theme.mixins.toolbar.minHeight}
            onChange={!this.state.openDialog ? this.openDialog : this.closeDialog}
            shadowTip={false}
            overlay={false}
            bodyStyle={{
              /*display: 'flex',
              flexDirection: 'column',*/
              borderTopLeftRadius: theme.spacing.unit,
              borderTopRightRadius: theme.spacing.unit
            }}
            style={{
              position: 'absolute',
              zIndex: 1200
            }}>
            {!this.state.openDialog
              ? <Toolbar>
                <IconButton color="inherit" onClick={this.openDialog}>
                  <Icon>keyboard_arrow_up</Icon>
                </IconButton>
                <Typography variant="body2" align="center" className={classes.numSegnalazioni}><b>
                  {this.state.reports.length>0
                    ? this.state.total+" segnalazioni"
                    : "Nessuna segnalazione"
                  }
                </b></Typography>
                  <IconButton
                    color={this.state.openFilterDialog ? "secondary" : "inherit"}
                    title={this.state.openFilterDialog ? "Chiudi" : "Filtra"}
                    onClick={isMobile ? this.openFilterDialog : this.toggleFilterDialog}>
                    <Icon>filter_list</Icon>
                  </IconButton>
              </Toolbar>
              : <Collapse in={!this.state.onlyMine}>
                {searchInputMobile}
              </Collapse>
            }
            {toggleMine}
            {list}
          </SwipeableBottomSheet>

          <Dialog fullWidth open={this.state.openFilterDialog} onClose={this.closeFilterDialog}>
            <span className={classes.dialogTitle}>
              <DialogTitle className={classes.flex}>Filtra i risultati</DialogTitle>
              <IconButton onClick={this.closeFilterDialog}>
                <Icon>close</Icon>
              </IconButton>
            </span>
            <DialogContent>
              <Filtro closeFilterDialog={this.closeFilterDialog}/>
            </DialogContent>
          </Dialog>
        </Hidden>

        {/* DESKTOP */}
        <Hidden smDown>
          <Paper elevation={1}>
            <Collapse in={!this.state.onlyMine}>
              {searchInput}
              <Collapse in={this.state.openFilterDialog} className={classes.filter}>
                <Typography variant="title">Filtra i risultati</Typography>
                <Filtro closeFilterDialog={this.closeFilterDialog}/>
              </Collapse>
            </Collapse>
            {toggleMine}
          </Paper>
          {list}
        </Hidden>

      </div>
    )
  }
}

ListaSegnalazioni.propTypes = {
  classes: PropTypes.object,
  theme: PropTypes.object,
}

const mapStateToProps = state => {
  return{
    q: state.filtro.q,
    filter: state.filtro.filter,
    dtinizio: state.filtro.dtinizio,
    dtfine: state.filtro.dtfine,
  }
}

const mapDispatchToProps = dispatch => ({
  setQuery: q => dispatch(setQuery(q)),
});

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(withStyles(styles,{withTheme:true})(ListaSegnalazioni)))