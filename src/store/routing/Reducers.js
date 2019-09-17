import update from 'react-addons-update'
import {
  TITLE
} from 'store/routing/Actions'

const initialState = {
  title: process.env.REACT_APP_NOME,
}

function RoutingReducers (state = initialState, action) {
  switch (action.type) {
    case TITLE:
      if(action.title === "")
        document.title = process.env.REACT_APP_NOME;
      else
        document.title = process.env.REACT_APP_NOME+' - '+action.title;
      return update(state, {
        title: {$set: action.title}
      })
    default:
      return state
  }
}

export default RoutingReducers