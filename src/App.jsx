// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Layout from './components/Layout/Layout';
// import ReservationPage from './pages/reservation/ReservationPage'
// import Home from './pages/general/Home';
// import Contact from './pages/general/Contact';
// import Menu from './pages/Menu';
// import About from './pages/general/About';
// import Signin from './pages/auth/Signin';
// import Signup from './pages/auth/Signup';
// import Profile from './pages/Profile';
// import Additem from './pages/admin/Additem';
// import TermsAndConditions from './pages/general/TermsAndConditions';
// import PageNotFound from './pages/PageNotFound';
// import Chefs from './pages/Chefs';
// import Booking from './pages/Booking';
// import CateringPage from './pages/Catering';
// import DeliverBoyOrders from './pages/deliveryboy/Upadtedelivery';
// import AdminPage from './pages/admin/Admin';
// import AddChefs from './pages/admin/Addchef';
// import SalesAndItemsAnalysis from './pages/admin/Analytics';
// import AddDeliveryBoyForm from './pages/admin/Adddeliveryboy';
// import DeliveryBoys from './pages/DeliveryBoys';
// import OrderPage from './pages/Orders';
// import ReviewPage from './pages/Feedback';
// import EventAnalysis from './pages/CateringOrganisation';
// import Needaccess from './pages/Needaccess';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* ✅ Layout route wraps all child routes */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="about" element={<About />} />
//           <Route path="contact" element={<Contact />} />
//           <Route path="menu" element={<Menu />} />
//           <Route path="signin" element={<Signin />} />
//           <Route path="signup" element={<Signup />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="chefs" element={<Chefs />} />
//           <Route path="additem" element={<Additem />} />
//           <Route path="booking" element={<Booking />} />
//           <Route path="catering" element={<CateringPage />} />
//           <Route path="reservation" element={<ReservationPage />} />
//           <Route path="deliveryboy" element={<DeliverBoyOrders />} />
//           <Route path="admin" element={<AdminPage />} />
//           <Route path="addchef" element={<AddChefs />} />
//           <Route path="adddeliveryboy" element={<AddDeliveryBoyForm />} />
//           <Route path="deliveryboys" element={<DeliveryBoys />} />
//           <Route path="orders" element={<OrderPage />} />
//           <Route path="analytics" element={<SalesAndItemsAnalysis />} />
//           <Route path="review" element={<ReviewPage />} />
//           <Route path="events" element={<EventAnalysis />} />
//           <Route path="needaccess" element={<Needaccess />} />
//           <Route path="tandc" element={<TermsAndConditions />} />
//           <Route path="*" element={<PageNotFound />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ReservationPage from './pages/reservation/ReservationPage'
import Home from './pages/general/Home';
import Contact from './pages/general/Contact';
import Menu from './pages/Menu';
import About from './pages/general/About';
import Signin from './pages/auth/Signin';
import Signup from './pages/auth/Signup';
import Profile from './pages/Profile';
import Additem from './pages/admin/Additem';
import TermsAndConditions from './pages/general/TermsAndConditions';
import PageNotFound from './pages/PageNotFound';
import Chefs from './pages/Chefs';
import Booking from './pages/Booking';
import CateringPage from './pages/Catering';
import DeliverBoyOrders from './pages/deliveryboy/Upadtedelivery';
import AdminPage from './pages/admin/Admin';
import AddChefs from './pages/admin/Addchef';
import SalesAndItemsAnalysis from './pages/admin/Analytics';
import AddDeliveryBoyForm from './pages/admin/Adddeliveryboy';
import DeliveryBoys from './pages/DeliveryBoys';
import OrderPage from './pages/Orders';
import ReviewPage from './pages/Feedback';
import EventAnalysis from './pages/CateringOrganisation';
import Needaccess from './pages/Needaccess';
import ProtectedRoute from './components/ProtectedRoute';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Layout route wraps all child routes */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="tandc" element={<TermsAndConditions />} />
          <Route path="chefs" element={<Chefs />} />
          
          {/* Protected Routes (Login Required) */}
          <Route path="menu" element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="booking" element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          } />
          <Route path="catering" element={
            <ProtectedRoute>
              <CateringPage />
            </ProtectedRoute>
          } />
          <Route path="reservation" element={
            <ProtectedRoute>
              <ReservationPage />
            </ProtectedRoute>
          } />
          <Route path="review" element={
            <ProtectedRoute>
              <ReviewPage />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          } />
          
          {/* Private Routes (Admin Only) */}
          <Route path="additem" element={
            <PrivateRoute requireAdmin={true}>
              <Additem />
            </PrivateRoute>
          } />
          <Route path="deliveryboy" element={
            <PrivateRoute requireAdmin={true}>
              <DeliverBoyOrders />
            </PrivateRoute>
          } />
          <Route path="admin" element={
            <PrivateRoute requireAdmin={true}>
              <AdminPage />
            </PrivateRoute>
          } />
          <Route path="addchef" element={
            <PrivateRoute requireAdmin={true}>
              <AddChefs />
            </PrivateRoute>
          } />
          <Route path="adddeliveryboy" element={
            <PrivateRoute requireAdmin={true}>
              <AddDeliveryBoyForm />
            </PrivateRoute>
          } />
          <Route path="deliveryboys" element={
            <PrivateRoute requireAdmin={true}>
              <DeliveryBoys />
            </PrivateRoute>
          } />
          <Route path="analytics" element={
            <PrivateRoute requireAdmin={true}>
              <SalesAndItemsAnalysis />
            </PrivateRoute>
          } />
          <Route path="events" element={
            <PrivateRoute requireAdmin={true}>
              <EventAnalysis />
            </PrivateRoute>
          } />
          
          {/* Other Routes */}
          <Route path="needaccess" element={<Needaccess />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;