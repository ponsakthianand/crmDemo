import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import profileReducer from './reducers/profile';
import ticketChat from './reducers/allTicketChat';
import currentTicketChat from './reducers/currentTicketChat';
import currentTicket from './reducers/currentTicket';
import fianacialTrackerData from './reducers/financialTrackers';
import isCartReducer from './reducers/isCartAvaialbe';
import AllOrders from './reducers/allOrders';

export const store = configureStore({
  reducer: {
    authToken: authReducer,
    profileData: profileReducer,
    ticketChatData: ticketChat,
    currentTicketChat: currentTicketChat,
    currentTicket: currentTicket,
    financialTrackers: fianacialTrackerData,
    cartData: isCartReducer,
    allOrders: AllOrders,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
