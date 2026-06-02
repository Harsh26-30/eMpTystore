import React, { useState,useEffect } from 'react'
import Logincard from './logincard'
import Signupcard from './signupcard'
import './auth.css'


const auth = ({ setvalid }) => {
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);
  const [visibilty, setvisibilty] = useState('signup')
  return (
    <div id='authpage'>
      <div id='headerbox'>
        <div id='box1'>
          <img src="\E.png" alt="logo" />
          <h1>Empty Store</h1>
        </div>

        <div id='buttonbox'>
          <button style={visibilty === 'login' ?
            { backgroundColor: "#ffffff46", borderBottom: "5px solid grey" } :
            { backgroundColor: "#000" }
          } onClick={(e) => setvisibilty('login')}>Login</button>

          <button style={visibilty === 'signup' ? { backgroundColor: "#ffffff46", borderBottom: "5px solid grey" }
            : { backgroundColor: "#000" }
          } onClick={(e) => setvisibilty('signup')}>SignUp</button>

        </div>
      </div>
      <div id='cardbox'>
        {visibilty === 'login' && <Logincard setvalid={setvalid} />}
        {visibilty === 'signup' && <Signupcard setvalid={setvalid} />}
      </div>

    </div >
  )
}

export default auth
