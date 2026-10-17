import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import AuthField from './AuthField'

const addAddress = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [address, setaddress] = useState('')
    const [country, setcountry] = useState('')
    const [state, setstate] = useState('')
    const [district, setdistrict] = useState('')
    const [pincode, setpincode] = useState('')
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const [locating, setLocating] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/updateaddress`,
                { address, country, state, district, pincode },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (res.data.success) {
                navigate('/home')
            } else {
                setError(res.data.message || 'We could not save your address. Please check it and try again.')
            }
        } catch (err) {
            console.log(err.response?.data || err.message)
            setError(err.response?.data?.message || 'We could not save your address. Check your connection and try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleUseCurrentLocation = () => {
        setError('')

        if (!navigator.geolocation) {
            setError('Your browser cannot share your location. Type your address instead.')
            return
        }

        setLocating(true)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude
                const lon = position.coords.longitude

                try {
                    const res = await axios.get(
                        'https://nominatim.openstreetmap.org/reverse',
                        {
                            params: { lat, lon, format: 'jsonv2', addressdetails: 1 },
                            headers: { 'Accept-Language': 'en' },
                        }
                    )

                    const a = res.data.address

                    setcountry(a.country || '')
                    setstate(a.state || '')
                    setdistrict(
                        a.state_district ||
                        a.county ||
                        a.city_district ||
                        a.city ||
                        ''
                    )
                    setpincode(a.postcode || '')
                } catch (err) {
                    console.error(err)
                    setError('We could not find your address from your location. Type it instead.')
                } finally {
                    setLocating(false)
                }
            },
            (err) => {
                console.error(err)
                setLocating(false)
                setError('We could not get your location. Allow location access, or type your address.')
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        )
    }

    return (
        <AuthLayout>
            <h2 className="auth-title">Where should we deliver?</h2>
            <p className="auth-lead">Add your address so we can show you shops nearby.</p>

            <button
                type="button"
                className="auth-secondary"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                style={{ marginBottom: 20 }}
            >
                {locating ? 'Finding your location…' : 'Use my current location'}
            </button>

            <form className="auth-form" onSubmit={handleSubmit}>
                <AuthField
                    label="Address"
                    name="address"
                    autoComplete="street-address"
                    placeholder="House number, street, area"
                    required
                    value={address}
                    onChange={(e) => setaddress(e.target.value)}
                />

                <div className="auth-grid is-two">
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="address-country">Country</label>
                        <select
                            id="address-country"
                            className="auth-input"
                            required
                            value={country}
                            onChange={(e) => setcountry(e.target.value)}
                        >
                            <option value="" disabled>Select country</option>
                            <option value="India">India</option>
                            {country && country !== 'India' && <option value={country}>{country}</option>}
                        </select>
                    </div>

                    <AuthField
                        label="State"
                        name="state"
                        autoComplete="address-level1"
                        placeholder="State"
                        required
                        value={state}
                        onChange={(e) => setstate(e.target.value)}
                    />

                    <AuthField
                        label="District"
                        name="district"
                        autoComplete="address-level2"
                        placeholder="District"
                        required
                        value={district}
                        onChange={(e) => setdistrict(e.target.value)}
                    />

                    <AuthField
                        label="PIN code"
                        name="pincode"
                        autoComplete="postal-code"
                        inputMode="numeric"
                        placeholder="PIN code"
                        required
                        value={pincode}
                        onChange={(e) => setpincode(e.target.value)}
                    />
                </div>

                {error && <p className="auth-error" role="alert">{error}</p>}

                <button className="auth-submit" type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save address and continue'}
                </button>
            </form>
        </AuthLayout>
    )
}

export default addAddress
