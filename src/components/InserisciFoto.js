import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 2,
    },
    item: {
        position: 'relative',
        height: 128,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
    },
    img: {
        height: '100%',
        borderRadius: theme.spacing.unit,
    },
    noItems: {
        padding: theme.spacing.unit * 2,
    },
    deleteButton: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
        minHeight: theme.spacing.unit * 4,
        position: 'absolute',
        color: theme.palette.error.main,
        top: -theme.spacing.unit,
        right: -theme.spacing.unit,
        zIndex: 10,
    },
    iconSmall: {
        fontSize: 16,
    }
});

class InserisciFoto extends React.PureComponent {
    render() {
        const { classes } = this.props;
    
        return (
            <Grid container className={classes.root}>
                {!this.props.data.length && <Typography variant="subheading" className={classes.noItems}><em>Nessuna foto aggiunta</em></Typography>}
                {this.props.data.map((image,i) =>
                    <Grid item key={i} className={classes.item}>
                        <img src={image.IMMAGINE}
                            alt={image.NOME}
                            className={classes.img} />
                        <Button variant="fab" mini title="Rimuovi"
                            className={classes.deleteButton}
                            onClick={() => this.props.deleteImage(i)}>
                            <Icon className={classes.iconSmall}>delete</Icon>
                        </Button>
                    </Grid>
                )}
            </Grid>
        )
    }
}

InserisciFoto.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InserisciFoto);