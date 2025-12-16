import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { SearchBox } from 'components/SearchBox'
import { DrinkListItem } from 'components/DrinkListItem'

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

        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={clearSearch}
        />

        <main className="main-content">
          {loading && (
            <div className="main-loading">Searching...</div>
          )}

          {!loading && hasSearched && drinks.length === 0 && (
            <div className="main-empty">
              <p>No drinks found</p>
            </div>
          )}

          {!loading && drinks.length > 0 && (
            <ul className="drink-list">
              {drinks.map((drink) => (
                <DrinkListItem
                  key={drink.idDrink}
                  id={drink.idDrink}
                  name={drink.strDrink}
                  thumbnail={drink.strDrinkThumb}
                />
              ))}
            </ul>
          )}
        </main>
      </div>
    </>
  )
}
