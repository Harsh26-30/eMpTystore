import React, { useState } from 'react'
import axios from 'axios'
import Header2 from './header2'
import Searchresult from './searchresult'
import './searchbox.css'

const SearchBox = () => {
    const [userinput, setUserInput] = useState('')
    const [shops, setshops] = useState([])
    const [searched, setSearched] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const token = localStorage.getItem('token')

    const handleClickSearch = async (e) => {
        e.preventDefault()

        if (!userinput.trim() || !token) return

        setError('')
        setLoading(true)
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/search`,
                { userinput },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setshops(res.data.shop)
            setSearched(true)
        } catch (err) {
            console.log('Search error:', err)
            setError('We could not search right now. Check your connection and try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <Header2 />
            <main className="page-body is-narrow">
                <h1 className="page-title">Find a shop</h1>

                <form className="sb-form" onSubmit={handleClickSearch} role="search">
                    <label className="sb-label" htmlFor="sb-input">Shop name</label>
                    <div className="sb-row">
                        <input
                            id="sb-input"
                            className="input"
                            type="search"
                            placeholder="Search for a shop"
                            value={userinput}
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary" disabled={loading || !userinput.trim()}>
                            {loading ? 'Searching…' : 'Search'}
                        </button>
                    </div>
                </form>

                {error && <p className="alert alert-error sb-gap" role="alert">{error}</p>}

                <Searchresult shops={shops} searched={searched} />
            </main>
        </div>
    )
}

export default SearchBox
