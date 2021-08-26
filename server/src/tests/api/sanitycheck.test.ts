/* eslint-disable jest/no-conditional-expect */
import request from 'supertest'
import App from '../../app'
import { env } from '../../env'
import TestDbHelper from '../../utils/testDbHelper'

const dbHelper = new TestDbHelper()

beforeAll(async () => {
  await dbHelper.start()
})
afterEach(() => dbHelper.cleanup())
afterAll(() => dbHelper.stop())

describe('Api Sanity check', () => {
  it('should return the api name and version', (done) => {
    const app = new App(env, [])

    return request(app.getServer())
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.name).toBe('Spotify Liked API')
        expect(response.body.version).toBe('v1')
        done()
      })
      .catch((err) => done(err))
  })
})
