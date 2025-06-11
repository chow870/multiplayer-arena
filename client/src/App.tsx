import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Login/Login';
import Signup from './components/SignUp/Signup';
import VerifyEmail from './components/Login/EmailVerification';
import Homepage from './components/Homepage/Homepage';
import GamesLandingPage from './components/Games/gamesLandingPage';
import WaitingRoom from './components/Games/WaitingRoom/WaitingRoom';
import ProtectedLayout from './components/ProtectedLayout/ProtectedLayout';
import GameRoom from './components/Games/GameRoom/GameRoom';
import BuyPremium from './components/Transactions/BuyPrenium';
import Topup from './components/Transactions/Topup';
import PaymentSuccess from './components/Transactions/SuccessPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/verify' element={<VerifyEmail />} />

      {/* Protected Routes (navbar shared here) */}
      <Route element={<ProtectedLayout />}>
        <Route path='/home' element={<Homepage />} />
        <Route path='/game' element={<GamesLandingPage />} />
        <Route path='/game/waitingLobby' element={<WaitingRoom />} />
        <Route path='/game/play' element={<GameRoom />} />
        <Route path='/buyPremium' element={<BuyPremium/>}/>
        <Route path='/topup' element={<Topup/>}/>
        <Route path= '/paymentsuccess' element={<PaymentSuccess/>}/>

      </Route>
    </Routes>
  );
}

export default App;
