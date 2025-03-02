import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Login from './Components/Main/Login'
import MainPage from './Components/Main/MainPage'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/dashboard" element={<MainPage />} /> */}
      </Routes>
    </Router>
  )
}

export default App
