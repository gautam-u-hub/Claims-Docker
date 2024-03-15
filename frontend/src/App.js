import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.css"
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import AllPolicies from "./components/policies/AllPolicies.jsx"
import Navbar from './components/partials/Navbar.jsx';
import NewPolicy from './components/policies/NewPolicy.jsx';
import ApplyClaim from './components/Claims/ApplyClaim.jsx';
import ChangeClaimStatus from './components/Claims/ChangeClaimStatus.jsx';
import ShowPolicy from './components/policies/ShowPolicy.jsx';
import AssignPolicy from './components/policies/AssignPolicy.jsx';
import Login from './components/User/Login.jsx';
import Register from './components/User/Register.jsx';
import axios from 'axios';
import UserPolicies from "./components/policies/UserPolicies.jsx"
import AllClaims from './components/Claims/AllClaims.jsx';
import UserClaims from './components/Claims/UserClaims.jsx';
import ClaimDetails from './components/Claims/ClaimDetails.jsx';
import UpdatePolicy from './components/policies/UpdatePolicy.jsx';
import Home from './components/partials/Home.jsx';
import Footer from './components/partials/Footer.jsx';
import AuthRoute from './AuthRoute.jsx';
import AdminRoute from './AdminRoute.jsx';
import UpdateClaims from './components/Claims/UpdateClaims.jsx';
import AllUsers from "./components/AllUsers";
import BuyPolicy from './components/policies/BuyPolicy.jsx';
import UpdatePayment from './components/policies/UpdatePayment.jsx';
import UpdateUser from './components/User/UpdateUser.jsx';
import UpdatePassword from "./components/User/UpdatePassword.jsx";
import ForgotPassword from './components/User/ForgotPassword.jsx';
import ForgotPasswordReset from './components/User/ForgotPasswordReset.jsx';

axios.defaults.withCredentials = true;

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>


        <Route element={<AuthRoute />}
        >
          <Route path='your-policies' element={<UserPolicies />} />
          <Route path='apply-claim/:policyId' element={<ApplyClaim />} />
          <Route path='show-policy/:policyId' element={<ShowPolicy />} />
          <Route path='/your-claims' element={<UserClaims />} />
          <Route path='/user-claims/:claimId' element={<ClaimDetails />} />
          <Route path='/update-claims/:claimId' element={<UpdateClaims />} />
          <Route path='/buy-policy/:policyId' element={<BuyPolicy />} />
          <Route path='/update-payment/:policyId' element={<UpdatePayment />} />
          <Route path='/update-password' element={<UpdatePassword/>}/>



        </Route>
        <Route path='/update-user' element={<UpdateUser />} />

        <Route element={
          <AdminRoute />
        }
        >
          <Route path='/all-claims' element={<AllClaims />} />

          <Route path='new-policy' element={<NewPolicy />} />
          <Route path='change-claim/:claimId' element={<ChangeClaimStatus />} />
          <Route path='assign-policy' element={<AssignPolicy />} />
          <Route path='update-policy/:policyId' element={<UpdatePolicy />} />

          <Route path='/all-users' element={<AllUsers />} />

        </Route>

        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='/' element={<Home />} />
        <Route path='all-policies' element={<AllPolicies />} />
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/password/reset/:token' element={<ForgotPasswordReset/>}/>

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
