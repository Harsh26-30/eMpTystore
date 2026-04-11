import { useEffect, useState } from 'react'
import Auth from './component/auth'
import Homepage from './component/homepage'
import axios from 'axios'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './component/ProtectedRoute'
import SearchBox from './component/searchbox'
import Uploadproduct from './component/uploadproduct'
import Productview from './component/productview'
import Buynow from './component/buynow'
import Menu from './component/Menu'


function App() {
  const [valid, setvalid] = useState('')
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setvalid(res.data.valid)
      } catch (err) {
        setvalid("false");
      }
    };
    checkUser();
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/searchbox"
          element={
            <ProtectedRoute>
              < SearchBox />
            </ProtectedRoute>
          }
        />

        <Route
          path="/uploadproduct"
          element={
            <ProtectedRoute>
              < Uploadproduct />
            </ProtectedRoute>
          }
        />


        <Route
          path="/productview"
          element={
            <ProtectedRoute>
              < Productview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buynow"
          element={
            <ProtectedRoute>
              < Buynow />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Menu"
          element={
            <ProtectedRoute>
              < Menu />
            </ProtectedRoute>
          }
        />
      </Routes>


    </BrowserRouter>
  )
}

export default App
