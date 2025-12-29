// Import Playwright's test runner utilities.
// `test` is used to define tests and test suites.
// `expect` is the assertion library used to verify results.
import { test, expect } from '@playwright/test';

// Import test data objects from a separate module.
// These are arrays/objects you created in bookingTestData.js.
import { validBookingData, invalidBookingData, updateBookingData } from './bookingTestData';

test.describe('API Data Driven Tests', () => {

    // Variable to hold the authentication token we’ll get before running tests.
    let authToken;

    // beforeAll runs ONCE before all the tests inside this describe block.
    // It’s useful for setup like logging in or creating shared data.
    test.beforeAll(async ({ request }) => {
        // Send a POST request to /auth to get an auth token.
        // `request` is Playwright's APIRequestContext for making HTTP calls.
        const authResponse = await request.post('/auth', {
            // Body of the POST request (JSON by default)
            data: {
                username: "admin",
                password: "password123"
            }
        });

        // Parse the JSON response body into a JS object.
        const authData = await authResponse.json();

        // Save the token into the outer variable so other tests can use it.
        authToken = authData.token;
    });

    // -----------------------------
    // 1. POST Tests with Valid Data
    // -----------------------------

    // Another describe block, but with `.only` so ONLY this block runs.
    // (Useful during debugging – remove `.only` to run everything again.)
    test.describe.only('POST - Create Booking with Valid Data', () => {

        // Loop over each test case in the `validBookingData` array.
        // Each `testCase` is expected to have: { testName, payload }
        for (const testCase of validBookingData) {

            // Dynamically create one test per data row.
            // The test name includes `testCase.testName` for clarity.
            test(`Success: ${testCase.testName}`, async ({ request }) => {

                // Send a POST request to /booking using the test case payload.
                const response = await request.post('/booking', {
                    data: testCase.payload
                });

                // ---- Assertions on the HTTP response ----

                // Check that the HTTP status code is 200 (OK).
                expect(response.status()).toBe(200);

                // Check that the Content-Type header contains 'application/json'.
                expect(response.headers()['content-type']).toContain('application/json');

                // Parse the response body as JSON.
                const responseBody = await response.json();

                // Expect the response JSON to have a property called 'bookingid'.
                expect(responseBody).toHaveProperty('bookingid');

                // Expect the response JSON to have a property called 'booking'.
                expect(responseBody).toHaveProperty('booking');

                // Check that the 'booking' object in the response matches
                // the payload we sent (same fields/values).
                expect(responseBody.booking).toMatchObject(testCase.payload);

                // Extract the booking ID (for logging or future cleanup).
                const bookingId = responseBody.bookingid;

                // Log the created booking ID to the console for debugging.
                console.log(`Created booking ID: ${bookingId} for test: ${testCase.testName}`);
            });
        }
    });

    // --------------------------------
    // 2. POST Tests with Invalid Data
    // --------------------------------

    test.describe('POST - Create Booking with Invalid Data', () => {

        // Loop through each invalid test case.
        for (const testCase of invalidBookingData) {

            // Again, dynamically create a test per invalid data row.
            test(`Failure: ${testCase.testName}`, async ({ request }) => {

                // Send a POST request with invalid payload.
                const response = await request.post('/booking', {
                    data: testCase.payload
                });

                // For invalid data, we just check that the status code matches
                // the expected error code defined in the test data.
                expect(response.status()).toBe(testCase.expectedError);
            });
        }
    });

    // --------------
    // 3. GET Tests
    // --------------

    test.describe('GET - Retrieve Booking', () => {
        // Variable to store the booking ID we will create for GET tests.
        let testBookingId;

        // beforeAll runs ONCE for this describe block.
        test.beforeAll(async ({ request }) => {
            // Create a booking that we can later retrieve with GET.
            const response = await request.post('/booking', {
                // Use the first valid payload from the data set.
                data: validBookingData[0].payload
            });

            // Parse the response to get the booking ID.
            const responseBody = await response.json();
            testBookingId = responseBody.bookingid;
        });

        // Test for successfully retrieving an existing booking.
        test('Success: Retrieve existing booking', async ({ request }) => {
            // Send a GET request to /booking/{id}.
            const response = await request.get(`/booking/${testBookingId}`);

            // Assert status is 200 OK.
            expect(response.status()).toBe(200);

            // Assert response is JSON.
            expect(response.headers()['content-type']).toContain('application/json');

            // Parse JSON body.
            const booking = await response.json();

            // Verify the booking matches the original payload we used to create it.
            expect(booking).toMatchObject(validBookingData[0].payload);
        });

        // Test for trying to retrieve a booking that doesn’t exist.
        test('Failure: Retrieve non-existent booking', async ({ request }) => {
            // Request a booking ID that’s very unlikely to exist.
            const response = await request.get('/booking/999999999');

            // Expect a 404 Not Found.
            expect(response.status()).toBe(404);
        });
    });

    // -----------------
    // 4. PATCH Tests
    // -----------------

    test.describe('PATCH - Update Booking', () => {
        // Booking ID that will be created before each test.
        let testBookingId;

        // beforeEach runs BEFORE EVERY test in this describe block.
        test.beforeEach(async ({ request }) => {
            // Create a new booking to be updated by the test.
            const response = await request.post('/booking', {
                data: validBookingData[0].payload
            });

            // Extract the booking ID from the response.
            const responseBody = await response.json();
            testBookingId = responseBody.bookingid;
        });

        // Loop through each update test case in updateBookingData.
        for (const testCase of updateBookingData) {

            test(`Success: ${testCase.testName}`, async ({ request }) => {
                // Send a PATCH request to update partial fields of the booking.
                const response = await request.patch(`/booking/${testBookingId}`, {
                    // Auth header (cookie) using the token we got in beforeAll.
                    headers: {
                        'Cookie': `token=${authToken}`
                    },
                    // Payload with fields to update (could be partial).
                    data: testCase.payload
                });

                // PATCH should return 200 on success.
                expect(response.status()).toBe(200);

                // Parse the updated booking.
                const updatedBooking = await response.json();

                // Check that the fields we wanted to change match exactly.
                expect(updatedBooking).toMatchObject(testCase.payload);

                // Now verify that any fields we did NOT change stayed the same.
                // Start from the original valid payload.
                const originalData = validBookingData[0].payload;

                // Loop over every key in the original data.
                for (const key in originalData) {
                    // If this key was not part of the patch payload...
                    if (!testCase.payload.hasOwnProperty(key)) {
                        // ...then the value in the updated booking should still
                        // equal the original value.
                        expect(updatedBooking[key]).toEqual(originalData[key]);
                    }
                }
            });
        }
    });

    // ------------------
    // 5. DELETE Tests
    // ------------------

    test.describe('DELETE - Remove Booking', () => {
        // Booking ID to be created before each test.
        let testBookingId;

        // Create a fresh booking before each delete test.
        test.beforeEach(async ({ request }) => {
            const response = await request.post('/booking', {
                data: validBookingData[0].payload
            });
            const responseBody = await response.json();
            testBookingId = responseBody.bookingid;
        });

        // Test deleting an existing booking.
        test('Success: Delete existing booking', async ({ request }) => {
            // Perform the DELETE request with auth token.
            const deleteResponse = await request.delete(`/booking/${testBookingId}`, {
                headers: {
                    'Cookie': `token=${authToken}`
                }
            });

            // For this API, successful delete returns 201.
            expect(deleteResponse.status()).toBe(201);

            // Now try to GET the same booking to ensure it was actually deleted.
            const getResponse = await request.get(`/booking/${testBookingId}`);

            // Expect 404 Not Found after deletion.
            expect(getResponse.status()).toBe(404);
        });

        // Test deleting a booking that doesn't exist.
        test('Failure: Delete non-existent booking', async ({ request }) => {
            // Attempt to delete a fake ID.
            const response = await request.delete('/booking/999999999', {
                headers: {
                    'Cookie': `token=${authToken}`
                }
            });

            // For this API, deleting a non-existent booking returns 405.
            expect(response.status()).toBe(405);
        });
    });
});
