export const QUERY = 'QUERY'
export const FILTER = 'FILTER'
export const DATA = 'DATA'
export const DATA_RANGE = 'DATA_RANGE'
export const CURRENT_LOCATION = 'CURRENT_LOCATION'

export function setQuery(q) {
  return {
    type: QUERY,
    q: q
  }
}

export function setFilter(filter) {
  return {
    type: FILTER,
    filter: filter
  }
}

export function setData(data) {
  return {
    type: DATA,
    data: data
  }
}

export function setDataRange(dataRange) {
  return {
    type: DATA_RANGE,
    dataRange: dataRange
  }
}

export function setCurrentLocation(currentLocation) {
  return {
    type: CURRENT_LOCATION,
    currentLocation: currentLocation
  }
}