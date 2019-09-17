import { createStore, combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import filtroReducers from 'store/filtro/Reducers'
import loginReducers from 'store/login/Reducers'
import routingReducers from 'store/routing/Reducers'
import { snackbarReducer } from 'react-redux-snackbar'

const persistConfig = {
    key: 'root',
    storage,
}

const reducers = combineReducers({
    filtro: filtroReducers,
    login: loginReducers,
    routing: routingReducers,
    snackbar: snackbarReducer,
});

const persistedReducers=persistReducer(persistConfig, reducers);
const store = createStore(persistedReducers);

export default store;