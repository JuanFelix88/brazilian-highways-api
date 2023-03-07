import { describe, expect, it } from 'vitest'
import keypointersHandler from './keypointers'

describe('Test for highways keypointers controller', () => {
  it("should be resolve all dependency's injection", () => {
    expect(keypointersHandler).toBeTruthy()
  })
})
