import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import profileReducer from './reducers/profile';
import ticketChat from './reducers/allTicketChat';
import currentTicketChat from './reducers/currentTicketChat';
import currentTicket from './reducers/currentTicket';
import allCustomers from './reducers/allCutomers';
import customerSpecific from './reducers/customerInfo';
import partnersReducer from './reducers/allPartners';
import allEventsReducer from './reducers/allEvents';
import allCoursesReducer from './reducers/allCourses';
import customerSpecificFinancialTracker from './reducers/ftSpecificCustomer';
import MutualFundsSpecific from './reducers/mfSpecificCustomer';
import NotesSpecific from './reducers/notesSpecificCustomer';
import TodosSpecific from './reducers/todosSpecificCustomer';
import TicketsSpecific from './reducers/ticketsSpecificCustomer';
import UsersList from './reducers/usersList';
import PartnersList from './reducers/partnersList';
import CustomersList from './reducers/customersList';
import AllTasks from './reducers/allTasks';
import AllLeads from './reducers/allLeadsData';
import StatisticsOverall from './reducers/allStatisticsData';
import partnerSpecific from './reducers/partnerInfo';
import partnerCustomersSpecific from './reducers/partnerSpecificallCutomers';
import AllUsersList from './reducers/allUsers';
import AdminLogs from './reducers/adminLogs';
import PartnersLogs from './reducers/partnersLogs';
import CustomersLogs from './reducers/customersLogs';
import AllOrdersData from './reducers/allOrders';
import allWebSessions from './reducers/allwebSessions';
import allMutualFunds from './reducers/allMutualFunds';
import FundManagement from './reducers/fundManagement';

export const store = configureStore({
  reducer: {
    authToken: authReducer,
    partnersList: partnersReducer,
    profileData: profileReducer,
    ticketChatData: ticketChat,
    currentTicketChat: currentTicketChat,
    currentTicket: currentTicket,
    allCustomersData: allCustomers,
    currentCustomer: customerSpecific,
    events: allEventsReducer,
    courses: allCoursesReducer,
    customerSpecificData: customerSpecific,
    financialTracker: customerSpecificFinancialTracker,
    mutualFundsSpecificCustomer: MutualFundsSpecific,
    notesCustomerSpecific: NotesSpecific,
    todosCustomerSpecific: TodosSpecific,
    ticketsCustomerSpecific: TicketsSpecific,
    usersList: UsersList,
    partnersDropdownsList: PartnersList,
    customersList: CustomersList,
    allTasks: AllTasks,
    allLeadsData: AllLeads,
    overallStatistics: StatisticsOverall,
    partnerSpecificData: partnerSpecific,
    partnerSpecificCustomersData: partnerCustomersSpecific,
    allUsers: AllUsersList,
    adminLogs: AdminLogs,
    partnersLogs: PartnersLogs,
    customersLogs: CustomersLogs,
    allOrders: AllOrdersData,
    allWebsessions: allWebSessions,
    mutualFunds: allMutualFunds,
    fundManagement: FundManagement,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
