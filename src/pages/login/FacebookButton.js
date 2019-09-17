import React from 'react'
import FacebookLogin from 'react-facebook-login'

class FacebookButton extends React.PureComponent {
    render() {
        return (
            <FacebookLogin
                appId="367617997061666"
                autoLoad={false}
                scope="public_profile,email"
                fields="name,email"
                size="small"
                textButton="Login con facebook"
                language="it_IT"
                redirectUri="https://172.22.9.154:3000/login"
                callback={this.doFacebookLogin} />
        )
    }
}

export default FacebookButton