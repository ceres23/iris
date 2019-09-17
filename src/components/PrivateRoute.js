import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'

class PrivateRoute extends React.PureComponent {

  render() {
    if(this.props.login) {
      return (<Route{...this.props}/>)
    }
    else {
      return (<Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />)
    }
  }
}

const mapStateToProps = state => {
  return{
      login: state.login.login
  }
}

export default connect(mapStateToProps)(PrivateRoute)