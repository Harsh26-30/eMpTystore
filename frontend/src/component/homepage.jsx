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
  const [userRole, setuserRole] = useState('Customer')
  const [userEmailVerification, setemailverificationvisibility] = useState()
  const [userPhoneNoVerification, setuserPhoneNoVerification] = useState()
  const [who, setWho] = useState({ name: '', place: '' })

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
      setWho({ name: (res.data.username || '').split(' ')[0], place: [res.data.district, res.data.state].filter(Boolean).join(', ') })
      if (res.data.role) {
        setemailverificationvisibility(res.data.userEmailVerification)
        setuserPhoneNoVerification(res.data.userPhoneNoVerification)
      }


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
    <div id="mainboxhomepage" className={userRole === "Customer" ? "home-customer" : undefined}>
      <Header2 managehomepagevisible={managehomepagevisible} setmanagehomepagevisible={setmanagehomepagevisible} />
      {userRole === "Seller" && managehomepagevisible === 'Order' && <Order />}
      {userRole === "Seller" && managehomepagevisible === 'Product' && <Product />}
      {userRole === "Seller" && managehomepagevisible === 'UI' && <UI />}
      {userRole === "Customer" && (
        <main className="home-main">
          <div className="hm-top">
            <h1 className="hm-hello">Hello{who.name ? `, ${who.name}` : ''} <span aria-hidden="true">&#128075;</span></h1>
            <p className="hm-sub">Find products in your nearby stores</p>
          </div>

          <button type="button" className="hm-search" onClick={() => navigate('/searchbox')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <span>Search for a shop</span>
          </button>

          {who.place && (
            <div className="hm-loc">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
              <div><small>Your location</small><strong>{who.place}</strong></div>
            </div>
          )}

          <section className="hm-banner" aria-label="Support local shops">
            <div>
              <h2>Support Local Shopkeepers</h2>
              <p>Big brands aren&rsquo;t the only option. Shop local, shop smart!</p>
            </div>
            <svg viewBox="0 0 120 100" width="112" height="94" aria-hidden="true">
              <rect x="14" y="40" width="92" height="50" rx="3" fill="#fff" stroke="#0E2A6B" strokeWidth="3" />
              <path d="M8 40 L16 14 H104 L112 40 Z" fill="#1A62E6" />
              <path d="M8 40h104" stroke="#0E2A6B" strokeWidth="3" />
              {[0, 1, 2, 3, 4].map((i) => (<path key={i} d={`M${8 + i * 20.8} 40 q10.4 14 20.8 0`} fill={i % 2 ? '#FFB82E' : '#fff'} stroke="#0E2A6B" strokeWidth="2.5" />))}
              <rect x="24" y="54" width="36" height="22" rx="2" fill="#DCE8FD" stroke="#0E2A6B" strokeWidth="2.5" />
              <rect x="72" y="54" width="22" height="36" rx="2" fill="#0E2A6B" />
              <circle cx="16" cy="88" r="7" fill="#35A86B" /><circle cx="106" cy="88" r="6" fill="#35A86B" />
            </svg>
          </section>

          <div className="hm-head"><h2>Nearby stores</h2></div>
          <NearByShop />
          <Generatelinkbtnbox />
        </main>
      )}
      {/* {userRole === "Customer" && <h3 className="hmh3">Your Connections</h3>}
      {userRole === "Customer" && <Connections />} */}
      {userRole === "Admin" && (
        <main className="home-main">
          <h2 className="home-heading">Admin</h2>
          <p className="page-lead" style={{ padding: '0 16px' }}>Review role requests, upload shop layouts and pay out withdrawals from the Menu.</p>
          <div style={{ padding: '16px' }}>
            <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/Menu')}>Open menu</button>
          </div>
        </main>
      )}
      {userRole === "Delivery_partner" && <DeliveryPartnerdashboard />}
      {userPhoneNoVerification === false && <UpdatePhoneNo fun1={fun1} />}
      {userEmailVerification === false && <EmailVerification setemailverificationvisibility={setemailverificationvisibility} />}
      {userRole === "Customer" && <button id="AboutUsbtn" type="button" onClick={() => navigate('/AboutUs')}>About Empty Store</button>}
      {/* <Footer/> */}
    </div>
  );
}

export default Homepage;
