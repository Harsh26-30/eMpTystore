import React, { useState } from 'react'
import './UI.css'
import axios from 'axios'
import { useEffect } from 'react';
import DOMPurify from "dompurify";
import Updateproductuiid from './updateproductuiid';



const UI = () => {
  const token = localStorage.getItem("token");
  const [Optionvisibility, setOptionvisibility] = useState(false);
  const [UserUI, setUserUI] = useState({});
  const [component, setcomponent] = useState('')
  const [uidatas, setUidatas] = useState([]);
  const [header, setheader] = useState('');
  const [body, setbody] = useState('');
  // const [footer, setfooter] = useState('');
  const [visibilityval, setvisibilityval] = useState(false);
  // const [productbox, setproductbox] = useState('')
  // const [myuiproducts, setmyuiproducts] = useState('')



  useEffect(() => {
    const fetchUiData = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/uidatas`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
        setUidatas(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUiData();
  }, []);


  const handleAdd = async (uiid) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/addui`,
        { uiid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.msg);
      // Append new component instead of replacing
      setOptionvisibility(false);

      const loadUI = async () => {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/uidata`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setheader(res.data.uiheader);
          setbody(res.data.uibody);
          // setfooter(res.data.uifooter);

        } catch (err) {
          console.log(err);
        }
      };

      loadUI();


    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const loadUI = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/uidata`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );



        setheader(res.data.uiheader);
        setbody(res.data.uibody);
        //  setfooter(res.data.uifooter);


      } catch (err) {
        console.log(err);
      }
    };

    loadUI();

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

        setUserUI(res.data.productbox);
        console.log("FULL RESPONSE:", res.data.productbox);
      } catch (err) {
        console.log(err);
      }
    };

    fun1();
  }, [token]);


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
      data?.productbox1?.productname || "Productprice1id"
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
    <div id='mainboxUI' >


      {Optionvisibility === true && (
        <div id='options'>
          {Array.isArray(uidatas) && uidatas.length > 0 ? (
            uidatas.map((ui) => {
              // Get first part of Componentid (e.g., 'body', 'header', 'footer')
              const type = ui.Componentid.split("_")[0];

              // Show only if type matches selected component
              if (type !== component) return null;

              return (
                <div key={ui._id} className="ui-box">
                  <h4 style={{ color: "gray" }}>{type.toUpperCase()}</h4>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: ui.Componentcode
                    }}
                  />

                  <button
                    id='btn1'
                    onClick={() => handleAdd(ui.Componentid)}
                  >
                    Add {type}
                  </button>
                </div>
              );
            })
          ) : (
            <p>No UI Data found</p>
          )}
        </div>
      )}

      {visibilityval === true && <Updateproductuiid onclicksave={()=>{fun1();}} setvisibilityval={setvisibilityval} />}


      <div id='lookbox'>

        <div
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderHTML(header, UserUI)) }}
        />
        <div
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderHTML(body, UserUI)) }}
        />

      </div>

      <div id='box2Ui'>
        <button onClick={() => { setcomponent('header'); setOptionvisibility(true); }}>
          <img src="\top_panel_close_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="header1" />
          <p>Header</p>
        </button>
        <button onClick={() => { setcomponent('body'); setOptionvisibility(true); }}>
          <img src="\splitscreen_portrait_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="header" />
          <p>Body</p>
        </button>
        {/* <button>
          <img src="\top_panel_close_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="header" />
          <p>Footer</p>
        </button> */}
        <button onClick={() => { setvisibilityval(true) }}>
          <img src="\article_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="header" />
          <p>Update Info</p>
        </button>
      </div>
    </div>
  )
}

export default UI