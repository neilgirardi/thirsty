import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SearchBox } from 'components/SearchBox'

const meta: Meta<typeof SearchBox> = {
  title: 'Components/SearchBox',
  component: SearchBox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SearchBox>

// Wrapper component to handle state
function SearchBoxWithState(props: { initialValue?: string; placeholder?: string }) {
  const [value, setValue] = useState(props.initialValue || '')
  return (
    <SearchBox
      value={value}
      onChange={setValue}
      onClear={() => setValue('')}
      placeholder={props.placeholder}
    />
  )
}

export const Empty: Story = {
  render: () => <SearchBoxWithState />,
}

export const WithValue: Story = {
  render: () => <SearchBoxWithState initialValue="Margarita" />,
}

export const CustomPlaceholder: Story = {
  render: () => <SearchBoxWithState placeholder="Find a cocktail..." />,
}
