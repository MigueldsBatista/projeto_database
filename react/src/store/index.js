import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist'
import createSagaMiddleware from 'redux-saga';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';
import persistedReducers from './modules/reduxPersist';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: persistedReducers(rootReducer),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false,
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredActionPaths: ['register', 'rehydrate'],
                ignoredPaths: ['_persist'],
              },
        }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export default store;