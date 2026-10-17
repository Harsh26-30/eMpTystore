import React, { useEffect, useRef, useState } from 'react'
import './Shopnox.css'
import './modal.css'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import DOMPurify from "dompurify";
import { useParams } from "react-router-dom";



const Shopnox = () => {
  const location = useLocation();
  const containerRef = useRef();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [UserUI, setUserUI] = useState({});
  const [header, setheader] = useState('');
  const [body, setbody] = useState('');
  const [footer, setfooter] = useState('');
  const [CartItem, setCartItem] = useState([]);
  const { id } = useParams();
  const [pendingAdd, setPendingAdd] = useState(null);
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef(null);

  const showNotice = (text) => {
    setNotice(text);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(''), 3000);
  };

  useEffect(() => () => clearTimeout(noticeTimer.current), []);



const loadUI = async () => {
  try {

    if (!id) {
      console.log("Seller id missing");
      return;
    }

const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/uidata`,
  {
    id: id
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    setheader(res.data.uiheader);
    setbody(res.data.uibody);
    setfooter(res.data.uifooter);
    setUserUI(res.data.productbox);


    if (token) {

      const res2 = await axios.get(
        `${import.meta.env.VITE_API_URL}/checkuserinfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItem(res2.data.CartItem);

    } else {

      // user not logged in
      navigate("/Auth");

    }


  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  loadUI();
}, [token, id]);

  useEffect(() => {

    const handleClick = (e) => {

      const action = e.target.dataset.action;
      const product = e.target.dataset.product;


      // Buy Product
      if (action === "Add") {

        if (!token) {
          navigate("/Auth");
          return;
        }

        const productData =
          UserUI[`productbox${product}`];

        if (!productData) return;

        // ask inside the page instead of a browser pop-up
        setPendingAdd(productData);
      }
    };

    const container =
      containerRef.current;

    container.addEventListener(
      "click",
      handleClick
    );

    return () => {
      container.removeEventListener(
        "click",
        handleClick
      );
    };

  }, [UserUI]);

  const confirmAdd = async () => {
    const productData = pendingAdd;
    if (!productData) return;

    setAdding(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/addItemToCart`, {
        quantity: 1,
        productid: productData._id,
        productname: productData.productname,
        sellerid: productData.productsellerid,
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

      showNotice(`${productData.productname} added to your cart.`);
      await loadUI();
    } catch (err) {
      console.log(err);
      showNotice('We could not add this item. Check your connection and try again.');
    } finally {
      setAdding(false);
      setPendingAdd(null);
    }
  };

  const renderHTML = (html, data = {}) => {
    if (!html) return "";

    let updatedHTML = html;

    updatedHTML = updatedHTML.replaceAll(
      "{{Business Name}}",
      data?.BusinessName || "Business Name"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname1id}}",
      data?.productbox1?.productname || "Productname1id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname1idimg}}",
      data?.productbox1?.productimage || "Productname1id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productprice1id}}",
      data?.productbox1?.productprice || "0"
    );


    updatedHTML = updatedHTML.replaceAll(
      "{{Productname2id}}",
      data?.productbox2?.productname || "Productname1id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname2idimg}}",
      data?.productbox2?.productimage || "Productname1id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productprice2id}}",
      data?.productbox2?.productprice || "Productprice2id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname3id}}",
      data?.productbox3?.productname || "Productname1id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname3idimg}}",
      data?.productbox3?.productimage || "Productname1id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productprice3id}}",
      data?.productbox3?.productprice || "Productprice3id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname4id}}",
      data?.productbox4?.productname || "Productname4id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname4idimg}}",
      data?.productbox4?.productimage || "Productname4id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productprice4id}}",
      data?.productbox4?.productprice || "Productprice4id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname5id}}",
      data?.productbox5?.productname || "Productname5id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname5idimg}}",
      data?.productbox5?.productimage || "Productname5id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productprice5id}}",
      data?.productbox5?.productprice || "Productprice5id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname6id}}",
      data?.productbox6?.productname || "Productname6id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname6idimg}}",
      data?.productbox6?.productimage || "Productname6id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productprice6id}}",
      data?.productbox6?.productprice || "Productprice6id"
    );


    updatedHTML = updatedHTML.replaceAll(
      "{{Productname7id}}",
      data?.productbox7?.productname || "Productname7id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname7idimg}}",
      data?.productbox7?.productimage || "Productname7id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productprice7id}}",
      data?.productbox7?.productprice || "Productprice7id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname8id}}",
      data?.productbox8?.productname || "Productname8id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productname8idimg}}",
      data?.productbox8?.productimage || "Productname8id"
    );

    updatedHTML = updatedHTML.replaceAll(
      "{{Productprice8id}}",
      data?.productbox8?.productprice || "Productprice8id"
    );

    return updatedHTML;
  };

  const cartTotal = CartItem?.reduce((total, item) => total + item.quantity * item.productprice, 0) || 0;
  const cartCount = CartItem?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div id='shopnoxmainbox' ref={containerRef} className={CartItem.length > 0 ? 'has-cart' : undefined}>

      <button type="button" className="sn-back" onClick={() => navigate('/home')}>
        <span aria-hidden="true">&lsaquo;</span> All shops
      </button>

      <div id='header'
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            renderHTML(header, UserUI)
          )
        }}
      />

      <div id='body'
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            renderHTML(body, UserUI)
          )
        }}
      />

      {CartItem.length > 0 && (
        <div id='Gotocartbuttonbox' className="sn-cartbar" role="region" aria-label="Your cart">
          <ul className="sn-cart-items">
            {CartItem?.map((item) => (
              <li key={item.productid} className="sn-cart-chip">
                <span className="sn-cart-qty">{item.quantity}x</span>
                <span className="sn-cart-name">{item.productname}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="sn-cart-go" onClick={() => navigate('/Cart')}>
            <span className="sn-cart-total">₹{cartTotal.toLocaleString('en-IN')}</span>
            <span className="sn-cart-label">View cart ({cartCount})</span>
          </button>
        </div>
      )}

      {pendingAdd && (
        <div className="modal-backdrop" onClick={() => !adding && setPendingAdd(null)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sn-add-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="sn-add-title">Add to cart?</h2>
            <p>1 x {pendingAdd.productname}{pendingAdd.productprice ? ` for ₹${pendingAdd.productprice}` : ''}</p>
            <button type="button" className="modal-primary" onClick={confirmAdd} disabled={adding} autoFocus>
              {adding ? 'Adding…' : 'Add to cart'}
            </button>
            <button type="button" className="modal-secondary" onClick={() => setPendingAdd(null)} disabled={adding}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {notice && <p className="toast" role="status">{notice}</p>}

    </div>
  )
}

export default Shopnox