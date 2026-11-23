import { describe, it, expect } from 'vitest'
import searchReducer from '../../store/searchSlice'

describe('searchSlice', () => {
  const initialState = {
    query: '',
    results: [],
    allResults: [],
    sites: [],
    status: 'idle',
    error: null,
    currentRequestId: undefined,
    reranking: false,
    rerankError: null,
  }

  it('should handle initial state', () => {
    expect(searchReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle runSearch pending', () => {
    const actual = searchReducer(initialState, { type: 'search/runSearch/pending', meta: { requestId: 'req-1' } })
    expect(actual.status).toBe('loading')
    expect(actual.error).toBe(null)
    expect(actual.currentRequestId).toBe('req-1')
  })

  it('should handle runSearch fulfilled', () => {
    const payload = {
      query: 'Samsung',
      results: [{ id: '1', name: 'Samsung A51' }],
      sites: ['Amazon', 'eBay']
    }
    const stateWithRequest = { ...initialState, currentRequestId: 'req-1' }
    const actual = searchReducer(stateWithRequest, {
      type: 'search/runSearch/fulfilled',
      payload,
      meta: { requestId: 'req-1' }
    })
    expect(actual.query).toBe('Samsung')
    expect(actual.results).toEqual(payload.results)
    expect(actual.allResults).toEqual(payload.results)
    expect(actual.sites).toEqual(['Amazon', 'eBay'])
    expect(actual.status).toBe('succeeded')
    expect(actual.currentRequestId).toBeUndefined()
  })

  it('should ignore a stale fulfilled action', () => {
    const stateWithRequest = { ...initialState, currentRequestId: 'req-1', results: [{ id: '1', name: 'Stale' }] }
    const actual = searchReducer(stateWithRequest, {
      type: 'search/runSearch/fulfilled',
      payload: { query: 'Samsung', results: [{ id: '2', name: 'Fresh' }] },
      meta: { requestId: 'req-2' }
    })
    expect(actual.results).toEqual([{ id: '1', name: 'Stale' }])
    expect(actual.status).toBe('idle')
  })

  it('should handle runSearch rejected', () => {
    const stateWithRequest = { ...initialState, currentRequestId: 'req-1' }
    const actual = searchReducer(stateWithRequest, {
      type: 'search/runSearch/rejected',
      payload: 'Server is busy',
      meta: { requestId: 'req-1' }
    })
    expect(actual.status).toBe('failed')
    expect(actual.error).toBe('Server is busy')
    expect(actual.currentRequestId).toBeUndefined()
  })

  it('should ignore a stale rejected action', () => {
    const stateWithRequest = { ...initialState, currentRequestId: 'req-1', status: 'loading' }
    const actual = searchReducer(stateWithRequest, {
      type: 'search/runSearch/rejected',
      payload: 'Server is busy',
      meta: { requestId: 'req-2' }
    })
    expect(actual.status).toBe('loading')
    expect(actual.error).toBe(null)
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
    expect(actual.reranking).toBe(false)
    expect(actual.rerankError).toBe(null)
  })

  it('should handle rerankResults pending', () => {
    const actual = searchReducer(initialState, { type: 'search/rerankResults/pending' })
    expect(actual.reranking).toBe(true)
    expect(actual.rerankError).toBe(null)
  })

  it('should handle rerankResults rejected', () => {
    const actual = searchReducer(initialState, {
      type: 'search/rerankResults/rejected',
      payload: 'Rerank failed'
    })
    expect(actual.reranking).toBe(false)
    expect(actual.rerankError).toBe('Rerank failed')
  })
})
