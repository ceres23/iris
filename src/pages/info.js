import React from 'react'
import PropTypes from 'prop-types'
import DbParametri from 'database/Parametri'
import moment from 'moment'
//eslint-disable-next-line
import itLocale from 'moment/locale/it'

import NotificationRequest from 'components/NotificationRequest'
import Footer from 'components/Footer'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
    root: {
        height: '100%',
        overflowY: 'auto',
        overflowScrolling: 'touch',
        WebkitOverflowScrolling: 'touch',
    },
    content: {
        minHeight: 'calc(100% - '+theme.spacing.unit * 3+'px)',
        paddingLeft: theme.spacing.unit * 3,
        paddingRight: theme.spacing.unit * 3,
        paddingTop: theme.spacing.unit * 2,
    },
    paper: {
        borderRadius: theme.spacing.unit,
        padding: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    flex: {
        flexGrow: 1,
    },
    leftIcon: {
        paddingRight: theme.spacing.unit,
    },
    divider: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    },
    description: {
        marginTop: theme.spacing.unit / 2,
        marginLeft: theme.spacing.unit,
    }
});

class Info extends React.PureComponent {

    state = {
        statistiche: [],
        ripartizione: [],
        showNotificationDialog: false,
    }

    getOpenData = () => document.location.href=process.env.REACT_APP_URL_BACKEND+'getopendata';

    requestNotifications = () => this.notifications.getWrappedInstance().requestNotifications();

    componentDidMount() {
        DbParametri.getStatistiche().then(data => this.setState({statistiche: data}));
        DbParametri.getRipartizione().then(data => this.setState({ripartizione: data}));

        if('PushManager' in window &&
            'Notification' in window &&
            (
                (
                    Notification.permission !== 'granted' &&
                    Notification.permission !== 'denied'
                ) ||
                Notification.permission === "default"
            )) {
            this.setState({showNotificationDialog:true});
        }
    }

    render() {
        const { classes } = this.props;
        
        return(<div className={classes.root}>
            <div className={classes.content}>
                {this.state.showNotificationDialog &&
                    <Card elevation={3} className={classes.paper}>
                        <Icon color="secondary" className={classes.leftIcon}>notifications</Icon>
                        <Typography variant="subheading" className={classes.flex}>
                            Attiva le notifiche per ricevere aggiornamenti sulle tue segnalazioni
                        </Typography>
                        <Button variant="outlined" color="secondary" onClick={this.requestNotifications}>
                            Richiedi accesso
                        </Button>

                        <NotificationRequest ref={(notifications) => {this.notifications=notifications}}/>
                    </Card>
                }

                {/* DESCRIZIONE */}
                <Typography variant="headline" color="inherit" align="center" paragraph><b>Che cos’è IRIS?</b></Typography>
                <Typography variant="title" align="justify" paragraph>
                    IRIS è un sistema promosso dal Comune di Venezia per consentire a tutti i cittadini di segnalare problemi di manutenzione urbana nel territorio e contribuire così alla loro soluzione.
                    Le segnalazioni rimangono visibili a tutti e possono essere commentate.
                </Typography>
                <Typography variant="title" align="justify" paragraph>
                    Si informa che, per motivi tecnici, tutti i ticket aperti prima del 31 dicembre 2018 sono stati chiusi. Se si ravvisa la necessità di comunicare una problematica di manutenzione urbana ancora in essere, la segnalazione potrà essere reinserita nuovamente nel sistema.
                </Typography>
                <Typography variant="title" align="justify" paragraph>
                    <b>ATTENZIONE:</b> ti ricordiamo che Iris è un sistema per comunicare problemi di manutenzione urbana e non le emergenze che necessitino di un pronto intervento.<br/>
                    In casi simili è invece indispensabile contattare gli enti competenti: Vigili del fuoco, Carabinieri, etc.<br/>
                    Se necessiti quindi di un intervento tempestivo, ti consigliamo di non proseguire con questa segnalazione ma di rivolgerti ai servizi preposti.
                </Typography>

                <Divider className={classes.divider}/>

                {/* STATISTICHE */}
                <Typography variant="headline" color="inherit" align="center" gutterBottom><b>Statistiche</b></Typography>
                <Typography variant="subheading" align="center" paragraph>
                    <b>Ultimo aggiornamento:</b> {moment().format('D MMMM YYYY [alle] HH:mm')}
                </Typography>
                <Grid container spacing={40} className={classes.divider}>
                    {this.state.statistiche.map(stat =>
                        <Grid key={stat.TIPO} item xs={6} md>
                            <Typography variant="display2" color="secondary" align="center">{stat.QUANTI}</Typography>
                            <Typography variant="subheading" align="center"><em>{stat.DESCR}</em></Typography>
                        </Grid>
                    )}
                </Grid>
                <Grid container spacing={8}>
                    <Grid item xs={2}>
                        <Button variant="raised"
                            color="secondary"
                            onClick={this.getOpenData}>
                            Scarica dati
                        </Button>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">
                            <b>Istruzioni per visualizzare i dati in Microsoft Excel: aprire un nuovo file, dalla sezione dati: importa->da testo, scegliere "Delimitato" e "Punto e virgola" come delimitatore.</b>
                        </Typography>
                    </Grid>
                </Grid>

                <Divider light className={classes.divider}/>

                {/* TIPOLOGIE */}
                <Typography variant="display1" color="inherit" paragraph><em>Tipologie</em></Typography>
                <Grid container>
                    {this.state.ripartizione.map((stat,i) => <Grid key={i} item container>
                        <Grid item xs={2} md={1}>
                            <Typography variant="headline" color="secondary" align="right"><b>{stat.QUANTI}</b></Typography>
                            <Typography variant="body2" color="textSecondary" align="right" gutterBottom className={classes.description}>{stat.PERCENTUALE}%</Typography>
                        </Grid>
                        <Grid item xs={10} md={11}>
                            <Typography variant="title" noWrap className={classes.description}><em>{stat.DESCRIZIONE}</em></Typography>
                        </Grid>
                    </Grid>)}
                </Grid>
                <div className={classes.divider}/>
            </div>
            <Footer/>
        </div>)
    }
}

Info.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Info)