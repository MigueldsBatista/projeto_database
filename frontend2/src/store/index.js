import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist'

import rootReducer from './modules/rootReducer';
import persistedReducers from './modules/reduxPersist';

const store = configureStore({
    reducer: persistedReducers(rootReducer),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ 
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredActionPaths: ['register', 'rehydrate'],
                ignoredPaths: ['_persist'],
              },
        }),
});

export const persistor = persistStore(store);
export default store;