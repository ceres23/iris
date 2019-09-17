import React from 'react'
import PropTypes from 'prop-types'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'

import { withStyles } from '@material-ui/core/styles'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import Divider from '@material-ui/core/Divider'
import { IconButton, Icon } from '@material-ui/core';

const styles = theme => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: theme.spacing.unit * 4,
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing.unit * 2,
        }
    },
    gallery: {
        width: '100%',
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    },
    title: {
        marginTop: theme.spacing.unit * 2,
    },
    divider: {
        width: '100%'
    },
    noItems: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class Pictures extends React.PureComponent {

    render() {
        const { classes } = this.props;
        const foto_segnalatore=this.props.segnalatore.map(pic => {
            var p={
                original:'https://iris.comune.venezia.it/foto/'+pic.PICTUREREALURL,
                thumbnail: 'https://iris.comune.venezia.it/foto/'+pic.PICTUREURL,
                sizes: '100%'
            }
            return p;
        });
        const foto_operatore=this.props.operatore.map(pic => {
            var p={
                original:'https://iris.comune.venezia.it/foto/'+pic.PICTUREREALURL,
                thumbnail: 'https://iris.comune.venezia.it/foto/'+pic.PICTUREURL,
                sizes: '100%'
            }
            return p;
        });

        const settings_desktop={
            infinite: false,
            thumbnailPosition: 'top',
            showPlayButton: false,
            showIndex: true,
            showNav: false,
        };

        const settings_mobile={
            showThumbnails: false,
            showPlayButton: false,
            showIndex: true,
            showNav: true,
        };

        return(
        <Card elevation={3} className={classes.paper}>
            <Typography variant="title" className={classes.title}>Dall'utente</Typography>
            {!this.props.segnalatore.length
                ? <Typography variant="subheading"
                    color="textSecondary"
                    align="center"
                    className={classes.noItems}>
                    <em>Nessuna foto inserita</em>
                </Typography>
                : <div className={classes.gallery}>
                    <Hidden smDown>
                        <ImageGallery {...settings_desktop}
                            items={foto_segnalatore}
                            renderItem={this.renderImage}
                            renderThumbInner={this.renderThumbInner}
                            renderFullscreenButton={this.renderFullscreenButton}/>
                    </Hidden>
                    <Hidden mdUp>
                        <ImageGallery {...settings_mobile}
                            items={foto_segnalatore}
                            renderItem={this.renderImage}
                            renderFullscreenButton={this.renderFullscreenButton}/>
                    </Hidden>
                </div>
            }
            <Divider className={classes.divider}/>
            <Typography variant="title" className={classes.title}>Dall'operatore</Typography>
            {!this.props.operatore.length
                ? <Typography variant="subheading"
                    color="textSecondary"
                    align="center"
                    className={classes.noItems}>
                    <em>Nessuna foto inserita</em>
                </Typography>
                : <div className={classes.gallery}>
                    <Hidden smDown>
                        <ImageGallery {...settings_desktop}
                            items={foto_operatore}
                            renderItem={this.renderImage}
                            renderThumbInner={this.renderThumbInner}
                            renderFullscreenButton={this.renderFullscreenButton}/>
                    </Hidden>
                    <Hidden mdUp>
                        <ImageGallery {...settings_mobile}
                            items={foto_operatore}
                            renderItem={this.renderImage}
                            renderFullscreenButton={this.renderFullscreenButton}/>
                    </Hidden>
                </div>
            }
        </Card>
        )
    }

    renderImage(item) {
        return (
            <img src={item.original}
                alt=""
                style={{
                    height: 600,
                    maxWidth: '100%',
                    objectFit: 'scale-down'
                }}/>
        );
    }

    renderThumbInner(item) {
        return (
            <img src={item.thumbnail}
                alt=""
                style={{height: 80,
                    objectFit: 'contain'
                }}/>
        );
    }

    renderFullscreenButton(onClick,isFullscreen) {
        return (
            <IconButton onClick={onClick} style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                zIndex: 10,
                color: isFullscreen ? "white" : "inherit"
            }}>
                <Icon style={{fontSize: 32}}>
                    {isFullscreen ? "fullscreen_exit" : "fullscreen"}
                </Icon>
            </IconButton>
        );
    }
}

Pictures.propTypes = {
    classes: PropTypes.object,
}

export default withStyles(styles)(Pictures)