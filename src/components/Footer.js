import React from 'react'
import PropTypes from 'prop-types'

import Head from 'images/header.png'

import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core';

const styles = theme => ({
    root: {
        backgroundColor: process.env.REACT_APP_COLORE_FOOTER,
        paddingTop: theme.spacing.unit * 6,
        paddingBottom: theme.spacing.unit * 6,
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        textAlign: 'center',
        color: '#b0bec5'
    },
    image: {
        maxWidth: '100%',
        marginBottom: theme.spacing.unit * 4
    },
    link: {
        color: '#90a4ae',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        fontSize: 18,
        '&:hover': {color: '#b0bec5'},
    }
});

class Footer extends React.PureComponent {

    render() {
        const { classes } = this.props;

        return(
            <div className={classes.root}>
                <img src={Head} alt="Città di venezia" className={classes.image}/>
                <Typography variant="subheading" color="inherit" paragraph>
                    VE 1.1.1.I - IRIS 2 "PROGETTO COFINANZIATO DALL'UNIONE EUROPEA - FONDI STRUTTURALI E DI INVESTIMENTO EUROPEI | PROGRAMMA OPERATIVO CITTÀ METROPOLITANE 2014-2020"
                </Typography>
                <a href="http://www.comune.venezia.it/content/note-legali" target="_blank" rel="noopener noreferrer"
                    className={classes.link}>
                    Note legali
                </a>
                <a href="http://www.comune.venezia.it/content/cookie-policy" target="_blank" rel="noopener noreferrer"
                    className={classes.link}>
                    Cookie policy
                </a>
                <a href="http://www.comune.venezia.it/content/privacy-policy" target="_blank" rel="noopener noreferrer"
                    className={classes.link}>
                    Privacy
                </a>
            </div>
        )
    }
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Footer)