import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '../pages/index'

// Mock next/head
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

// Mock next/link
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    ),
  }
})

// Mock fetch
global.fetch = jest.fn()

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the header with app name', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: 'Thirsty' })).toBeInTheDocument()
  })

  it('renders the search input', () => {
    render(<Home />)
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
  })

  it('shows initial state message', () => {
    render(<Home />)
    expect(screen.getByText('Search for a cocktail')).toBeInTheDocument()
  })

  it('updates search input value on change', () => {
    render(<Home />)
    const input = screen.getByPlaceholderText('Search') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'margarita' } })
    expect(input.value).toBe('margarita')
  })

  it('shows clear button when search has value', () => {
    render(<Home />)
    const input = screen.getByPlaceholderText('Search')

    // Clear button should not exist initially
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'test' } })

    // Clear button should now exist
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('clears search when clear button is clicked', () => {
    render(<Home />)
    const input = screen.getByPlaceholderText('Search') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'test' } })
    expect(input.value).toBe('test')

    const clearButton = screen.getByRole('button')
    fireEvent.click(clearButton)

    expect(input.value).toBe('')
  })

  it('displays drinks when search returns results', async () => {
    const mockDrinks = {
      drinks: [
        {
          idDrink: '1',
          strDrink: 'Margarita',
          strDrinkThumb: 'https://example.com/margarita.jpg',
          strCategory: 'Cocktail',
          strAlcoholic: 'Alcoholic',
          strGlass: 'Cocktail glass'
        },
        {
          idDrink: '2',
          strDrink: 'Blue Margarita',
          strDrinkThumb: 'https://example.com/blue-margarita.jpg',
          strCategory: 'Cocktail',
          strAlcoholic: 'Alcoholic',
          strGlass: 'Cocktail glass'
        }
      ]
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockDrinks)
    })

    render(<Home />)
    const input = screen.getByPlaceholderText('Search')
    fireEvent.change(input, { target: { value: 'margarita' } })

    await waitFor(() => {
      expect(screen.getByText('Margarita')).toBeInTheDocument()
      expect(screen.getByText('Blue Margarita')).toBeInTheDocument()
    })
  })

  it('displays no results message when search returns empty', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ drinks: null })
    })

    render(<Home />)
    const input = screen.getByPlaceholderText('Search')
    fireEvent.change(input, { target: { value: 'xyz123' } })

    await waitFor(() => {
      expect(screen.getByText('No drinks found')).toBeInTheDocument()
    })
  })

  it('links to drink detail page', async () => {
    const mockDrinks = {
      drinks: [
        {
          idDrink: '123',
          strDrink: 'Test Drink',
          strDrinkThumb: 'https://example.com/test.jpg',
          strCategory: 'Cocktail',
          strAlcoholic: 'Alcoholic',
          strGlass: 'Glass'
        }
      ]
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockDrinks)
    })

    render(<Home />)
    const input = screen.getByPlaceholderText('Search')
    fireEvent.change(input, { target: { value: 'test' } })

    await waitFor(() => {
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/drink/123')
    })
  })
})
