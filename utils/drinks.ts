export interface DrinkDetail {
  idDrink: string
  strDrink: string
  strDrinkThumb: string
  strCategory: string
  strAlcoholic: string
  strGlass: string
  strInstructions: string
  [key: string]: string | null
}

export interface Ingredient {
  name: string
  measure: string
}

export const CHART_COLORS = [
  '#f4c2c2', '#90EE90', '#DEB887', '#FFD700', '#98D8C8',
  '#ADD8E6', '#DDA0DD', '#F0E68C', '#E6E6FA', '#FFDAB9',
  '#B0E0E6', '#FFB6C1', '#87CEEB', '#F5DEB3', '#D8BFD8'
]

export function parseIngredients(drink: DrinkDetail): Ingredient[] {
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

export function parseMeasureToNumber(measure: string): number {
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
