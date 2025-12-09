import { test, expect } from '@playwright/test';
import { validBookingData, invalidBookingData, updateBookingData } from './bookingTestData';

test.describe('API Data Driven Tests', () => {
    let authToken;

    test.beforeAll(async ({ request }) => {
        // Get authentication token
        const authResponse = await request.post('/auth', {
            data: {
                username: "admin",
                password: "password123"
            }
        });
        const authData = await authResponse.json();
        authToken = authData.token;
    });

    // 1. POST Tests with Valid Data
    test.describe.only('POST - Create Booking with Valid Data', () => {
        for (const testCase of validBookingData) {
            test(`Success: ${testCase.testName}`, async ({ request }) => {
                const response = await request.post('/booking', {
                    data: testCase.payload
                });

                // Verify successful response
                expect(response.status()).toBe(200);
                expect(response.headers()['content-type']).toContain('application/json');

                // Verify response structure and data
                const responseBody = await response.json();
                expect(responseBody).toHaveProperty('bookingid');
                expect(responseBody).toHaveProperty('booking');
                expect(responseBody.booking).toMatchObject(testCase.payload);

                // Store booking ID for cleanup if needed
                const bookingId = responseBody.bookingid;
                console.log(`Created booking ID: ${bookingId} for test: ${testCase.testName}`);
            });
        }
    });

    // 2. POST Tests with Invalid Data
    test.describe('POST - Create Booking with Invalid Data', () => {
        for (const testCase of invalidBookingData) {
            test(`Failure: ${testCase.testName}`, async ({ request }) => {
                const response = await request.post('/booking', {
                    data: testCase.payload
                });

                expect(response.status()).toBe(testCase.expectedError);
            });
        }
    });

    // 3. GET Tests
    test.describe('GET - Retrieve Booking', () => {
        let testBookingId;

        test.beforeAll(async ({ request }) => {
            // Create a test booking
            const response = await request.post('/booking', {
                data: validBookingData[0].payload
            });
            const responseBody = await response.json();
            testBookingId = responseBody.bookingid;
        });

        test('Success: Retrieve existing booking', async ({ request }) => {
            const response = await request.get(`/booking/${testBookingId}`);
            
            expect(response.status()).toBe(200);
            expect(response.headers()['content-type']).toContain('application/json');
            
            const booking = await response.json();
            expect(booking).toMatchObject(validBookingData[0].payload);
        });

        test('Failure: Retrieve non-existent booking', async ({ request }) => {
            const response = await request.get('/booking/999999999');
            expect(response.status()).toBe(404);
        });
    });

    // 4. PATCH Tests
    test.describe('PATCH - Update Booking', () => {
        let testBookingId;

        test.beforeEach(async ({ request }) => {
            // Create a test booking
            const response = await request.post('/booking', {
                data: validBookingData[0].payload
            });
            const responseBody = await response.json();
            testBookingId = responseBody.bookingid;
        });

        for (const testCase of updateBookingData) {
            test(`Success: ${testCase.testName}`, async ({ request }) => {
                const response = await request.patch(`/booking/${testBookingId}`, {
                    headers: {
                        'Cookie': `token=${authToken}`
                    },
                    data: testCase.payload
                });

                expect(response.status()).toBe(200);
                const updatedBooking = await response.json();
                
                // Verify updated fields
                expect(updatedBooking).toMatchObject(testCase.payload);
                
                // Verify original fields remain unchanged
                const originalData = validBookingData[0].payload;
                for (const key in originalData) {
                    if (!testCase.payload.hasOwnProperty(key)) {
                        expect(updatedBooking[key]).toEqual(originalData[key]);
                    }
                }
            });
        }
    });

    // 5. DELETE Tests
    test.describe('DELETE - Remove Booking', () => {
        let testBookingId;

        test.beforeEach(async ({ request }) => {
            // Create a test booking
            const response = await request.post('/booking', {
                data: validBookingData[0].payload
            });
            const responseBody = await response.json();
            testBookingId = responseBody.bookingid;
        });

        test('Success: Delete existing booking', async ({ request }) => {
            // Delete booking
            const deleteResponse = await request.delete(`/booking/${testBookingId}`, {
                headers: {
                    'Cookie': `token=${authToken}`
                }
            });
            expect(deleteResponse.status()).toBe(201);

            // Verify booking is deleted
            const getResponse = await request.get(`/booking/${testBookingId}`);
            expect(getResponse.status()).toBe(404);
        });

        test('Failure: Delete non-existent booking', async ({ request }) => {
            const response = await request.delete('/booking/999999999', {
                headers: {
                    'Cookie': `token=${authToken}`
                }
            });
            expect(response.status()).toBe(405);
        });
    });
});