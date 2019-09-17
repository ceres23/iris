import React from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import DatabaseMappa from 'database/Mappa'

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Card from '@material-ui/core/Card'

const styles = theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing.unit,
      marginLeft: theme.spacing.unit,
    }
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    height: 46,
    lineHeight: '46px',
    borderRadius: 0,
    justifyContent: 'flex-start',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.up('md')]: {
      borderRadius: 21,
    }
  },
  input: {
    paddingLeft: theme.spacing.unit * 2
  },
  height: {
    height: '100%'
  },
  searchResults: {
    width: '100%',
    backgroundColor: '#ffffff',
    zIndex: 1200,
  }
});

class CercaIndirizzo extends React.PureComponent {

  state = {
    value: '',
    addresses: [],
  }

  componentDidMount(){
    this.setState({value: this.props.indirizzo})
  }

  componentWillReceiveProps(nextProps){
    this.setState({value: nextProps.indirizzo})
  }

  render() {
    const { classes } = this.props
    return (
      <Downshift
        onInputValueChange={ value => {
          this.setState({
            value: value
          })
          DatabaseMappa.cercaIndirizzo(value).then(data => {
            if (data && data.features) {
              let addresses = data.features.slice(0, 8).map(item => {
                let res = item.attributes;
                res.label = item.attributes.DENOMINAZIONE_X_VIA;
                res.location = {
                  lat: item.geometry.paths[0][0][1],
                  lng: item.geometry.paths[0][0][0]
                };
                return res
              })
              this.setState({
                addresses: addresses
              })
            }
            else{
              this.setState({
                addresses: []
              })
            }
          })
        }}
        onSelect={selectedItem => {
          const address = this.state.addresses.find(address => address.DENOMINAZIONE_X_VIA === selectedItem);
          this.props.selectLocation(address.location);
        }}
      >
        {({ getInputProps, getItemProps, isOpen, selectedItem, highlightedIndex }) => (
          <div className={classes.container}>
            {this.renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                placeholder: 'Cerca un indirizzo',
                id: 'integration-downshift',
                value: this.state.value,
                disableUnderline: true,
              }),
            })}
            {isOpen ? (
              <Card elevation={3} square className={classes.searchResults}>
                {
                  this.state.addresses.map((addresses, index) =>
                    this.renderAddresses({
                      addresses,
                      index,
                      itemProps: getItemProps({ item: addresses.label }),
                      highlightedIndex,
                      selectedItem,
                    }),
                  )
                }
              </Card>
            ) : null}
          </div>
        )}
      </Downshift>
    )
  }
  
  renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps
    return (
      <Card className={classes.inputContainer}>
      <TextField
        {...other}
        autoFocus={false}
        inputRef={ref}
        style={{height:'100%'}}
        InputProps={{
          classes: {
            root: classes.height,
            input: classes.input,
          },
          endAdornment: (<InputAdornment position="end">
            <IconButton title="Localizza" onClick={this.props.relocate}>
              <Icon>my_location</Icon>
            </IconButton>
          </InputAdornment>),
          ...InputProps,
        }}
      />
      </Card>
    )
  }

  renderAddresses(params) {
    const { addresses, index, itemProps, highlightedIndex, selectedItem } = params
    const isHighlighted = highlightedIndex === index
    const isSelected = selectedItem === addresses.label
  
    return (
      <MenuItem
        {...itemProps}
        key={addresses.label}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
          zIndex: 4000,
        }}
      >
        {addresses.label}
      </MenuItem>
    )
  }

}

CercaIndirizzo.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CercaIndirizzo)
