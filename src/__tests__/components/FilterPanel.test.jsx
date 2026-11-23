import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../../store/authSlice'
import filtersReducer from '../../store/filtersSlice'
import historyReducer from '../../store/historySlice'
import reviewsReducer from '../../store/reviewsSlice'
import searchReducer from '../../store/searchSlice'
import FilterPanel from '../../components/FilterPanel'

const post = vi.hoisted(() => vi.fn())

vi.mock('../../api/client', () => ({
  default: {
    post,
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
  getErrorMessage: (err, fallback) => fallback,
  post,
}))

function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      filters: filtersReducer,
      history: historyReducer,
      reviews: reviewsReducer,
      search: searchReducer,
    },
  })
}

function renderWithProviders(ui, options = {}) {
  const store = makeStore()
  return {
    store,
    ...render(
      <Provider store={store}>
        {ui}
      </Provider>,
      options
    ),
  }
}

beforeEach(() => {
  post.mockReset()
})

describe('FilterPanel', () => {
  it('renders weight sliders in price, rating, trust order', () => {
    renderWithProviders(<FilterPanel />)
    const labels = screen.getAllByText(/^(Price|Product rating|Payment safety)$/)
    expect(labels.map((el) => el.textContent)).toEqual([
      'Price',
      'Product rating',
      'Payment safety',
    ])
  })

  it('displays each weight as its relative share', () => {
    renderWithProviders(<FilterPanel />)
    expect(screen.getByText('50%')).toBeTruthy()
    expect(screen.getByText('35%')).toBeTruthy()
    expect(screen.getByText('15%')).toBeTruthy()
  })

  it('shows 0%, disables Apply and shows hint when all weights are zero', () => {
    const { store } = renderWithProviders(<FilterPanel />)
    act(() => {
      store.dispatch({ type: 'filters/setWeight', payload: { key: 'price', value: 0 } })
      store.dispatch({ type: 'filters/setWeight', payload: { key: 'rating', value: 0 } })
      store.dispatch({ type: 'filters/setWeight', payload: { key: 'trust', value: 0 } })
    })
    expect(screen.getAllByText('0%').length).toBe(3)
    expect(screen.getByText('Set at least one factor above zero.')).toBeTruthy()
    expect(screen.getByText('Apply filters').disabled).toBe(true)
  })

  it('shows rerankError in an error Alert and disables Apply while reranking', () => {
    const { store } = renderWithProviders(<FilterPanel />)
    act(() => {
      store.dispatch({ type: 'search/rerankResults/rejected', payload: 'Rerank failed' })
    })
    expect(screen.getByText(/Rerank failed/)).toBeTruthy()

    act(() => {
      store.dispatch({ type: 'search/rerankResults/pending' })
    })
    expect(screen.getByText('Apply filters').disabled).toBe(true)
  })
})
