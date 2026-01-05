import {
  parseIngredients,
  parseMeasureToNumber,
  DrinkDetail,
  CHART_COLORS
} from 'utils/drinks'

describe('parseMeasureToNumber', () => {
  it('returns 1 for empty string', () => {
    expect(parseMeasureToNumber('')).toBe(1)
  })

  it('converts ounces (base unit)', () => {
    expect(parseMeasureToNumber('2 oz')).toBe(2)
    expect(parseMeasureToNumber('1.5 oz')).toBe(1.5)
    expect(parseMeasureToNumber('1/2 oz')).toBe(0.5)
    expect(parseMeasureToNumber('1 1/2 oz')).toBe(1.5)
  })

  it('converts cups to ounces', () => {
    expect(parseMeasureToNumber('1 cup')).toBe(8)
    expect(parseMeasureToNumber('2 cups')).toBe(16)
    expect(parseMeasureToNumber('1/4 cup')).toBe(2)
  })

  it('converts teaspoons to ounces', () => {
    expect(parseMeasureToNumber('1 tsp')).toBeCloseTo(0.167, 2)
    expect(parseMeasureToNumber('3 tsp')).toBeCloseTo(0.501, 2)
  })

  it('converts tablespoons to ounces', () => {
    expect(parseMeasureToNumber('1 tbsp')).toBe(0.5)
    expect(parseMeasureToNumber('2 tbsp')).toBe(1)
  })

  it('converts shots to ounces', () => {
    expect(parseMeasureToNumber('1 shot')).toBe(1.5)
    expect(parseMeasureToNumber('2 shots')).toBe(3)
  })

  it('converts cl to ounces', () => {
    expect(parseMeasureToNumber('3 cl')).toBeCloseTo(1.014, 2)
  })

  it('converts ml to ounces', () => {
    expect(parseMeasureToNumber('30 ml')).toBeCloseTo(1.014, 2)
  })

  it('handles dash measurements', () => {
    expect(parseMeasureToNumber('1 dash')).toBeCloseTo(0.03, 2)
    expect(parseMeasureToNumber('2 dashes')).toBeCloseTo(0.06, 2)
  })

  it('handles splash measurements', () => {
    expect(parseMeasureToNumber('1 splash')).toBe(0.25)
  })

  it('handles garnish measurements', () => {
    expect(parseMeasureToNumber('1 twist')).toBe(0.1)
    expect(parseMeasureToNumber('1 slice')).toBe(0.2)
    expect(parseMeasureToNumber('1 wedge')).toBe(0.3)
    expect(parseMeasureToNumber('2 slices')).toBe(0.4)
  })

  it('returns numeric value for unrecognized units', () => {
    expect(parseMeasureToNumber('2')).toBe(2)
    expect(parseMeasureToNumber('to taste')).toBe(1)
  })

  it('is case insensitive', () => {
    expect(parseMeasureToNumber('1 DASH')).toBeCloseTo(0.03, 2)
    expect(parseMeasureToNumber('1 Splash')).toBe(0.25)
    expect(parseMeasureToNumber('2 OZ')).toBe(2)
  })
})

describe('parseIngredients', () => {
  it('returns empty array for drink with no ingredients', () => {
    const drink: DrinkDetail = {
      idDrink: '1',
      strDrink: 'Test',
      strDrinkThumb: '',
      strCategory: '',
      strAlcoholic: '',
      strGlass: '',
      strInstructions: ''
    }
    expect(parseIngredients(drink)).toEqual([])
  })

  it('parses single ingredient', () => {
    const drink: DrinkDetail = {
      idDrink: '1',
      strDrink: 'Test',
      strDrinkThumb: '',
      strCategory: '',
      strAlcoholic: '',
      strGlass: '',
      strInstructions: '',
      strIngredient1: 'Vodka',
      strMeasure1: '2 oz'
    }
    expect(parseIngredients(drink)).toEqual([
      { name: 'Vodka', measure: '2 oz' }
    ])
  })

  it('parses multiple ingredients', () => {
    const drink: DrinkDetail = {
      idDrink: '1',
      strDrink: 'Test',
      strDrinkThumb: '',
      strCategory: '',
      strAlcoholic: '',
      strGlass: '',
      strInstructions: '',
      strIngredient1: 'Vodka',
      strMeasure1: '2 oz',
      strIngredient2: 'Lime juice',
      strMeasure2: '1 oz',
      strIngredient3: 'Simple syrup',
      strMeasure3: '1/2 oz'
    }
    expect(parseIngredients(drink)).toEqual([
      { name: 'Vodka', measure: '2 oz' },
      { name: 'Lime juice', measure: '1 oz' },
      { name: 'Simple syrup', measure: '1/2 oz' }
    ])
  })

  it('skips empty ingredient slots', () => {
    const drink: DrinkDetail = {
      idDrink: '1',
      strDrink: 'Test',
      strDrinkThumb: '',
      strCategory: '',
      strAlcoholic: '',
      strGlass: '',
      strInstructions: '',
      strIngredient1: 'Vodka',
      strMeasure1: '2 oz',
      strIngredient2: '',
      strMeasure2: '',
      strIngredient3: 'Lime',
      strMeasure3: '1 wedge'
    }
    expect(parseIngredients(drink)).toEqual([
      { name: 'Vodka', measure: '2 oz' },
      { name: 'Lime', measure: '1 wedge' }
    ])
  })

  it('trims whitespace from ingredients and measures', () => {
    const drink: DrinkDetail = {
      idDrink: '1',
      strDrink: 'Test',
      strDrinkThumb: '',
      strCategory: '',
      strAlcoholic: '',
      strGlass: '',
      strInstructions: '',
      strIngredient1: '  Vodka  ',
      strMeasure1: '  2 oz  '
    }
    expect(parseIngredients(drink)).toEqual([
      { name: 'Vodka', measure: '2 oz' }
    ])
  })

  it('handles ingredient without measure', () => {
    const drink: DrinkDetail = {
      idDrink: '1',
      strDrink: 'Test',
      strDrinkThumb: '',
      strCategory: '',
      strAlcoholic: '',
      strGlass: '',
      strInstructions: '',
      strIngredient1: 'Mint leaves',
      strMeasure1: null
    }
    expect(parseIngredients(drink)).toEqual([
      { name: 'Mint leaves', measure: '' }
    ])
  })

  it('handles null ingredients', () => {
    const drink: DrinkDetail = {
      idDrink: '1',
      strDrink: 'Test',
      strDrinkThumb: '',
      strCategory: '',
      strAlcoholic: '',
      strGlass: '',
      strInstructions: '',
      strIngredient1: null,
      strMeasure1: '2 oz'
    }
    expect(parseIngredients(drink)).toEqual([])
  })
})

describe('CHART_COLORS', () => {
  it('contains 15 colors', () => {
    expect(CHART_COLORS).toHaveLength(15)
  })

  it('contains valid hex colors', () => {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/
    CHART_COLORS.forEach(color => {
      expect(color).toMatch(hexColorRegex)
    })
  })
})
