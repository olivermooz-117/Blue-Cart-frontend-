import { describe, it, expect } from 'vitest'
import searchReducer from '../../store/searchSlice'

describe('searchSlice', () => {
  const initialState = {
    query: '',
    results: [],
    allResults: [],
    status: 'idle',
    error: null,
  }

  it('should handle initial state', () => {
    expect(searchReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle runSearch pending', () => {
    const actual = searchReducer(initialState, { type: 'search/runSearch/pending' })
    expect(actual.status).toBe('loading')
    expect(actual.error).toBe(null)
  })

  it('should handle runSearch fulfilled', () => {
    const payload = { 
      query: 'Samsung', 
      results: [{ id: '1', name: 'Samsung A51' }] 
    }
    const actual = searchReducer(initialState, { 
      type: 'search/runSearch/fulfilled', 
      payload 
    })
    expect(actual.query).toBe('Samsung')
    expect(actual.results).toEqual(payload.results)
    expect(actual.allResults).toEqual(payload.results)
    expect(actual.status).toBe('succeeded')
  })

  it('should handle runSearch rejected', () => {
    const actual = searchReducer(initialState, { 
      type: 'search/runSearch/rejected', 
      error: { message: 'Network error' }
    })
    expect(actual.status).toBe('failed')
    expect(actual.error).toBe('Network error')
  })

  it('should handle rerankResults fulfilled', () => {
    const stateWithResults = {
      ...initialState,
      results: [{ id: '1', name: 'Product A' }, { id: '2', name: 'Product B' }],
      allResults: [{ id: '1', name: 'Product A' }, { id: '2', name: 'Product B' }],
    }
    const reranked = [{ id: '2', name: 'Product B' }, { id: '1', name: 'Product A' }]
    const actual = searchReducer(stateWithResults, { 
      type: 'search/rerankResults/fulfilled', 
      payload: reranked 
    })
    expect(actual.results).toEqual(reranked)
  })
})
