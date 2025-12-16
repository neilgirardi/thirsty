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

  it('parses whole numbers', () => {
    expect(parseMeasureToNumber('2 oz')).toBe(2)
    expect(parseMeasureToNumber('3 cups')).toBe(3)
  })

  it('parses decimal numbers', () => {
    expect(parseMeasureToNumber('1.5 oz')).toBe(1.5)
    expect(parseMeasureToNumber('0.5 tsp')).toBe(0.5)
  })

  it('parses simple fractions', () => {
    expect(parseMeasureToNumber('1/2 oz')).toBe(0.5)
    expect(parseMeasureToNumber('1/4 cup')).toBe(0.25)
    expect(parseMeasureToNumber('3/4 oz')).toBe(0.75)
  })

  it('parses mixed fractions', () => {
    expect(parseMeasureToNumber('1 1/2 oz')).toBe(1.5)
    expect(parseMeasureToNumber('2 1/4 cups')).toBe(2.25)
  })

  it('handles dash measurements', () => {
    expect(parseMeasureToNumber('dash')).toBe(0.5)
    expect(parseMeasureToNumber('2 dashes')).toBe(2)
  })

  it('handles splash measurements', () => {
    expect(parseMeasureToNumber('splash')).toBe(0.5)
  })

  it('handles twist measurements', () => {
    expect(parseMeasureToNumber('twist')).toBe(0.25)
  })

  it('handles slice measurements', () => {
    expect(parseMeasureToNumber('slice')).toBe(0.5)
  })

  it('handles wedge measurements', () => {
    expect(parseMeasureToNumber('wedge')).toBe(0.5)
  })

  it('returns 1 for unrecognized measurements', () => {
    expect(parseMeasureToNumber('to taste')).toBe(1)
    expect(parseMeasureToNumber('some')).toBe(1)
  })

  it('is case insensitive', () => {
    expect(parseMeasureToNumber('DASH')).toBe(0.5)
    expect(parseMeasureToNumber('Splash')).toBe(0.5)
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
