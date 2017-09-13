const should = require('should')
const sinon = require('sinon')
const search = require(__dirname + '/../../../dadi/lib/search')
const model = require(__dirname + '/../../../dadi/lib/model')
const config = require(__dirname + '/../../../config')
const help = require(__dirname + '/../help')
const store = require(config.get('search.datastore'))

let mod
let searchInstance

describe('Search', () => {
  before(done => {
    done()
  })

  beforeEach(done => {
    mod = model('testSearchModel', help.getSearchModelSchema(), null, { database: 'testdb' })
    searchInstance = search(mod)
    done()
  })

  afterEach(done => {
    done()
  })

  it('should export constructor', done => {
    search.Search.should.be.Function
    done()
  })

  it('should export a function that returns an instance', done => {
      searchInstance.should.be.an.instanceOf(search.Search)
      done()
  })

  it('should throw an error if model is incorrect type', done => {
      search.should.throw()
      done()
  })

  describe('`initialiseConnections` method', () => {
    it('should initialise required connections', done => {
      searchInstance.initialiseConnections()

      should.exist(searchInstance.wordConnection.db)
      should.exist(searchInstance.searchConnection)

      searchInstance.wordConnection.db.config.hosts[0].host.should.equal('127.0.0.1')
      searchInstance.wordConnection.db.config.hosts[0].port.should.equal(27017)
      searchInstance.searchConnection.db.config.hosts[0].host.should.equal('127.0.0.1')
      searchInstance.searchConnection.db.config.hosts[0].port.should.equal(27017)

      done()
    })
  })

  describe('`applyIndexListeners` method', () => {
    it('should call database index method once connection is established', done => {
      mod = model('testModelNew', help.getModelSchema(), null, { database: 'testdb' })
      const dbIndexStub = sinon.spy(store.prototype, 'index')

      searchInstance = search(mod)

      setTimeout(() => {
        dbIndexStub.called.should.be.true
        dbIndexStub.lastCall.args[0].should.eql('testModelNewSearch')
        dbIndexStub.lastCall.args[1].should.be.Object
        dbIndexStub.restore()

        done()
      }, 1000)
    })
  })

  describe('`getIndexableFields` method', () => {
    it('should return an object', done => {
      searchInstance.getIndexableFields().should.be.Object
      done()
    })

    it('should return an object containing only indexable fields', done => {
      searchInstance.getIndexableFields().should.be.an.instanceOf(Object).and.have.property('searchableFieldName', {weight: 2})
      searchInstance.getIndexableFields().should.not.have.property('fieldName')
      searchInstance.getIndexableFields().should.not.have.property('invalidSearchableFieldName')
      done()
    })
  })

  describe('`hasSeachField` method', () => {
    it('should return false if a field is invalid', done => {
      searchInstance.hasSearchField().should.be.false
      done()
    })

    it('should return false if a field does not contain a valid search parameter', done => {
      searchInstance.hasSearchField({search: 'foo'}).should.be.false
      done()
    })

    it('should return true if a field has a valid search and search weight parameter', done => {
      searchInstance.hasSearchField({search: {weight: 2}}).should.be.true
      done()
    })
  })

  describe('`getWordSchema` method', () => {
    it('should return an object', done => {
      const schema = searchInstance.getWordSchema()
      schema.should.be.Object
      done()
    })
  })

  describe('`getSearchSchema` method', () => {
    it('should return an object', done => {
      const schema = searchInstance.getSearchSchema()
      schema.should.be.Object
      done()
    })
  })
})

// initialiseConnections [complete]
// applyIndexListeners [complete]
// getIndexableFields [complete]
// hasSearchField [complete]
// find
// getWords
// getInstancesOfWords
// getWordSchema [complete]
// getSearchSchema [complete]
// delete
// index
// removeNonIndexableFields
// indexDocument
// analyseDocumentWords
// createWordInstanceInsertQuery
// clearAndInsertWordInstances
// insertWordInstances
// runFind
// clearDocumentInstances
// insert
// batchIndex
// runBatchIndex
