// in our fake data, instead of taking the whole jason from advice site, we only reproduce a subset of it. This gives us enough data to test what we need without having to clutter up our tests.

const slipsFixture = {
  docs: [
    { advice: 'Remember that spiders are more afraid of you, than you are of them' },
    { advice: 'Smile and the world smiles with you. Frown and you re on your own' },
    { advice: 'Dont eat non snow-coloured snow' }
  ]
}

module.exports = {
  slipsFixture
}