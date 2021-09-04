export const chunk: <T>(array: T[], size: number) => T[][] = (array, size) => {
  if (array.length === 0) {
    return []
  }
  const chunkedArr = []
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size))
  }
  return chunkedArr
}

export const asyncForEach: <T>(
  array: T[],
  callback: (item: T, index?: number, array?: T[]) => Promise<void>
) => Promise<void> = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array)
  }
}
