import './App.css'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'


function App() {

  return (
    <>
      <div>
        <Navbar />
        {/* <LandingPage /> */}
        <Dashboard />
      </div>
    </>
  )
}

export default App
