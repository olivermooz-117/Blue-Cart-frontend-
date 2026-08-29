import { describe, it, expect } from 'vitest'

describe('Pages', () => {
  it('should import LandingPage', async () => {
    const LandingPage = await import('../../pages/LandingPage.jsx')
    expect(LandingPage.default).toBeDefined()
  })

  it('should import SearchPage', async () => {
    const SearchPage = await import('../../pages/SearchPage.jsx')
    expect(SearchPage.default).toBeDefined()
  })

  it('should import AuthPage', async () => {
    const AuthPage = await import('../../pages/AuthPage.jsx')
    expect(AuthPage.default).toBeDefined()
  })

  it('should import HistoryPage', async () => {
    const HistoryPage = await import('../../pages/HistoryPage.jsx')
    expect(HistoryPage.default).toBeDefined()
  })
})
