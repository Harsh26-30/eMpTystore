import React, { useEffect, useState } from 'react'
import './updateproductuiid.css'
import axios from 'axios';

const COLORS = [
    { value: 'white', label: 'White' },
    { value: 'black', label: 'Black' },
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' },
];

const SLOTS = Array.from({ length: 12 }, (_, i) => i + 1);

const Updateproductuiid = ({ setvisibilityval, onclicksave }) => {
    const token = localStorage.getItem("token");
    const [businessname, setbusinessname] = useState('');

    // Product1 ... Product12: the product chosen for each slot on the shop page
    const [chosen, setChosen] = useState(() => SLOTS.map(() => ''));
    const [products, setProducts] = useState([]);
    const [TextColor, setTextColor] = useState('');
    const [BackgroundColor, setBackgroundColor] = useState('');
    const [backgroundimage, setbackgroundimage] = useState();

    const [inputvisibility, setinputvisibility] = useState('generalinfo');
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        const fun1 = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/get-user-products`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setProducts(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.log(err);
                setProductsError('We could not load your products, so you cannot pick them yet. Close this and try again.');
            }
            setProductsLoading(false);
        };

        fun1();
    }, [])

    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => { if (e.key === 'Escape') setvisibilityval(false); };
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previous;
            document.removeEventListener('keydown', onKey);
        };
    }, [])

    const setSlot = (index, value) => {
        setChosen((prev) => prev.map((v, i) => (i === index ? value : v)));
    };

  const handlesaveproduct = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError('');

  try {
    const payload = {};
    SLOTS.forEach((n, i) => { payload[`Product${n}`] = chosen[i]; });

    // remove empty values
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(
        ([_, value]) => value !== '' && value !== null && value !== undefined
      )
    );

    const formData = new FormData();

    formData.append("businessname", businessname || "");
    formData.append("TextColor", TextColor || "");
    formData.append("BackgroundColor", BackgroundColor || "");

    // IMPORTANT: must match backend multer field name
    if (backgroundimage) {
      formData.append("Backgroundimage", backgroundimage);
    }

    // append products
    Object.entries(filteredPayload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/updateproducttoui`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setvisibilityval(false);
    if (onclicksave) onclicksave(res.data.message || "Updated successfully");
  } catch (err) {
    console.log(err);
    setError(err.response?.data?.message || "We could not save your changes. Check your connection and try again.");
    setSaving(false);
  }
};

    const colorSelect = (id, label, value, setter) => (
        <div className="field uu-color">
            <label className="label" htmlFor={id}>{label}</label>
            <div className="uu-color-row">
                <span
                    className="uu-swatch"
                    aria-hidden="true"
                    style={value ? { backgroundColor: value } : undefined}
                />
                <select id={id} className="input" value={value} onChange={(e) => setter(e.target.value)}>
                    <option value="">Keep current</option>
                    {COLORS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );

    return (
        <div className="uu-backdrop">
            <form
                className="uu-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="uu-title"
                onSubmit={handlesaveproduct}
            >
                <div className="uu-head">
                    <h2 id="uu-title">Edit shop details</h2>
                    <button type="button" className="btn btn-secondary btn-small" onClick={() => setvisibilityval(false)} disabled={saving}>
                        Close
                    </button>
                </div>

                <div className="tabs" role="tablist" aria-label="Shop details">
                    <button
                        type="button"
                        role="tab"
                        id="uu-tab-general"
                        className="tab"
                        aria-selected={inputvisibility === 'generalinfo'}
                        aria-controls="uu-panel-general"
                        onClick={() => { setinputvisibility('generalinfo') }}
                    >
                        Look and name
                    </button>
                    <button
                        type="button"
                        role="tab"
                        id="uu-tab-products"
                        className="tab"
                        aria-selected={inputvisibility === 'productinfo'}
                        aria-controls="uu-panel-products"
                        onClick={() => { setinputvisibility('productinfo') }}
                    >
                        Products
                    </button>
                </div>

                <div className="uu-body">
                    <div
                        id="uu-panel-general"
                        role="tabpanel"
                        aria-labelledby="uu-tab-general"
                        className="uu-panel"
                        hidden={inputvisibility !== 'generalinfo'}
                    >
                        <p className="hint">Leave a field as it is to keep what your shop page has now.</p>

                        <div className="field">
                            <label className="label" htmlFor="uu-business">Business name</label>
                            <input id="uu-business" className="input" type="text" autoComplete="organization" value={businessname} onChange={(e) => { setbusinessname(e.target.value) }} />
                        </div>

                        <div className="uu-pair">
                            {colorSelect('uu-bg', 'Background colour', BackgroundColor, setBackgroundColor)}
                            {colorSelect('uu-text', 'Text colour', TextColor, setTextColor)}
                        </div>

                        <div className="field">
                            <label className="label" htmlFor="uu-bgimage">Background image</label>
                            <input
                                id="uu-bgimage"
                                className="input uu-file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setbackgroundimage(e.target.files[0])}
                            />
                        </div>
                    </div>

                    <div
                        id="uu-panel-products"
                        role="tabpanel"
                        aria-labelledby="uu-tab-products"
                        className="uu-panel"
                        hidden={inputvisibility !== 'productinfo'}
                    >
                        <p className="hint">Choose which products appear on your shop page. Slots you leave empty stay as they are.</p>

                        {productsLoading && <div className="skeleton uu-skel" aria-busy="true" aria-label="Loading your products" />}
                        {productsError && <p className="alert alert-error" role="alert">{productsError}</p>}
                        {!productsLoading && !productsError && products.length === 0 && (
                            <p className="alert alert-info">You have no products yet. Add a product first, then pick it here.</p>
                        )}

                        <div className="uu-slots">
                            {SLOTS.map((n, i) => (
                                <div className="field" key={n}>
                                    <label className="label" htmlFor={`uu-product-${n}`}>Product {n}</label>
                                    <select
                                        id={`uu-product-${n}`}
                                        className="input"
                                        value={chosen[i]}
                                        onChange={(e) => setSlot(i, e.target.value)}
                                    >
                                        <option value="">No change</option>
                                        {products.map((product) => (
                                            <option value={product._id} key={product._id}>
                                                {product.productname}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="uu-foot">
                    {error && <p className="alert alert-error" role="alert">{error}</p>}
                    <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                        {saving ? 'Saving…' : 'Save changes'}
                    </button>
                </div>
            </form>
        </div>

    )
}

export default Updateproductuiid
