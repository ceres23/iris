import React from 'react'
import PropTypes from 'prop-types'

import DbParametri from 'database/Parametri'

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Card from '@material-ui/core/Card'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
    paper: {
        padding: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 4,
    },
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        fontSize: 18,
        marginRight: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * 3,
    },
});

class Informazioni extends React.PureComponent {
    state = {
        types: [],
    }

    componentDidMount() {
        DbParametri.getTipologie().then(data => {
            this.setState({types: data})
        });
    }

    render() {
        const {classes} = this.props;

        return (
        <Card elevation={3} className={classes.paper}>
            {/* TIPOLOGIA */}
            <div className={classes.container}>
                <Icon className={classes.icon}>pie_chart</Icon>
                <TextField fullWidth
                    required
                    select
                    label="Tipologia"
                    margin="normal"
                    value={this.props.data.type}
                    onChange={this.props.handleChange('type')}>
                    {this.state.types.map(type => (
                        <MenuItem key={type.ID_TIPO} value={type.ID_TIPO}>
                        {type.DESCRIZIONE}
                        </MenuItem>
                    ))}
                </TextField>
            </div>

            {/* OGGETTO */}
            <div className={classes.container}>
                <Icon className={classes.icon}>subject</Icon>
                <TextField fullWidth
                    required
                    label="Oggetto"
                    margin="normal"
                    inputProps={{maxLength: 200}}
                    onChange={this.props.handleChange('subject')}/>
            </div>            
            
            {/* INDICAZIONI UTILI */}
            <TextField fullWidth
                multiline
                rows="3"
                rowsMax="6"
                inputProps={{maxLength: 2000}}
                id="description"
                label="Indicazioni utili"
                margin="normal"
                onChange={this.props.handleChange('description')}/>
        </Card>
        )
    }
}

Informazioni.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Informazioni);