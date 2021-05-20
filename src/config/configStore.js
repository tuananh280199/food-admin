// import node_modules
import { persistStore, persistReducer } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

// import others
import rootReducer from '../reducers';

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [ 'auth' ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [ thunk ],
});

export const persistor = persistStore(store);
