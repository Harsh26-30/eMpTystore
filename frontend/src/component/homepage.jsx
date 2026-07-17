import Header2 from "./header2";
import './homepage.css';
import Footer from "./footer";
import Order from "./Order";
import Product from "./Product";
import UI from "./UI";
import { useEffect, useState } from "react";
import Connections from "./connections";
import axios from 'axios'
import NearByShop from "./NearByShop"
import DeliveryPartnerdashboard from "./DeliveryPartnerdashboard"
import { useNavigate } from "react-router-dom";
import EmailVerification from './EmailVerification'
import UpdatePhoneNo from "./updatePhoneNo"
import { useLocation } from "react-router-dom";
import Generatelinkbtnbox from "./generatelinkbtnbox"

function Homepage() {
  const [managehomepagevisible, setmanagehomepagevisible] = useState('Order');
  const token = localStorage.getItem("token");
  const navigate = useNavigate('')
  const location = useLocation();
  const [userRole, setuserRole] = useState('')
  const [userEmailVerification, setemailverificationvisibility] = useState()
  const [userPhoneNoVerification, setuserPhoneNoVerification] = useState()

  const fun1 = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/checkuserinfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setuserRole(res.data.role);
      setemailverificationvisibility(res.data.userEmailVerification)
      setuserPhoneNoVerification(res.data.userPhoneNoVerification)


      await axios.post(
        `${import.meta.env.VITE_API_URL}/removeCartItem`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    if (token) {
      fun1();
    }
  }, [token, location.pathname]);

  useEffect(() => {
    if (userRole === 'Seller') {

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/Updatelatlog`,
              {
                clatitude: position.coords.latitude,
                clongitude: position.coords.longitude
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }

            );


          } catch (err) {
            console.log(err);
          }
        },
        (error) => {
          console.log(error.nessage);
        }
      );
    }
  }, [userRole, token]);


  return (
    <div id="mainboxhomepage">
      <Header2 managehomepagevisible={managehomepagevisible} setmanagehomepagevisible={setmanagehomepagevisible} />
      {userRole === "Seller" && managehomepagevisible === 'Order' && <Order />}
      {userRole === "Seller" && managehomepagevisible === 'Product' && <Product />}
      {userRole === "Seller" && managehomepagevisible === 'UI' && <UI />}
      {userRole === "Customer" && <Generatelinkbtnbox/>}
      {userRole === "Customer" && <h3 className="hmh3">Near By Shops</h3>}
      {userRole === "Customer" && <NearByShop />}
      {/* {userRole === "Customer" && <h3 className="hmh3">Your Connections</h3>}
      {userRole === "Customer" && <Connections />} */}
      {userRole === "Delivery_partner" && <DeliveryPartnerdashboard />}
      {userPhoneNoVerification === false && <UpdatePhoneNo fun1={fun1} />}
      {userEmailVerification === false && <EmailVerification setemailverificationvisibility={setemailverificationvisibility} />}
      <button id="AboutUsbtn" onClick={() => navigate('/AboutUs')}>Know About Us</button>
      {/* <Footer/> */}
    </div>
  );
}

export default Homepage;
