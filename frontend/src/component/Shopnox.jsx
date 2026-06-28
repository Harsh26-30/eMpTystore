import React, { useEffect, useRef, useState } from 'react'
import './Shopnox.css'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import DOMPurify from "dompurify";


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


  const loadUI = async () => {
    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/uidata`,
        {
          id: location.state.id
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

      const res2 = await axios.get(
        `${import.meta.env.VITE_API_URL}/checkuserinfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItem(res2.data.CartItem)

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadUI();


  }, [token, location.state.id]);

  useEffect(() => {

    const handleClick = (e) => {

      const action = e.target.dataset.action;
      const product = e.target.dataset.product;


      // Buy Product
      if (action === "Add") {

        const productData =
          UserUI[`productbox${product}`];

        const permission = window.confirm(
          `Add ${1} quantity of ${productData.productname}?`
        );

        if (!permission) return;

        const handleadd = async () => {

          await axios.post(`${import.meta.env.VITE_API_URL}/addItemToCart`, {
            quantity:1,
            productid: productData._id,
            productname: productData.productname,
            sellerid: productData.productsellerid,
          },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

          loadUI();


        }

        handleadd();
      }

      loadUI();
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

  return (
    <div id='shopnoxmainbox' ref={containerRef}>

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

      {CartItem.length > 0 && <div id='Gotocartbuttonbox'>
        {CartItem?.map((item) => (
          <div key={item.productid} id="totalorderdetailed">
            <h4 id="quantity">{item.quantity}x</h4>
            <h4>{item.productname}</h4>
          </div>
        ))}
        <button onClick={() => navigate('/Cart')}>
          <h4>
            ₹{CartItem?.reduce((total, item) => total + item.quantity * item.productprice, 0)}
          </h4>
          <p>To Cart</p>
        </button>
      </div>}

    </div>
  )
}

export default Shopnox