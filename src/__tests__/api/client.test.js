import { describe, it, expect, vi, beforeEach } from 'vitest'

const captured = vi.hoisted(() => ({ rejected: undefined }))

vi.mock('axios', () => {
  const instance = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: (fulfilled, rejected) => { captured.rejected = rejected } },
    },
  }
  return {
    default: { create: vi.fn(() => instance) },
    create: vi.fn(() => instance),
  }
})

import client, { getErrorMessage, setUnauthorizedHandler } from '../../api/client'

beforeEach(() => {
  localStorage.clear()
})

describe('getErrorMessage', () => {
  it('returns the server error message', () => {
    expect(getErrorMessage({ response: { data: { error: 'boom' } } }, 'fallback')).toBe('boom')
  })

  it('returns the 429 message when there is no server message', () => {
    expect(getErrorMessage({ response: { status: 429 } }, 'fallback')).toBe(
      'Too many requests. Please wait a minute and try again.'
    )
  })

  it('returns the wake-up message for a timeout', () => {
    expect(getErrorMessage({ code: 'ECONNABORTED' }, 'fallback')).toBe(
      'The server is waking up or unreachable. Please try again in a moment.'
    )
  })

  it('returns the wake-up message when there is no response', () => {
    expect(getErrorMessage({}, 'fallback')).toBe(
      'The server is waking up or unreachable. Please try again in a moment.'
    )
  })

  it('falls back to the fallback otherwise', () => {
    expect(getErrorMessage({ response: { status: 500 } }, 'fallback')).toBe('fallback')
  })
})

describe('401 unauthorised handler', () => {
  it('calls the registered handler for a 401 on a protected URL', async () => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)
    await expect(
      captured.rejected({ response: { status: 401 }, config: { url: '/history' } })
    ).rejects.toMatchObject({ response: { status: 401 } })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call the handler for a 401 on /auth/login', async () => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)
    await expect(
      captured.rejected({ response: { status: 401 }, config: { url: '/auth/login' } })
    ).rejects.toMatchObject({ response: { status: 401 } })
    expect(handler).not.toHaveBeenCalled()
  })

  it('does not call the handler for a 401 on /auth/register', async () => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)
    await expect(
      captured.rejected({ response: { status: 401 }, config: { url: '/auth/register' } })
    ).rejects.toMatchObject({ response: { status: 401 } })
    expect(handler).not.toHaveBeenCalled()
  })

  it('exports a default axios client', () => {
    expect(client).toBeDefined()
    expect(client.interceptors).toBeDefined()
  })
})
