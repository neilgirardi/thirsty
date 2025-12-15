import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface Drink {
  idDrink: string
  strDrink: string
  strDrinkThumb: string
  strCategory: string
  strAlcoholic: string
  strGlass: string
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const searchDrinks = useCallback(async (term: string) => {
    if (!term.trim()) {
      setDrinks([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`
      )
      const data = await response.json()
      setDrinks(data.drinks || [])
    } catch (error) {
      console.error('Error fetching drinks:', error)
      setDrinks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchDrinks(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, searchDrinks])

  const clearSearch = () => {
    setSearchTerm('')
    setDrinks([])
    setHasSearched(false)
  }

  return (
    <>
      <Head>
        <title>Thirsty - Find Your Perfect Drink</title>
        <meta name="description" content="Search and discover cocktail recipes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="main-page">
        <header className="main-header">
          <h1>Thirsty</h1>
        </header>

        <div className="search-wrapper">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-field"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <button className="clear-btn" onClick={clearSearch}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="#c7c7c7" />
                  <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <main className="main-content">
          {loading && (
            <div className="main-loading">Searching...</div>
          )}

          {!loading && !hasSearched && (
            <div className="main-empty">
              <p>Search for a cocktail</p>
            </div>
          )}

          {!loading && hasSearched && drinks.length === 0 && (
            <div className="main-empty">
              <p>No drinks found</p>
            </div>
          )}

          {!loading && drinks.length > 0 && (
            <ul className="drink-list">
              {drinks.map((drink) => (
                <li key={drink.idDrink}>
                  <Link href={`/drink/${drink.idDrink}`} className="drink-row">
                    <img
                      src={drink.strDrinkThumb}
                      alt={drink.strDrink}
                      className="drink-thumb"
                    />
                    <span className="drink-name">{drink.strDrink}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </>
  )
}
