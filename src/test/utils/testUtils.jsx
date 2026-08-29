import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '../../store/store'

export function renderWithProviders(ui, options = {}) {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>,
    options
  )
}

export const mockProducts = [
  {
    id: '1',
    name: 'Samsung Galaxy A51 - Amazon',
    price: 30098,
    delivery_cost: 200,
    total_cost: 30298,
    rating: 4.7,
    rating_count: 10,
    site: 'Amazon',
    mb_score: 0.000155
  },
  {
    id: '2',
    name: 'Samsung Galaxy A51 - eBay',
    price: 29999,
    delivery_cost: 150,
    total_cost: 30149,
    rating: 4.0,
    rating_count: 4,
    site: 'eBay',
    mb_score: 0.000133
  }
]

export const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@email.com'
}
