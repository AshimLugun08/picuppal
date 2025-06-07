import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes ,Route} from 'react-router-dom'
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captionlogin from './pages/Captionlogin'
import CaptionSignup from './pages/CaptionSignup'
import Start from './pages/start'
import UserProtectedWrapper from './pages/UserProtectedWrapper'
import UserLogout from './pages/Userlogout'
import CaptionHome from './pages/CaptionHome'
import CaptainProtectWrapper from "./pages/CaptionProtectWrapper"
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div >
    <Routes>
      <Route path="/" element={<Start/>} />
      <Route path="/login" element={<UserLogin/>} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />
      <Route path="/signup" element={<UserSignup/>} />
      <Route path="/captain-login" element={<Captionlogin/>} />
      <Route path="/captain-signup" element={<CaptionSignup/>} />
      <Route path="/home" element={
        <UserProtectedWrapper>
          <Home/>
        </UserProtectedWrapper>
      } />
      <Route path="/captain-home" element={
        <CaptainProtectWrapper>
          <CaptionHome/>
        </CaptainProtectWrapper>
      } />
      <Route path="/users/logout" element={<UserLogout/>} />
    </Routes>
   </div>

  )
}

export default App
