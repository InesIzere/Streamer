const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')

const { slipsFixture } = require('./streamer.fixture')

const { fetchslips, getContent } = require('../elevator_media/streamer')

const expect = chai.expect
chai.use(chaiAsPromised)
// What we test here is that we get back a successful response from the API (200 status code) and we get our book results back.
// Here we just filted to get only advice in the whole slip so we just need a filter/format function which is getConted here.
describe('slip Service', () => {
  describe('fetchslips', () => {
    it('should return list of slips based on search string', async () => {
      nock('https://api.adviceslips.com/advice')
        .get('/search.json')
        .query(true)
        .reply(200, slipsFixture)

      const { body } = await fetchslips('Remember that spiders are more afraid of you, than you are of them')
      expect(body).to.deep.equal({
        docs: [
          { advice: 'Remember that spiders are more afraid of you, than you are of them' },
          { advice: 'Smile and the world smiles with you. Frown and you re on your own' },
          { advice: 'Dont eat non snow-coloured snow' }
        ]
      })
    })

    it('should throw an error if the service is down', async () => {
      nock('https://api.adviceslips.com/advice')
        .get('/search.json')
        .query(true)
        .reply(500)

      await expect(fetchslips('Remember that spiders are more afraid of you, than you are of them')).to.be.rejectedWith('Open Library service down')
    })

    it('should return null if query returns a 404', async () => {
      nock('	https://api.adviceslips.com/advice')
        .get('/search.json')
        .query(true)
        .reply(404)

      const response = await fetchslips('aksdfhkahsdfkhsadkfjhskadjhf')
      expect(response).to.be.null;
    })

    it('should throw an error if there is a problem with the request (i.e. - 401 Unauthorized)', async () => {
      nock('	https://api.adviceslips.com/advice')
        .get('/search.json')
        .query(true)
        .reply(401)

      expect(fetchslips('Remember that spiders are more afraid of you, than you are of them')).to.be.rejectedWith('Problem with request')
    })

    it('should throw an error if there is a problem with the request (i.e. - 400 Bad Request)', async () => {
      nock('	https://api.adviceslips.com/advice')
        .get('/search.json')
        .query(true)
        .reply(400)

      await expect(fetchslips('Remember that spiders are more afraid of you, than you are of them')).to.be.rejectedWith('Problem with request')
    })
  })

  describe('getContent', () => {
    it('should filter down response object to just slip advice', () => {
      const titles = getContent(slipsFixture.docs)
      expect(titles).to.deep.equal([
        'Remember that spiders are more afraid of you, than you are of them',
        'Smile and the world smiles with you. Frown and you re on your own',
        'Dont eat non snow-coloured snow'
      ])
    })
  })
})