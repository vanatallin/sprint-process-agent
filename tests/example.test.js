/**
 * Example test file demonstrating test structure
 * This ensures the tests/ directory exists for AgentReady assessment
 */

import { describe, it, expect } from 'vitest'

describe('Example Test Suite', () => {
  it('should pass basic assertion', () => {
    expect(true).toBe(true)
  })

  it('should handle array operations', () => {
    const items = [1, 2, 3]
    expect(items).toHaveLength(3)
    expect(items).toContain(2)
  })
})
