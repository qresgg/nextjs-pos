export default class PinManager {
  private maxLength: number

  constructor(maxLength = 6) {
    this.maxLength = maxLength
  }

  addNumber(numbers: number[], num: number): number[] {
    if (numbers.length < this.maxLength) {
      return [...numbers, num]
    }
    return numbers
  }

  removeLast(numbers: number[]): number[] {
    return numbers.slice(0, -1)
  }

  deleteAll(): number[] {
    return []
  }
}
