import {test, expect} from '@playwright/test'; 

test ('POST /booking for smoke test', async ({request}) => {
    const bookingPayload = {
    firstname: "Calvin",
    lastname: "Chan",
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: "2018-01-01",
      checkout: "2019-01-01"
    },
    additionalneeds: "Breakfast"
    };
    const response = await request.post ('/booking', {data: bookingPayload});
    expect (response.status()).toBe (200);
    expect (response.headers()['content-type']).toContain ('application/json'); 
    const responseBody = await response.json(); 
    console.log(responseBody); 
    expect(responseBody.booking.firstname).toBe ('Calvin');
    expect(responseBody.booking.lastname).toBe ('Chan');
    expect(responseBody.booking.bookingdates.checkin).toBe ('2018-01-01'); 
    const bookingId = responseBody.bookingid; 
    console.log('Booking ID:' + bookingId);

});


test('POST booking request and GET /booking for validation for smoke test', async ({ request }) => {
  const bookingPayload = {
    firstname: "Calvin",
    lastname: "Chan",
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: "2018-01-01",
      checkout: "2019-01-01"
    },
    additionalneeds: "Breakfast"
  };
  // Send POST request to create a booking
  const postResponse = await request.post('/booking', { data: bookingPayload });
  
  // Validate POST response status and content type
  expect(postResponse.status()).toBe(200);
  expect(postResponse.headers()['content-type']).toContain('application/json');

  // Parse response body and log it
  const responseBody = await postResponse.json();
  console.log(responseBody);

  // Validate POST response data
  expect(responseBody.booking.firstname).toBe('Calvin');
  expect(responseBody.booking.lastname).toBe('Chan');
  expect(responseBody.booking.bookingdates.checkin).toBe('2018-01-01');

  // Capture booking ID from the response
  const bookingId = responseBody.bookingid;
  console.log('Booking ID: ' + bookingId);

  // Send GET request to verify the booking was created successfully
  const getResponse = await request.get(`/booking/${bookingId}`);

  // Validate GET response status and headers
  expect(getResponse.status()).toBe(200);
  expect(getResponse.headers()['content-type']).toContain('application/json');

  // Parse GET response and verify booking details
  const getResponseBody = await getResponse.json();
  expect(getResponseBody.firstname).toBe('Calvin');
  expect(getResponseBody.lastname).toBe('Chan');
  expect(getResponseBody.bookingdates.checkin).toBe('2018-01-01');
}) 

test('Create Authentication Token and Perform POST, GET, PUT, PATCH and DELETE request for smoke test', async ({ request }) => {
  //Create Auth Token
  const authPayload = {
    username: "admin",
    password: "password123"
  };
  
  const authResponse = await request.post('/auth', { data: authPayload });
  expect (authResponse.status()).toBe (200);
  expect(authResponse.headers()['content-type']).toContain('application/json');

  const authResponseBody = await authResponse.json();
  console.log(authResponseBody);
  const token = authResponseBody.token; 

  //POST request to create a booking
  const bookingPayload ={
    firstname: "Calvin",
    lastname: "Chan",
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: "2025-01-01",
      checkout: "2025-01-03"
    },
    additionalneeds: "Breakfast"
  }

  const postResponse = await request.post('/booking', { headers: { 'Cookie': 'token=' + token }, data: bookingPayload });
  expect (postResponse.status()).toBe (200);
  expect(postResponse.headers()['content-type']).toContain('application/json'); 

  const responseBody = await postResponse.json(); 
  console.log(`POST response body ------------------------------`);
  console.log(responseBody); 
  expect(responseBody.booking.firstname).toBe ('Calvin');
  expect(responseBody.booking.lastname).toBe ('Chan');
  expect(responseBody.booking.bookingdates.checkin).toBe ('2025-01-01'); 

  const bookingId = responseBody.bookingid; 
  console.log('Booking ID:' + bookingId);

  //GET request to verify booking creation 

  const getResponse = await request.get('/booking/'+ bookingId ,  {headers: { 'Cookie': 'token=' + token }});
  expect (getResponse.status()).toBe (200);
  expect(getResponse.headers()['content-type']).toContain('application/json'); 

  const getResponseBody = await getResponse.json(); 
  console.log(`GET response body ------------------------------`);
  console.log(getResponseBody); 
  expect(getResponseBody.firstname).toBe ('Calvin');
  expect(getResponseBody.lastname).toBe ('Chan');
  expect(getResponseBody.bookingdates.checkin).toBe ('2025-01-01');   

  //PUT request to update the booking

  const updatePayload = {
    firstname: "Calvin",
    lastname: "Chan",
    totalprice: 500,
    depositpaid: true,
    bookingdates: {
      checkin: "2025-01-01",
      checkout: "2025-01-03"
    },
    additionalneeds: "Breakfast"
  } 

  const putResponse = await request.put('/booking/' + bookingId, { headers: { 'Cookie': 'token=' + token }, data: updatePayload });
  expect (putResponse.status()).toBe (200);
  expect(putResponse.headers()['content-type']).toContain('application/json'); 

  const putResponseBody = await putResponse.json(); 
  console.log(`PUT response body ------------------------------`);
  console.log(putResponseBody); 
  expect(putResponseBody.firstname).toBe ('Calvin');
  expect(putResponseBody.lastname).toBe ('Chan');
  expect(putResponseBody.totalprice).toBe (500); 

  // PATCH request to update the booking 

  const patchPayload = {
    totalprice: 750,
    additionalneeds: "Lunch"
  }; 

  const patchResponse = await request.patch('/booking/' + bookingId, { headers: { 'Cookie': 'token=' + token }, data: patchPayload });
  expect (patchResponse.status()).toBe (200);
  expect(patchResponse.headers()['content-type']).toContain('application/json');

  const patchResponseBody = await patchResponse.json(); 
  console.log(`PATCH response body ------------------------------`);
  console.log(patchResponseBody); 
  expect(patchResponseBody.totalprice).toBe (750); 
  expect(patchResponseBody.additionalneeds).toBe ('Lunch'); 

  // DELETE request to delete the booking 

  const deleteResponse = await request.delete ('/booking/' + bookingId, { headers: { 'Cookie': 'token=' + token } });
  expect (deleteResponse.status()).toBe (201); 

  //GET request to verify deletion of booking
  const getDeletedResponse = await request.get('/booking/'+ bookingId, {headers: { 'Cookie': 'token=' + token }}); 
  expect (getDeletedResponse.status()).toBe (404);

  const getDeletedResponseBody = await getDeletedResponse.text(); 
  console.log(`DELETE response body ------------------------------`);
  console.log(getDeletedResponseBody);
  expect (getDeletedResponseBody).toBe ('Not Found');
});

