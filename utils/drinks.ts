export interface DrinkDetail {
  idDrink: string
  strDrink: string
  strDrinkThumb: string
  strCategory: string
  strAlcoholic: string
  strGlass: string
  strInstructions: string
  // The cocktail API returns drinks with dynamic properties like:
  // - strIngredient1, strIngredient2, ... strIngredient15
  // - strMeasure1, strMeasure2, ... strMeasure15
  // Rather than explicitly defining all 30+ properties, the index signature says: "this object can have any string key, and its value will be string | null."
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

// Conversion factors to ounces (standard unit)
const UNIT_TO_OZ: Record<string, number> = {
  oz: 1,
  ounce: 1,
  ounces: 1,
  shot: 1.5,
  shots: 1.5,
  jigger: 1.5,
  cl: 0.338,
  ml: 0.0338,
  tsp: 0.167,
  teaspoon: 0.167,
  teaspoons: 0.167,
  tbsp: 0.5,
  tablespoon: 0.5,
  tablespoons: 0.5,
  cup: 8,
  cups: 8,
  pint: 16,
  pints: 16,
  dash: 0.03,
  dashes: 0.03,
  splash: 0.25,
  splashes: 0.25,
  drop: 0.0017,
  drops: 0.0017,
  part: 1,
  parts: 1,
  glass: 8,
  can: 12,
  bottle: 12,
}

// Small garnish amounts in ounces
const GARNISH_OZ: Record<string, number> = {
  twist: 0.1,
  twists: 0.1,
  slice: 0.2,
  slices: 0.2,
  wedge: 0.3,
  wedges: 0.3,
  sprig: 0.1,
  sprigs: 0.1,
  leaf: 0.05,
  leaves: 0.05,
  piece: 0.2,
  pieces: 0.2,
  cube: 0.2,
  cubes: 0.2,
  scoop: 4,
  scoops: 4,
}

function parseNumericValue(str: string): number {
  // Match fractions like "1 1/2" or "1/2"
  const fractionMatch = str.match(/(\d+)?\s*(\d+)\/(\d+)/)
  if (fractionMatch) {
    const whole = fractionMatch[1] ? parseInt(fractionMatch[1]) : 0
    const numerator = parseInt(fractionMatch[2])
    const denominator = parseInt(fractionMatch[3])
    return whole + numerator / denominator
  }

  // Match decimal numbers
  const numberMatch = str.match(/[\d.]+/)
  if (numberMatch) {
    return parseFloat(numberMatch[0])
  }

  return 1
}

export function parseMeasureToNumber(measure: string): number {
  // if there is no measure, don't put in in the pie chart
  if (!measure) return 0

  const cleaned = measure.toLowerCase().trim()
  const numericValue = parseNumericValue(cleaned)

  // Check for unit conversions
  for (const [unit, ozFactor] of Object.entries(UNIT_TO_OZ)) {
    if (cleaned.includes(unit)) {
      return numericValue * ozFactor
    }
  }

  // Check for garnishes
  for (const [garnish, ozValue] of Object.entries(GARNISH_OZ)) {
    if (cleaned.includes(garnish)) {
      return numericValue * ozValue
    }
  }

  // no supported unit. For example "1 olive" (this should also be omitted from pie chart)
  return 0
}
