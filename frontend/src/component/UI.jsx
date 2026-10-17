import React, { useRef, useState } from 'react'
import './UI.css'
import axios from 'axios'
import { useEffect } from 'react';
import DOMPurify from "dompurify";
import Updateproductuiid from './updateproductuiid';

const TYPE_LABELS = { header: 'header', body: 'body' }

// Replace the {{...}} placeholders in a stored layout with the seller's own details
const renderHTML = (html, data = {}) => {
  if (!html) return "";

  let updatedHTML = html.replaceAll(
    "{{Business Name}}",
    data?.BusinessName || "Business Name"
  );

  for (let n = 1; n <= 8; n++) {
    const box = data?.[`productbox${n}`];
    updatedHTML = updatedHTML
      .replaceAll(`{{Productname${n}id}}`, box?.productname || `Productname${n}id`)
      .replaceAll(`{{Productname${n}idimg}}`, box?.productimage || `Productname${n}id`)
      .replaceAll(`{{Productprice${n}id}}`, box?.productprice || (n === 1 ? "0" : `Productprice${n}id`));
  }

  return updatedHTML;
};

const UI = () => {
  const token = localStorage.getItem("token");
  const [Optionvisibility, setOptionvisibility] = useState(false);
  const [UserUI, setUserUI] = useState({});
  const [component, setcomponent] = useState('')
  const [uidatas, setUidatas] = useState([]);
  const [header, setheader] = useState('');
  const [body, setbody] = useState('');
  const [visibilityval, setvisibilityval] = useState(false);
  const [currentIds, setCurrentIds] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);
  const noticeTimer = useRef(null);

  const showNotice = (text, tone = 'ok') => {
    setNotice({ text, tone })
    clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(null), 4500)
  }

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
      return true
    } catch (err) {
      console.log(err);
      return false
    }
  };

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
      setCurrentIds(res.data.useruidata?.componentid || {});
      return true
    } catch (err) {
      console.log(err);
      return false
    }
  };

  const fetchUiData = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/uidatas`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      setUidatas(res.data);
      return true
    } catch (err) {
      console.log(err);
      return false
    }
  };

  const loadAll = async () => {
    setLoadError('')
    const results = await Promise.all([loadUI(), fun1(), fetchUiData()])
    if (results.some((ok) => !ok)) {
      setLoadError('We could not load your shop page. Check your connection and try again.')
    }
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    loadAll()
    return () => clearTimeout(noticeTimer.current)
  }, [token]);

  const handleAdd = async (uiid) => {
    setBusyId(uiid)
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

      showNotice(res.data.msg || 'Your shop page has been updated.');
      setOptionvisibility(false);
      await loadUI();
      await fun1();
    } catch (err) {
      console.log(err);
      showNotice('We could not apply this layout. Please try again.', 'error')
    }
    setBusyId(null)
  };

  // Close the layout picker with Escape
  useEffect(() => {
    if (!Optionvisibility) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOptionvisibility(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [Optionvisibility])

  const openPicker = (type) => {
    setcomponent(type)
    setOptionvisibility(true)
  }

  const choices = Array.isArray(uidatas)
    ? uidatas.filter((ui) => String(ui.Componentid || '').split("_")[0] === component)
    : []

  const hasLook = Boolean(header || body)

  return (
    <section className="ui" aria-labelledby="ui-heading">
      <div className="ui-top">
        <div>
          <h2 id="ui-heading">Your shop page</h2>
          <p className="ui-sub">This is what customers see when they open your shop.</p>
        </div>
      </div>

      <div className="ui-tools" role="group" aria-label="Edit your shop page">
        <button type="button" className="ui-btn ui-btn-secondary" onClick={() => openPicker('header')}>
          Change header
        </button>
        <button type="button" className="ui-btn ui-btn-secondary" onClick={() => openPicker('body')}>
          Change body
        </button>
        <button type="button" className="ui-btn ui-btn-primary" onClick={() => { setvisibilityval(true) }}>
          Edit shop details
        </button>
      </div>

      {loading && <div className="ui-skel" aria-busy="true" aria-label="Loading your shop page" />}

      {!loading && loadError && (
        <div className="ui-message is-error" role="alert">
          <p>{loadError}</p>
          <button type="button" className="ui-btn ui-btn-secondary" onClick={() => { setLoading(true); loadAll() }}>Try again</button>
        </div>
      )}

      {!loading && !loadError && !hasLook && (
        <div className="ui-message">
          <p>Your shop page is empty. Choose a header and a body to get started.</p>
        </div>
      )}

      {!loading && hasLook && (
        <div className="ui-preview">
          <p className="ui-preview-label">Preview</p>
          <div className="ui-look">
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderHTML(header, UserUI)) }}
            />
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderHTML(body, UserUI)) }}
            />
          </div>
        </div>
      )}

      {Optionvisibility === true && (
        <div className="ui-backdrop" onClick={() => setOptionvisibility(false)}>
          <div
            className="ui-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ui-picker-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ui-sheet-head">
              <h3 id="ui-picker-title">Choose a {TYPE_LABELS[component] || component}</h3>
              <button type="button" className="ui-btn ui-btn-secondary ui-small" onClick={() => setOptionvisibility(false)} autoFocus>
                Close
              </button>
            </div>

            {choices.length > 0 ? (
              <ul className="ui-options">
                {choices.map((ui) => {
                  const inUse = currentIds[component] === ui.Componentid
                  const label = String(ui.Componentid).split("_").slice(1).join(' ')
                  return (
                    <li key={ui._id} className="ui-option">
                      <div className="ui-option-head">
                        <h4>{`${TYPE_LABELS[component] || component} ${label}`.trim()}</h4>
                        {inUse && <span className="ui-pill">In use</span>}
                      </div>

                      <div
                        className="ui-option-look"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderHTML(ui.Componentcode, UserUI)) }}
                      />

                      <button
                        type="button"
                        className="ui-btn ui-btn-primary"
                        onClick={() => handleAdd(ui.Componentid)}
                        disabled={busyId !== null || inUse}
                      >
                        {busyId === ui.Componentid ? 'Applying…' : inUse ? 'Already in use' : `Use this ${TYPE_LABELS[component] || component}`}
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="ui-message">No layouts are available for this part yet.</p>
            )}
          </div>
        </div>
      )}

      {visibilityval === true && (
        <Updateproductuiid
          setvisibilityval={setvisibilityval}
          onclicksave={(message) => {
            showNotice(message || 'Your shop details have been saved.')
            loadUI();
            fun1();
          }}
        />
      )}

      <div className="ui-toast-wrap" role="status" aria-live="polite">
        {notice && <div className={`ui-toast is-${notice.tone}`}>{notice.text}</div>}
      </div>
    </section>
  )
}

export default UI
