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
    
    render() {
        const {classes} = this.props;

        return (
        <span style={{display:'inline-block'}}>
            <link rel="stylesheet" href="https://mhspid.comune.venezia.it/minihub/resources/css/spid-sp-access-button.min.css"/>

            <form name="login" action="https://mhspid.comune.venezia.it/minihub/minihb" method="POST">
                {/* iris consumerIndex 9*/}
                <input type="hidden" name="content" value="RFr/Z0oaxNe7yDim/prP2NpcEO+v0CoU2axqdyHEBa1wTEHufYUL/NuVGa/H90I97PDbHhjBGsNv3XQyYAH8m75xRiyM9WEGe0t3Sw+amIocd5CQZrV0WXmxs0scaHUBxkAAeS2djlanxSXohu680/jvQUpWdlpHdKT0Dx03WXjU6dckFPPJkl/Qzr3/e7D4xyv00S1dgFo+EMI="/>

                {/* iris2test consumerIndex 9*/}
                {/*<input type="hidden" name="content" value="RFr/Z0oaxNe7yDim/prP2NpcEO+v0CoU2ax2d1VgZVeW0dJ2NCrKoInlZTX2HvosJieJTOKFOS7512XWCNujAmaFQ8vpuTn91IbWUS8dpqbgAvGAiz4k/JN6n6aScZgj7lfbyBL7ByZvFz5QmknkbXfMivqZL3bNE6wTNo18rGPxcUCP2DR9brKzF1sh0w0iAgvSUxf0+tyVLRFF2qSuIBTPgg+E"/>*/}
                
                {/* locale */}
                {/*<input type="hidden" name="content" value="RFr/Z0oaxNe7yDim/prP2JOc1VAQeA2/W5utYJ99N6Jkrdw37HeX0IFFjt3ylxVT62Lyi/5n6fP5YBuolZJZ/iyRmZPnFpZWrXPpAURazBKiPW+Qk3V4Ai2BVzf3cgKhsNXIDviMrs4ZmnhX/00PjtJmm25P5JFRwgfw91Wx20WNNdPltR7HNAU66OB+"/>*/}
                
                <button type="submit"
                    className={"italia-it-button italia-it-button-size-m button-spid "+classes.button}
                    spid-idp-button="#spid-idp-button-medium-get"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <span className="italia-it-button-icon">
                        <img src="https://mhspid.comune.venezia.it/minihub/resources/images/spid-ico-circle-bb.svg" alt="" />
                    </span>
                    <span className="italia-it-button-text">
                        Entra con SPID
                    </span>
                </button>
            </form>
        </span>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setLogin: login => dispatch(setLogin(login)),
    setEndpoint: endpoint => dispatch(setEndpoint(endpoint)),
});

export default connect(null,mapDispatchToProps)(withStyles(styles,{withTheme:true})(SpidButton))