import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '../../store/store'
import ProductCard from '../../components/ProductCard'

// Mock product data matching the actual component's prop structure
const mockListing = {
  site: 'Amazon',
  price: 30098,
  rating: 4.7,
  num_ratings: 10,
  delivery_cost: 200,
  pay_on_delivery: true,
  mb_score: 0.0155,
  cb_score: 0.0133,
}

describe('ProductCard Rendering', () => {
  it('renders the site name', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard listing={mockListing} />
        </BrowserRouter>
      </Provider>
    )
    expect(screen.getByText(/Amazon/i)).toBeDefined()
  })

  it('renders the price', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard listing={mockListing} />
        </BrowserRouter>
      </Provider>
    )
    // Price is formatted with 2 decimal places: 30,098.00
    expect(screen.getByText(/30,098.00/i)).toBeDefined()
  })

  it('renders the rating', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard listing={mockListing} />
        </BrowserRouter>
      </Provider>
    )
    expect(screen.getByText(/4.7/i)).toBeDefined()
    expect(screen.getByText(/10 ratings/i)).toBeDefined()
  })

  it('renders delivery cost', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard listing={mockListing} />
        </BrowserRouter>
      </Provider>
    )
    expect(screen.getByText(/Delivery: Ksh 200.00/i)).toBeDefined()
  })

  it('renders payment method', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard listing={mockListing} />
        </BrowserRouter>
      </Provider>
    )
    expect(screen.getByText(/Pay after delivery/i)).toBeDefined()
  })

  it('renders MB and CB scores', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard listing={mockListing} />
        </BrowserRouter>
      </Provider>
    )
    expect(screen.getByText(/MB 0.0155%/i)).toBeDefined()
    expect(screen.getByText(/CB 0.0133%/i)).toBeDefined()
  })
})
