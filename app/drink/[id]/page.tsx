import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { IngredientList } from 'components/IngredientList'
import { DrinkDetail, parseIngredients } from 'utils/drinks'
import styles from 'styles/DrinkDetail.module.css'

async function getDrink(id: string): Promise<DrinkDetail | null> {
  const response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
  )
  const data = await response.json()
  return data.drinks?.[0] || null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const drink = await getDrink(id)

  if (!drink) {
    return { title: 'Drink Not Found - Thirsty' }
  }

  return {
    title: `${drink.strDrink} - Thirsty`,
    description: `Learn how to make a ${drink.strDrink}`,
  }
}

export default async function DrinkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const drink = await getDrink(id)

  if (!drink) {
    notFound()
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
