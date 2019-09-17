import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setTitle } from 'store/routing/Actions'

import DbSegnalazione from 'database/Segnalazione'
import DbUtente from 'database/Utente'

import ListaIter from 'pages/dettaglio/iter/Lista'
import AggiornaIter from 'pages/dettaglio/iter/Aggiorna'
import ListaCommenti from 'pages/dettaglio/commenti/Lista'
import AggiungiCommento from 'pages/dettaglio/commenti/Aggiungi'
import Foto from 'pages/dettaglio/Foto'
import Informazioni from 'pages/dettaglio/Informazioni'
import Footer from 'components/Footer'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
    root: {
        height: '100%',
        overflowY: 'scroll',
        overflowScrolling: 'touch',
        WebkitOverflowScrolling: 'touch',
    },
    content: {
        minHeight: 'calc(100% - '+theme.spacing.unit * 3+'px)',
        maxWidth: theme.breakpoints.values.md,
        margin: '0px auto',
        [theme.breakpoints.up('md')]: {
            paddingLeft: theme.spacing.unit * 2,
            paddingRight: theme.spacing.unit * 2,
        },
    },
    paddedHorizontal: {
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
    },
    grid: {
        display: 'flex',
        alignItems: 'center',
    },
    flex: {
        flex: 1,
    }
});

class Dettaglio extends React.PureComponent {
    
    state = {
        data: [],
        iter: [],
        foto_segnalatore: [],
        foto_operatore: [],
        commenti: [],
        operatoreAbilitato: false,
    }

    Load = () => {
        const scope=this;
        DbSegnalazione.getDettaglio(this.props.match.params.id).then(data => {
            if (data &&
                data.hits &&
                data.hits.hits.length > 0
            ){
                const source = data.hits.hits[0]._source;

                source.PTR_TIPO_STATO === 10 && scope.props.history.replace("/");

                let foto_segnalatore = [];
                let foto_operatore = [];
                source.FOTO.map(foto => {
                    if(foto.INTERNO === 'N') foto_segnalatore.push(foto);
                    if(foto.INTERNO === 'S') foto_operatore.push(foto);
                    return false;
                });
                this.setState({
                    data: source,
                    iter: source.ITER,
                    foto_segnalatore: foto_segnalatore,
                    foto_operatore: foto_operatore,
                    commenti: source.COMMENTI
                });
                this.props.setTitle(this.state.data.OGGETTO);
            }
            else scope.props.history.replace("/404");
        });
        this.props.login && DbUtente.utenteAbilitato(this.props.match.params.id).then(({ abilitato }) =>
            abilitato === "yes" && this.setState({operatoreAbilitato: true})
        );
    }

    componentDidMount() {
        this.Load();
    }

    render() {
        const { classes } = this.props;

        return(<div className={classes.root}>
            <div className={classes.content}>

                {/* INFORMAZIONI */}
                <Informazioni data={this.state.data}
                    history={this.props.history}/>

                {/* ITER */}
                <div className={classes.grid}>
                    <Typography variant="title" paragraph className={classes.paddedHorizontal+' '+classes.flex}>Iter segnalazione</Typography>
                    {this.state.operatoreAbilitato &&
                        <AggiornaIter segnalazione={this.props.match.params.id}
                            stato={this.state.data.PTR_TIPO_STATO}/>
                    }
                </div>
                <ListaIter data={this.state.iter} segnalazione={this.props.match.params.id}/>
                
                {/* FOTO */}
                <Typography variant="title" paragraph className={classes.paddedHorizontal}>Foto inserite</Typography>
                <Foto segnalatore={this.state.foto_segnalatore}
                    operatore={this.state.foto_operatore}/>
                
                {/* COMMENTI */}
                <div className={classes.grid}>
                    <Typography variant="title" gutterBottom className={classes.paddedHorizontal+' '+classes.flex}>Commenti</Typography>
                    {this.props.login &&
                        <AggiungiCommento segnalazione={this.props.match.params.id}
                            history={this.props.history}/>
                    }
                </div>
                <ListaCommenti data={this.state.commenti}
                    segnalazione={this.props.match.params.id}/>
            </div>
            <Footer/>
        </div>)
    }
}

Dettaglio.propTypes = {
    classes: PropTypes.object,
}

const mapStateToProps = state => ({
    login: state.login.login
});

const mapDispatchToProps = dispatch => ({
    setTitle: title => dispatch(setTitle(title))
});

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Dettaglio));