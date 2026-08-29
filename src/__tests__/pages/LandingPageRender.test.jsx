import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '../../store/store'
import LandingPage from '../../pages/LandingPage'

describe('LandingPage Rendering', () => {
  it('renders the hero title', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </Provider>
    )
    expect(screen.getByText('Find the product that is actually worth it.')).toBeDefined()
  })

  it('renders the CTA button', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </Provider>
    )
    expect(screen.getByText('Start comparing')).toBeDefined()
  })

  it('renders feature cards', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </Provider>
    )
    // Use exact text matches
    expect(screen.getByText('Marginal Benefit (MB%)')).toBeDefined()
    expect(screen.getByText('Cost-Benefit (CB)')).toBeDefined()
    expect(screen.getByText('Custom Weights')).toBeDefined()
  })

  it('renders the description', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </Provider>
    )
    expect(screen.getByText(/BlueCart ranks products from Amazon, AliExpress, and eBay/i)).toBeDefined()
  })
})
