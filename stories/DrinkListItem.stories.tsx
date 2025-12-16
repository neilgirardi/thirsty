import type { Meta, StoryObj, Decorator } from '@storybook/react'
import { DrinkListItem } from 'components/DrinkListItem'

const listDecorator: Decorator = (Story) => (
  <ul className="drink-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
    <Story />
  </ul>
)

const meta: Meta<typeof DrinkListItem> = {
  title: 'Components/DrinkListItem',
  component: DrinkListItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [listDecorator],
}

export default meta
type Story = StoryObj<typeof DrinkListItem>

export const Default: Story = {
  args: {
    id: '11007',
    name: 'Margarita',
    thumbnail: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg',
  },
}

export const LongName: Story = {
  args: {
    id: '17222',
    name: 'A1 Super Deluxe Strawberry Daiquiri',
    thumbnail: 'https://www.thecocktaildb.com/images/media/drink/wpxpvu1439905379.jpg',
  },
}

const multipleItemsDecorator: Decorator = () => (
  <ul className="drink-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
    <DrinkListItem
      id="11007"
      name="Margarita"
      thumbnail="https://www.thecocktaildb.com/images/media/drink/5noda61702008895.jpg"
    />
    <DrinkListItem
      id="11118"
      name="Blue Margarita"
      thumbnail="https://www.thecocktaildb.com/images/media/drink/bry4qh1582751040.jpg"
    />
    <DrinkListItem
      id="17216"
      name="Tommy's Margarita"
      thumbnail="https://www.thecocktaildb.com/images/media/drink/loezxn1504373874.jpg"
    />
  </ul>
)

export const MultipleItems: Story = {
  decorators: [multipleItemsDecorator],
  render: () => <></>,
}
