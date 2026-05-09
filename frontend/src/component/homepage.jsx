import { useNavigate } from "react-router-dom";
import Header2 from "./header2";
import './homepage.css';
import Footer from "./footer";
import Order from "./Order";
import Product from "./Product";
import UI from "./UI";
import { useEffect, useState } from "react";
import Connections from "./connections";
import axios from 'axios'

function Homepage() {
  const [managehomepagevisible, setmanagehomepagevisible] = useState('Order');
  const token = localStorage.getItem("token");

  const [userRole, setuserRole] = useState('')

  useEffect(() => {

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
      } catch (err) {
        console.log(err);
      }
    };

    fun1();
  }, [token]);

  return (
    <div id="mainboxhomepage">
      <Header2 managehomepagevisible={managehomepagevisible} setmanagehomepagevisible={setmanagehomepagevisible} />
      {userRole === "Seller" && managehomepagevisible === 'Order' && <Order />}
      {userRole === "Seller" && managehomepagevisible === 'Product' && <Product />}
      {userRole === "Seller" && managehomepagevisible === 'UI' && <UI />}
      {userRole === "Customer" && <Connections />}
      {/* <Footer/> */}
    </div>
  );
}

export default Homepage;
