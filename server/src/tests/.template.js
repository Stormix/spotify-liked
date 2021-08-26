import TestDbHelper from "../utils/testDbHelper";

const dbHelper = new TestDbHelper();

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHelper.start());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHelper.cleanup());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHelper.stop());
