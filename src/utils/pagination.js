module.exports.get = (data, offset = 0, limit = 10) => {
  if (!data || data.length < 1) return data
  return data.slice(offset * limit, (offset + 1) * limit)
}
