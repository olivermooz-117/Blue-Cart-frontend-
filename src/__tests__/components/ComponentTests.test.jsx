import { describe, it, expect } from 'vitest'

describe('Components', () => {
  it('should import Navbar component', async () => {
    const Navbar = await import('../../components/Navbar.jsx')
    expect(Navbar.default).toBeDefined()
  })

  it('should import SearchBar component', async () => {
    const SearchBar = await import('../../components/SearchBar.jsx')
    expect(SearchBar.default).toBeDefined()
  })

  it('should import ProductCard component', async () => {
    const ProductCard = await import('../../components/ProductCard.jsx')
    expect(ProductCard.default).toBeDefined()
  })

  it('should import FilterPanel component', async () => {
    const FilterPanel = await import('../../components/FilterPanel.jsx')
    expect(FilterPanel.default).toBeDefined()
  })
})
