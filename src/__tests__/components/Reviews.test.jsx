import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../../store/authSlice'
import filtersReducer from '../../store/filtersSlice'
import historyReducer from '../../store/historySlice'
import reviewsReducer from '../../store/reviewsSlice'
import searchReducer from '../../store/searchSlice'
import Reviews from '../../components/Reviews'

const get = vi.hoisted(() => vi.fn())
const post = vi.hoisted(() => vi.fn())

vi.mock('../../api/client', () => ({
  default: {
    get,
    post,
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
  getErrorMessage: (err, fallback) =>
    err?.response?.data?.error ? err.response.data.error : fallback,
  get,
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
  const store = options.store || makeStore()
  return {
    store,
    ...render(
      <Provider store={store}>
        {ui}
      </Provider>
    ),
  }
}

beforeEach(() => {
  get.mockReset()
  post.mockReset()
})

describe('Reviews', () => {
  it('renders the form when fetchReviews fails', async () => {
    get.mockRejectedValueOnce({ response: { data: { error: 'reviews service down' } } })
    renderWithProviders(<Reviews query="Samsung" />)
    await waitFor(() =>
      expect(screen.queryByText(/Reviews couldn’t load right now/)).toBeTruthy()
    )
    expect(screen.getByText(/Submit review/)).toBeTruthy()
  })

  it('shows the server message on failed submit, keeps typed text, and does not confetti', async () => {
    get.mockResolvedValueOnce({ data: { reviews: [] } })
    post.mockRejectedValueOnce({ response: { data: { error: 'too many reviews' } } })
    renderWithProviders(<Reviews query="Samsung" />)
    await waitFor(() => expect(screen.queryByText(/Submit review/)).toBeTruthy())

    fireEvent.change(screen.getByPlaceholderText(/e.g. Amazon, eBay…/), {
      target: { value: 'Amazon' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Share your experience/), {
      target: { value: 'A great shop' },
    })
    fireEvent.change(screen.getByPlaceholderText('Your name'), {
      target: { value: 'buyer' },
    })

    act(() => {
      fireEvent.submit(screen.getByText(/Submit review/).closest('form'))
    })
    await waitFor(() => expect(screen.getByText(/too many reviews/)).toBeTruthy())
    expect(screen.getByPlaceholderText(/Share your experience/).value).toBe('A great shop')
    expect(screen.getByPlaceholderText('Your name').value).toBe('buyer')
    expect(document.querySelector('.confetti')).toBeNull()
  })

  it('clears the form and shows the new review on successful submit', async () => {
    get.mockResolvedValueOnce({ data: { reviews: [] } })
    post.mockResolvedValueOnce({
      data: {
        id: 'r1',
        query: 'Samsung',
        shop: 'Amazon',
        author: 'buyer',
        comment: 'A great shop',
        rating: 5,
        created_at: '2026-01-01',
      },
    })
    renderWithProviders(<Reviews query="Samsung" />)
    await waitFor(() => expect(screen.queryByText(/Submit review/)).toBeTruthy())

    fireEvent.change(screen.getByPlaceholderText(/e.g. Amazon, eBay…/), {
      target: { value: 'Amazon' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Share your experience/), {
      target: { value: 'A great shop' },
    })
    fireEvent.change(screen.getByPlaceholderText('Your name'), {
      target: { value: 'buyer' },
    })

    act(() => {
      fireEvent.submit(screen.getByText(/Submit review/).closest('form'))
    })
    await waitFor(() => expect(screen.getByText(/A great shop/)).toBeTruthy())
    expect(screen.getByPlaceholderText('Your name').value).toBe('buyer')
    expect(screen.getByPlaceholderText(/Share your experience/).value).toBe('')
    expect(document.querySelector('.confetti')).toBeTruthy()
  })

  it('pre-fills the author with the email local part, not the full email', async () => {
    get.mockResolvedValueOnce({ data: { reviews: [] } })
    const store = makeStore()
    store.dispatch({
      type: 'auth/login/fulfilled',
      payload: { email: 'buyer@example.com', access_token: 'tok' },
    })
    renderWithProviders(<Reviews query="Samsung" />, { store })
    await waitFor(() => expect(screen.getByPlaceholderText('Your name')).toBeTruthy())
    expect(screen.getByPlaceholderText('Your name').value).toBe('buyer')
    expect(screen.getByPlaceholderText('Your name').value).not.toBe('buyer@example.com')
  })
})
