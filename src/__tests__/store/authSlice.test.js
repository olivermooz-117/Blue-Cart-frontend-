import { describe, it, expect } from 'vitest'
import authReducer, { logout } from '../../store/authSlice'

describe('authSlice', () => {
  const initialState = {
    email: null,
    token: null,
    status: 'idle',
    error: null,
    expired: false,
  }

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle login pending', () => {
    const actual = authReducer(initialState, { type: 'auth/login/pending' })
    expect(actual.status).toBe('loading')
    expect(actual.error).toBe(null)
  })

  it('should handle login fulfilled', () => {
    const payload = { email: 'test@email.com', access_token: 'test-token' }
    const actual = authReducer(initialState, { 
      type: 'auth/login/fulfilled', 
      payload 
    })
    expect(actual.email).toBe('test@email.com')
    expect(actual.token).toBe('test-token')
    expect(actual.status).toBe('succeeded')
  })

  it('should handle login rejected with server message', () => {
    const actual = authReducer(initialState, {
      type: 'auth/login/rejected',
      payload: 'Invalid email or password',
    })
    expect(actual.status).toBe('failed')
    expect(actual.error).toBe('Invalid email or password')
  })

  it('should handle login rejected without payload', () => {
    const actual = authReducer(initialState, {
      type: 'auth/login/rejected',
      error: { message: 'Network error' },
    })
    expect(actual.status).toBe('failed')
    expect(actual.error).toBe('Network error')
  })

  it('should handle logout', () => {
    const loggedInState = {
      email: 'test@email.com',
      token: 'test-token',
      status: 'succeeded',
      error: null,
    }
    const actual = authReducer(loggedInState, logout())
    expect(actual.email).toBe(null)
    expect(actual.token).toBe(null)
    // Note: logout doesn't reset status in your slice, so we expect it to stay 'succeeded'
    // If you want to change this, update your slice
    expect(actual.status).toBe('succeeded')
    expect(actual.error).toBe(null)
  })
})
