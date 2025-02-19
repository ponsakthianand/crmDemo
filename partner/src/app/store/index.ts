import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import profileReducer from './reducers/profile';
import allCustomers from './reducers/allCutomers';
import customerSpecific from './reducers/customerInfo';
import StatisticsOverall from './reducers/allStatisticsData';
import ActivityReducer from './reducers/allActivity';
import AllOrdersData from './reducers/allOrders';
import AllClicksData from './reducers/allClicks';
import AllLeadsData from './reducers/allLeads';

export const store = configureStore({
  reducer: {
    authToken: authReducer,
    profileData: profileReducer,
    allCustomersData: allCustomers,
    currentCustomer: customerSpecific,
    overallStatistics: StatisticsOverall,
    activity: ActivityReducer,
    allOrders: AllOrdersData,
    allClicks: AllClicksData,
    allLeads: AllLeadsData,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
