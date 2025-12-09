export const bookingTestData = [
    {
        name: "Minimum required fields",
        payload: {
            firstname: "John",
            lastname: "Doe",
            totalprice: 100,
            depositpaid: true,
            bookingdates: {
                checkin: "2025-01-01",
                checkout: "2025-01-02"
            }
        },
        expectedStatus: 200
    },
    {
        name: "All fields with basic data",
        payload: {
            firstname: "Jane",
            lastname: "Smith",
            totalprice: 200,
            depositpaid: true,
            bookingdates: {
                checkin: "2025-02-01",
                checkout: "2025-02-05"
            },
            additionalneeds: "Breakfast"
        },
        expectedStatus: 200
    },
    {
        name: "Special characters in text fields",
        payload: {
            firstname: "Marie-Claire",
            lastname: "O'Connor",
            totalprice: 300,
            depositpaid: false,
            bookingdates: {
                checkin: "2025-03-01",
                checkout: "2025-03-10"
            },
            additionalneeds: "Breakfast & Dinner"
        },
        expectedStatus: 200
    },
    {
        name: "Maximum price value",
        payload: {
            firstname: "Max",
            lastname: "Price",
            totalprice: 999999,
            depositpaid: true,
            bookingdates: {
                checkin: "2025-12-01",
                checkout: "2025-12-31"
            },
            additionalneeds: "All Inclusive"
        },
        expectedStatus: 200
    },
    {
        name: "Missing required fields",
        payload: {
            firstname: "Invalid",
            totalprice: 100
        },
        expectedStatus: 400
    },
    {
        name: "Invalid date format",
        payload: {
            firstname: "Date",
            lastname: "Error",
            totalprice: 100,
            depositpaid: true,
            bookingdates: {
                checkin: "invalid-date",
                checkout: "2025-01-02"
            }
        },
        expectedStatus: 400
    },
    {
        name: "Negative price value",
        payload: {
            firstname: "Negative",
            lastname: "Price",
            totalprice: -100,
            depositpaid: true,
            bookingdates: {
                checkin: "2025-01-01",
                checkout: "2025-01-02"
            }
        },
        expectedStatus: 400
    }
];