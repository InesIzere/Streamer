const request = require('superagent')

const fetchslips = async (query) => {
  let response

  try {
    response = await request
      .get('https://api.adviceslips.com/advice/search.json')
      .query({ q: query }) // query string
  } catch (e) {
    response = e.status
  }
// If the API is up, but our search returns nothing, we'll get a 404 response code from the API. 
  if (response === 404) return null
  // When the API is down, my code handle it like this
  if (response === 500) throw new Error('Open Library service down')
  // There are several things that could be wrong with our request:
  // We could have accidentally forgotten to add the query string
  // We could have a bad character in the query
  // We could be missing the appropriate authentication tokens/headers
  // Fortunately, the Open Library API does not require any authentication tokens. It's... well... "open".
  if (response >= 400) throw new Error('Problem with request')
  else return response
}

const getContent = (searchResults) => {
  return searchResults.map(({ advice }) => advice)
}

module.exports = {
  fetchslips,
  getContent
}