import Auth from './component/auth'
import Homepage from './component/homepage'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './component/ProtectedRoute'
import SearchBox from './component/searchbox'
import Uploadproduct from './component/uploadproduct'
import Productview from './component/productview'
import Buynow from './component/buynow'
import Menu from './component/Menu'
import Order from './component/Order'
import OrderStatus from './component/OrderStatus'
import AddAddress from './component/addAddress'
import Key from './component/Key'
import Request from './component/Request'
import Uploadcomponent from './component/uploadcomponent'
import Shopnox from './component/Shopnox'
import ForgotPassword from './component/forgotPassword'
import RouteLoader from './component/Routeloder'
import UserProfile from './component/UserProfile'


function App() {
  // const [valid, setvalid] = useState('')
  // const token = localStorage.getItem("token");

  // useEffect(() => {
  //   const checkUser = async () => {
  //     try {
  //       const res = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setvalid(res.data.valid)
  //     } catch (err) {
  //       setvalid("false");
  //     }
  //   };
  //   checkUser();
  // }, []); // ✅ IMPORTANT

  return (
    <BrowserRouter>
      <RouteLoader>
        <Routes>
          <Route
            path="/"
            element={
              localStorage.getItem("token")
                ? <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
                : <Auth />
            }
          />

          <Route
            path="/home"
            element={

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

          <Route
            path="/Order"
            element={
              <ProtectedRoute>
                < Order />
              </ProtectedRoute>
            }
          />

          <Route
            path="/OrderStatus"
            element={
              <ProtectedRoute>
                < OrderStatus />
              </ProtectedRoute>
            }
          />

          <Route
            path="/addAddress"
            element={
              <ProtectedRoute>
                < AddAddress />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Key"
            element={
              <ProtectedRoute>
                < Key />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Request"
            element={
              <ProtectedRoute>
                < Request />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Uploadcomponent"
            element={
              <ProtectedRoute>
                < Uploadcomponent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Shopnox"
            element={
              <ProtectedRoute>
                < Shopnox />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ForgotPassword"
            element={
              < ForgotPassword />
            }
          />

          <Route
            path="/UserProfile"
            element={
              <ProtectedRoute>
                < UserProfile />
              </ProtectedRoute>
            }
          />


          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                < UserProfile />
              </ProtectedRoute>
            }
          />


        </Routes>
      </RouteLoader>
    </BrowserRouter>
  )
}

export default App
