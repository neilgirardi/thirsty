'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { IngredientList } from 'components/IngredientList'
import { DrinkDetail, parseIngredients } from 'utils/drinks'
import styles from 'styles/DrinkDetail.module.css'

export default function DrinkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
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
      <div className={styles.page}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (error || !drink) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.back}>
            &lt; Thirsty
          </Link>
          <span className={styles.headerTitle}>Not Found</span>
          <span className={styles.spacer}></span>
        </header>
        <div className={styles.loading}>Drink not found</div>
      </div>
    )
  }

  const ingredients = parseIngredients(drink)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          &lt; Thirsty
        </Link>
        <span className={styles.headerTitle}>{drink.strDrink}</span>
        <span className={styles.spacer}></span>
      </header>

      <main className={styles.content}>
        <div className={styles.imageContainer}>
          <img
            src={drink.strDrinkThumb}
            alt={drink.strDrink}
            className={styles.image}
          />
        </div>

        <h1 className={styles.name}>{drink.strDrink}</h1>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ingredients:</h2>
          <IngredientList ingredients={ingredients} />
        </section>

        <section className={styles.section}>
          <p className={styles.instructions}>{drink.strInstructions}</p>
        </section>
      </main>
    </div>
  )
}
