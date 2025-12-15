import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface DrinkDetail {
  idDrink: string
  strDrink: string
  strDrinkThumb: string
  strCategory: string
  strAlcoholic: string
  strGlass: string
  strInstructions: string
  [key: string]: string | null
}

interface Ingredient {
  name: string
  measure: string
}

const COLORS = [
  '#f4c2c2', '#90EE90', '#DEB887', '#FFD700', '#98D8C8',
  '#ADD8E6', '#DDA0DD', '#F0E68C', '#E6E6FA', '#FFDAB9',
  '#B0E0E6', '#FFB6C1', '#87CEEB', '#F5DEB3', '#D8BFD8'
]

function parseIngredients(drink: DrinkDetail): Ingredient[] {
  const ingredients: Ingredient[] = []

  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`]
    const measure = drink[`strMeasure${i}`]

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || ''
      })
    }
  }

  return ingredients
}

function parseMeasureToNumber(measure: string): number {
  if (!measure) return 1

  const cleaned = measure.toLowerCase().trim()

  const fractionMatch = cleaned.match(/(\d+)?\s*(\d+)\/(\d+)/)
  if (fractionMatch) {
    const whole = fractionMatch[1] ? parseInt(fractionMatch[1]) : 0
    const numerator = parseInt(fractionMatch[2])
    const denominator = parseInt(fractionMatch[3])
    return whole + (numerator / denominator)
  }

  const numberMatch = cleaned.match(/[\d.]+/)
  if (numberMatch) {
    return parseFloat(numberMatch[0])
  }

  if (cleaned.includes('dash')) return 0.5
  if (cleaned.includes('splash')) return 0.5
  if (cleaned.includes('twist')) return 0.25
  if (cleaned.includes('slice')) return 0.5
  if (cleaned.includes('wedge')) return 0.5

  return 1
}

export default function DrinkDetail() {
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
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
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
                        color: COLORS[index % COLORS.length]
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={0}
                    >
                      {ingredients.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
