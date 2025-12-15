import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import {
  DrinkDetail,
  CHART_COLORS,
  parseIngredients,
  parseMeasureToNumber
} from '../../utils/drinks'

export default function DrinkDetailPage() {
  const router = useRouter()
  const { id } = router.query

  const [drink, setDrink] = useState<DrinkDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchDrink = async () => {
      setLoading(true)
      setError(false)

      try {
        const response = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
        )
        const data = await response.json()

        if (data.drinks && data.drinks.length > 0) {
          setDrink(data.drinks[0])
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error fetching drink details:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchDrink()
  }, [id])

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-loading">Loading...</div>
      </div>
    )
  }

  if (error || !drink) {
    return (
      <div className="detail-page">
        <header className="detail-header">
          <Link href="/" className="detail-back">
            &lt; Thirsty
          </Link>
          <span className="detail-title">Not Found</span>
          <span className="detail-spacer"></span>
        </header>
        <div className="detail-loading">Drink not found</div>
      </div>
    )
  }

  const ingredients = parseIngredients(drink)

  return (
    <>
      <Head>
        <title>{drink.strDrink} - Thirsty</title>
        <meta name="description" content={`Learn how to make a ${drink.strDrink}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="detail-page">
        <header className="detail-header">
          <Link href="/" className="detail-back">
            &lt; Thirsty
          </Link>
          <span className="detail-title">{drink.strDrink}</span>
          <span className="detail-spacer"></span>
        </header>

        <main className="detail-content">
          <div className="detail-image-container">
            <img
              src={drink.strDrinkThumb}
              alt={drink.strDrink}
              className="detail-image"
            />
          </div>

          <h1 className="detail-name">{drink.strDrink}</h1>

          <section className="detail-section">
            <h2 className="detail-section-title">Ingredients:</h2>
            <div className="ingredients-row">
              <ul className="ingredient-list">
                {ingredients.map((ing, index) => (
                  <li key={index} className="ingredient-item">
                    <span
                      className="ingredient-color"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    ></span>
                    <span className="ingredient-text">
                      {ing.name}
                      {ing.measure && <span className="ingredient-measure"> ({ing.measure})</span>}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="ingredient-chart">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={ingredients.map((ing, index) => ({
                        name: ing.name,
                        value: parseMeasureToNumber(ing.measure),
                        color: CHART_COLORS[index % CHART_COLORS.length]
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={0}
                    >
                      {ingredients.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <p className="detail-instructions">{drink.strInstructions}</p>
          </section>
        </main>
      </div>
    </>
  )
}
