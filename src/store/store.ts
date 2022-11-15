import {combineReducers, configureStore} from '@reduxjs/toolkit';

import authSlice from './slices/auth.slice';
import bookingSlice from './slices/booking.slice';
import {roomReducer} from "./slices";

const rootReducer = combineReducers({
    auth: authSlice,
    booking: bookingSlice,
    rooms: roomReducer,
});

const setupStore = () => configureStore({
    reducer: rootReducer
});

type RootState = ReturnType<typeof rootReducer>;
type AppStore = ReturnType<typeof setupStore>;
type AppDispatch = AppStore['dispatch'];

export type{
    RootState,
    AppStore,
    AppDispatch
};

export {
    setupStore
};