import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '../../store/store'
import Navbar from '../../components/Navbar'

describe('Navbar Rendering', () => {
  it('renders the brand name', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    )
    // The brand text is just "BlueCart" (no Home link in Navbar)
    expect(screen.getByText(/BlueCart/i)).toBeDefined()
  })

  it('renders the search bar', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    )
    expect(screen.getByPlaceholderText(/Search for your product/i)).toBeDefined()
  })

  it('renders Sign In button', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    )
    expect(screen.getByText(/Sign In/i)).toBeDefined()
  })
})
