import React from 'react'
import { connect } from 'react-redux'
import { setLogin, setEndpoint } from 'store/login/Actions'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    button: {
        borderRadius: theme.spacing.unit
    }
});

class SpidButton extends React.PureComponent {

    state = {
        openProviders: false,
    }

    toggleProviders = () => {
        this.setState({openProviders:!this.state.openProviders});
    }

    openProvider(provider) {
        this.setState({provider:provider}, () => {
            this.toggleProviders();
            document.login.submit();
        });


        //window.location=process.env.REACT_APP_URL_BACKEND+"callspid?idp="+provider;
        //const popup = window.open(process.env.REACT_APP_URL_BACKEND+"callspid?idp="+provider,'mywindow',false);
        /*const popup = window.open("http://172.22.9.154:3000/login/request",'mywindow',false);
        const scope=this;
        var timer = setInterval(() => {
            try {
                if(popup.location.href==="https://172.22.9.154/login/success"){
                    clearInterval(timer);
                    if(localStorage.data){
                        scope.props.setLogin(localStorage.data);
                        if('PushManager' in window &&
                            'Notification' in window &&
                            Notification.permission === 'granted'){
                            updateNotifications().then(subscription => {
                                DbUtente.salvaEndpoint(JSON.stringify(subscription));
                                scope.props.setEndpoint(subscription);
                            });
                        }
                        localStorage.removeItem("data");
                        var {from} = scope.props.location.state || {from: {pathname: '/'}};
                        scope.props.history.replace(from);
                    }
                    popup.close();
                }
            }
            catch(error) {}
        }, 1000);*/
    }
    
    render() {
        const {classes} = this.props;

        return (
        <span style={{display:'inline-block'}}>
            <link rel="stylesheet" href="https://spid.venezia.it/css/spid-sp-access-button.min.css"/>

            <form name="login" action="https://spid.venezia.it" method="POST">
                {/* iris consumerIndex 9*/}
                <input type="hidden" name="content" value="RFr/Z0oaxNe7yDim/prP2NpcEO+v0CoU2axqdyHEBa1wTEHufYUL/NuVGa/H90I97PDbHhjBGsNv3XQyYAH8m75xRiyM9WEGe0t3Sw+amIocd5CQZrV0WXmxs0scaHUBxkAAeS2djlanxSXohu680/jvQUpWdlpHdKT0Dx03WXjU6dckFPPJkl/Qzr3/e7D4xyv00S1dgFo+EMI="/>

                {/* iris2test consumerIndex 9*/}
                {/*<input type="hidden" name="content" value="RFr/Z0oaxNe7yDim/prP2NpcEO+v0CoU2ax2d1VgZVeW0dJ2NCrKoInlZTX2HvosJieJTOKFOS7512XWCNujAmaFQ8vpuTn91IbWUS8dpqbgAvGAiz4k/JN6n6aScZgj7lfbyBL7ByZvFz5QmknkbXfMivqZL3bNE6wTNo18rGPxcUCP2DR9brKzF1sh0w0iAgvSUxf0+tyVLRFF2qSuIBTPgg+E"/>*/}
                
                {/* locale */}
                {/*<input type="hidden" name="content" value="RFr/Z0oaxNe7yDim/prP2NpcEO+v0HJ3AcxqArflw7YF7XB0mczSQmMxDgdgz9ZYG66WFn1WXc86ZsRSF6bFNgR56T320NVF4E9679AeHRulnINnOzizoTi5VeAz2bnw873WXYTGVzFLWHPWVdSrpqNPLnZhENcwfKmwG4Z1bAQiQKABPJsY"/>*/}
                <input type="hidden" name="idp" value={this.state.provider}/>
            </form>
            
            <span onClick={this.toggleProviders}
                className={"italia-it-button italia-it-button-size-m button-spid "+classes.button}
                spid-idp-button="#spid-idp-button-medium-get"
                aria-haspopup="true"
                aria-expanded="false">
                <span className="italia-it-button-icon">
                    <img src="https://spid.venezia.it/images/spid-ico-circle-bb.svg" alt="" />
                </span>
                <span className="italia-it-button-text">
                    Entra con SPID
                </span>
            </span>
            <div id="spid-idp-button-medium-get" className="spid-idp-button spid-idp-button-tip spid-idp-button-relative"
                style={{
                    width: 280,
                    display: this.state.openProviders ? 'block' : 'none'
                }}>
                <ul id="spid-idp-list-large-root" className="spid-idp-button-menu" aria-labelledby="spid-idp">
                    <li className="spid-idp-button-link">
                        <a data-idp="aruba" onClick={() => this.openProvider("aruba")}><span className="spid-sr-only">Aruba ID</span><img src="https://spid.venezia.it/images/spid-idp-arubaid.png" alt="Aruba ID" /></a>
                    </li>
                    <li className="spid-idp-button-link">
                        <a data-idp="infocert" onClick={() => this.openProvider("infocert")}><span className="spid-sr-only">Infocert ID</span><img src="https://spid.venezia.it/images/spid-idp-infocertid.png" alt="Infocert ID" /></a>
                    </li>
                    <li className="spid-idp-button-link">
                        <a data-idp="namirial" onClick={() => this.openProvider("namirial")}><span className="spid-sr-only">Namirial</span><img src="https://spid.venezia.it/images/spid-idp-namirialid.png" alt="Namirial" /></a>
                    </li>
                    <li className="spid-idp-button-link">
                        <a data-idp="poste" onClick={() => this.openProvider("poste")}><span className="spid-sr-only">Poste ID</span><img src="https://spid.venezia.it/images/spid-idp-posteid.png" alt="Poste ID" /></a>
                    </li>
                    <li className="spid-idp-button-link">
                        <a data-idp="register" onClick={() => this.openProvider("register")}><span className="spid-sr-only">REGISTER.IT</span><img src="https://spid.venezia.it/images/spid-idp-spiditalia.png" alt="REGISTER.IT" /></a>
                    </li>
                    <li className="spid-idp-button-link">
                        <a data-idp="sielte" onClick={() => this.openProvider("sielte")}><span className="spid-sr-only">Sielte ID</span><img src="https://spid.venezia.it/images/spid-idp-sielteid.png"  alt="Sielte ID" /></a>
                    </li>
                    <li className="spid-idp-button-link">
                        <a data-idp="tim" onClick={() => this.openProvider("tim")}><span className="spid-sr-only">Tim ID</span><img src="https://spid.venezia.it/images/spid-idp-timid.png" alt="Tim ID" /></a>
                    </li>
                    <li className="spid-idp-support-link">
                        <a href="http://www.spid.gov.it">Maggiori info</a>
                    </li>
                    <li className="spid-idp-support-link">
                        <a href="http://www.spid.gov.it/#spid-idp">Non hai SPID?</a>
                    </li>
                    <li className="spid-idp-support-link">
                        <a href="https://www.spid.gov.it/serve-aiuto">Serve aiuto?</a>
                    </li>
                </ul>
            </div>
        </span>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setLogin: login => dispatch(setLogin(login)),
    setEndpoint: endpoint => dispatch(setEndpoint(endpoint)),
});

export default connect(null,mapDispatchToProps)(withStyles(styles,{withTheme:true})(SpidButton))