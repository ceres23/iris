import update from 'react-addons-update'
import {
  LOGIN,
  ENDPOINT,
  ONBOARDING,
  NOTIFICATION_REQUEST,
} from 'store/login/Actions'

const initialState = {
  login: null,
  endpoint: null,
  onboarding: true,
  notificationRequest: true,
}

function LoginReducers (state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return update(state, {
        login: {$set: action.login}
      })
    case ENDPOINT:
      return update(state, {
        endpoint: {$set: action.endpoint}
      })
    case ONBOARDING:
      return update(state, {
        onboarding: {$set: action.onboarding}
      })
    case NOTIFICATION_REQUEST:
      return update(state, {
        notificationRequest: {$set: action.notificationRequest}
      })
    default:
      return state
  }
}

export default LoginReducers