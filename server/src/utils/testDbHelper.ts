/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongooseConfig from '../config/mongoose.config'

export default class TestDbHelper {
  db: any

  server: any

  connection: any

  constructor() {
    this.db = null
    this.server = new MongoMemoryServer({
      binary: {
        version: '4.4.1'
      }
    })
    this.connection = null
  }

  /**
   * Start the server and establish a connection
   */
  async start() {
    const uri = await this.server.getUri()
    const mongooseOpts = {
      ...mongooseConfig
    }
    if (mongoose.connection) await mongoose.connection.close()
    await mongoose.connect(uri, mongooseOpts)
  }

  /**
   * Close the connection and stop the server
   */
  async stop() {
    await mongoose.connection.close()
    return this.server.stop()
  }

  /**
   * Delete all collections and indexes
   */
  async cleanup() {
    const { collections } = mongoose.connection
    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany({})
    }
  }
}
