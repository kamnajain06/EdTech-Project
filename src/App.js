import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home";
import About from './Pages/About';
import Navbar from './Components/common/Navbar';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import ForgotPassword from './Pages/ForgotPassword';
import UpdatePassword from './Pages/UpdatePassword';
import OpenRoute from './Components/Core/Auth/OpenRoute';
import VerifyEmail from './Pages/VerifyEmail';
import Profile from './Pages/Profile';

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 ">
      <Navbar className=''></Navbar>
      <Routes>
        <Route path="/" element={<Home></Home>}/>
        <Route path="/About" element={<About></About>}/>
        <Route path="login" element={<OpenRoute><Login></Login></OpenRoute>}/>
        <Route path="signup" element={<OpenRoute><Signup></Signup></OpenRoute>}/>
        <Route path="forgot-password" element={<OpenRoute><ForgotPassword></ForgotPassword></OpenRoute>}/>
        <Route path="reset-password/:id" element={<OpenRoute><UpdatePassword></UpdatePassword></OpenRoute>}/>
        <Route path="verify-email" element={<OpenRoute><VerifyEmail></VerifyEmail></OpenRoute>}/>
        <Route path="/dashboard/my-profile" element={<Profile></Profile>}/>
      </Routes>
    </div>
  );
}

export default App;
