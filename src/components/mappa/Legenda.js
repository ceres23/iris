import React from 'react'
import PropTypes from 'prop-types'
import {isMobile} from 'react-device-detect'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'

const styles = theme => ({
    grid: {
        display: 'flex',
        alignItems: 'center',
    },
    dot: {
        width: 16,
        height: 16,
        border: '4px solid',
        borderRadius: 16,
        margin: theme.spacing.unit,
    }
});

class Legenda extends React.PureComponent {

    getColor = id => {
        var color=this.props.states.find(state => state.ID_TIPO === id);
        if(color) return color.COLORE;
        return 'black';
    }

    render() {
        const { classes } = this.props;
    
        return (
        <Dialog fullWidth open={this.props.open} onClose={this.props.closeDialog}>
            <DialogTitle>Istruzioni</DialogTitle>
            <DialogContent>
                <Typography variant="subheading" gutterBottom><b>Per selezionare un punto sulla mappa</b></Typography>
                <Typography variant="subheading" paragraph>
                    Trascina il cursore oppure
                    {isMobile ? ' fai click su un punto della mappa.'
                    : ' fai doppio click su un punto della mappa.'
                    }
                </Typography>
                <Typography variant="subheading" gutterBottom><b>Legenda degli stati</b></Typography>
                {this.props.states.map(state => {
                    return(<div key={state.ID_TIPO} className={classes.grid}>
                    <div className={classes.dot} style={{borderColor:this.getColor(state.ID_TIPO)}}/>
                    <Typography variant="subheading">{state.DESCRIZIONE}</Typography>
                    </div>)
                })}
            </DialogContent>
            <DialogActions>
                <Button onClick={this.props.closeDialog} color="secondary" autoFocus>
                    Chiudi
                </Button>
            </DialogActions>
        </Dialog>
        )
    }
}

Legenda.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Legenda)