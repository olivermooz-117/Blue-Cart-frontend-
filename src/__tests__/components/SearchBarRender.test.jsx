import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '../../store/store'
import SearchBar from '../../components/SearchBar'

describe('SearchBar Rendering', () => {
  it('renders the search input', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SearchBar />
        </BrowserRouter>
      </Provider>
    )
    // Updated placeholder text to match actual component
    expect(screen.getByPlaceholderText(/Try 'Samsung A51' or 'wireless earbuds'/i)).toBeDefined()
  })

  it('renders the search button', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SearchBar />
        </BrowserRouter>
      </Provider>
    )
    expect(screen.getByText(/Search/i)).toBeDefined()
  })

  it('updates input value on change', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SearchBar />
        </BrowserRouter>
      </Provider>
    )
    const input = screen.getByPlaceholderText(/Try 'Samsung A51' or 'wireless earbuds'/i)
    fireEvent.change(input, { target: { value: 'Samsung' } })
    expect(input.value).toBe('Samsung')
  })
})
