import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../../store/authSlice'
import filtersReducer from '../../store/filtersSlice'
import historyReducer from '../../store/historySlice'
import reviewsReducer from '../../store/reviewsSlice'
import searchReducer from '../../store/searchSlice'
import ResultsList from '../../components/ResultsList'

function makeStore() {  return configureStore({
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

describe('ResultsList', () => {
  it('shows the empty-state copy without claiming a shop is down', () => {
    const { store } = renderWithProviders(<ResultsList />)
    act(() => {
      store.dispatch({
        type: 'search/runSearch/fulfilled',
        payload: { query: 'Samsung', results: [], sites: ['Amazon'] },
      })
    })
    const alert = screen.getByRole('status')
    expect(alert.textContent).toContain('No results for "Samsung"')
    expect(alert.textContent).toContain('Try another keyword')
    expect(screen.queryByText(/out of reach/)).toBeNull()
  })

  it('appends the server message to the failed Alert', () => {
    const { store } = renderWithProviders(<ResultsList />)
    act(() => {
      store.dispatch({
        type: 'search/runSearch/rejected',
        payload: 'The server is waking up',
      })
    })
    expect(screen.getByText(/The server is waking up/)).toBeTruthy()
  })

  it('warns which known shops returned nothing for a non-empty search', () => {
    const { store } = renderWithProviders(<ResultsList />)
    act(() => {
      store.dispatch({
        type: 'search/runSearch/fulfilled',
        payload: {
          query: 'Samsung',
          results: [{ id: '1', name: 'X', site: 'Amazon', price: 100 }],
          sites: ['Amazon'],
        },
      })
    })
    expect(screen.getByText(/AliExpress, eBay returned nothing for this search\./)).toBeTruthy()
  })
})
