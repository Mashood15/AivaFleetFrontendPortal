export const truncateString = (string, length) => {
  let result = ''
  const stringLength = string?.length
  if (stringLength > length) {
    result = `${string.slice(0, length)}...`
    return result
  } else {
    result = string
    return result
  }
}
