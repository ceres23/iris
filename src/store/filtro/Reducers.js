import update from 'react-addons-update'
import {
  QUERY,
  FILTER,
  DATA,
  DATA_RANGE,
  CURRENT_LOCATION,
} from 'store/filtro/Actions'

const initialState = {
  q: '',
  filter: '',
  data: '',
  dtinizio: null,
  dtfine: null,
  currentLocation: null,
}

function FiltroReducers (state = initialState, action) {
  switch (action.type) {
    case QUERY:
      return update(state, {
        q: {$set: action.q}
      })
    case FILTER:
      return update(state, {
        filter: {$set: action.filter}
      })
    case DATA:
      return update(state, {
        data: {$set: action.data},
      })
    case DATA_RANGE:
      if(action.data === '')
        return update(state, {
          dtinizio: {$set: null},
          dtfine: {$set: null},
        })
      return update(state, {
        dtinizio: {$set: action.dataRange.dtinizio},
        dtfine: {$set: action.dataRange.dtfine},
      })
    case CURRENT_LOCATION:
      return update(state, {
        currentLocation: {$set: action.currentLocation},
      })
    default:
      return state
  }
}

export default FiltroReducers