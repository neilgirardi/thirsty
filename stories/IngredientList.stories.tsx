import type { Meta, StoryObj } from '@storybook/react'
import { IngredientList } from 'components/IngredientList'
import type { Ingredient } from 'utils/drinks'

const meta: Meta<typeof IngredientList> = {
  title: 'Components/IngredientList',
  component: IngredientList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof IngredientList>

const margaritaIngredients: Ingredient[] = [
  { name: 'Tequila', measure: '1 1/2 oz' },
  { name: 'Triple sec', measure: '1/2 oz' },
  { name: 'Lime juice', measure: '1 oz' },
  { name: 'Salt', measure: '' },
]

const mojitoIngredients: Ingredient[] = [
  { name: 'Light rum', measure: '2-3 oz' },
  { name: 'Lime', measure: 'Juice of 1' },
  { name: 'Sugar', measure: '2 tsp' },
  { name: 'Mint', measure: '2-4' },
  { name: 'Soda water', measure: '' },
]

const complexIngredients: Ingredient[] = [
  { name: 'Vodka', measure: '1 oz' },
  { name: 'Gin', measure: '1 oz' },
  { name: 'Light rum', measure: '1 oz' },
  { name: 'Tequila', measure: '1 oz' },
  { name: 'Triple sec', measure: '1 oz' },
  { name: 'Lemon juice', measure: '1 1/2 oz' },
  { name: 'Cola', measure: '1 splash' },
]

export const Margarita: Story = {
  args: {
    ingredients: margaritaIngredients,
    showChart: true,
  },
}

export const Mojito: Story = {
  args: {
    ingredients: mojitoIngredients,
    showChart: true,
  },
}

export const LongIslandIcedTea: Story = {
  args: {
    ingredients: complexIngredients,
    showChart: true,
  },
}

export const WithoutChart: Story = {
  args: {
    ingredients: margaritaIngredients,
    showChart: false,
  },
}

export const SingleIngredient: Story = {
  args: {
    ingredients: [{ name: 'Whiskey', measure: '2 oz' }],
    showChart: true,
  },
}
