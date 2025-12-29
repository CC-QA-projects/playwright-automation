import { test, expect } from '@playwright/test';
import { bookingTestData } from './test-data.js';

// Use only the "Minimum required fields" dataset from bookingTestData
const minRequiredPayload = bookingTestData.find(d => d.name === 'Minimum required fields') || bookingTestData[0]; 


test('POST /booking - Minimum required fields', async ({ request }) => {
  const payload = minRequiredPayload.payload;

  // Send POST request. If you have `baseURL` configured in your API project, use a relative path like '/booking'.
  const response = await request.post('/booking', { data: payload });

  // Assert expected status
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  
  //Parse and validate response body
    const body = await response.json();
    if (payload.firstname) expect(body.booking.firstname).toBe(payload.firstname);
    if (payload.lastname) expect(body.booking.lastname).toBe(payload.lastname); 
    console.log('POST /booking response body:', body);
    console.log('Created booking ID:', body.bookingid);
    console.log('firstname and langname in response:', body.booking.firstname ,' ', body.booking.lastname);
});
