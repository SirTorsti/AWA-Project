import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Navigation from "./components/Navigation"
import { Route, BrowserRouter, Routes} from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {


  return (
    <>
      <BrowserRouter>
        <div className ="App">
          <h1>Very cool app</h1>
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/register" element={<Register />}/>
            </Routes>

        </div>
      </BrowserRouter>
    </>
  )
}

export default App
