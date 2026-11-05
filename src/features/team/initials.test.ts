import { describe, expect, it } from 'vitest'
import { initials } from './initials'

describe('initials', () => {
  it.each([
    ['Mina Park', 'MP'],
    ['  theo   grant  ', 'TG'],
    ['ana', 'A'],
    ['Mary Ann Doe', 'MA'],
    ['Jae\tKim', 'JK'],
    ['김 민수', '김민'],
    ['   ', ''],
  ])('formats %j as %j', (name, expected) => {
    expect(initials(name)).toBe(expected)
  })
})
