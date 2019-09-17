export const LOGIN = 'LOGIN'
export const ENDPOINT = 'ENDPOINT'
export const ONBOARDING = 'ONBOARDING'
export const NOTIFICATION_REQUEST = 'NOTIFICATION_REQUEST'

export function setLogin(login) {
  return {
    type: LOGIN,
    login: login
  }
}

export function doLogout() {
  return {
    type: LOGIN,
    login: null
  }
}

export function setEndpoint(endpoint) {
  return {
    type: ENDPOINT,
    endpoint: endpoint
  }
}

export function disableEndpoint() {
  return {
    type: ENDPOINT,
    endpoint: null
  }
}

export function setOnboarding(onboarding) {
  return {
    type: ONBOARDING,
    onboarding: onboarding
  }
}

export function setNotificationRequest(notificationRequest) {
  return {
    type: NOTIFICATION_REQUEST,
    notificationRequest: notificationRequest
  }
}