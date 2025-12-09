export const validBookingData = [
    {
        testName: "Minimum required fields",
        payload: {
            firstname: "John",
            lastname: "Doe",
            totalprice: 100,
            depositpaid: true,
            bookingdates: {
                checkin: "2025-01-01",
                checkout: "2025-01-02"
            }
        }
    },
    {
        testName: "All fields with basic data",
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
        }
    },
    {
        testName: "Special characters in text fields",
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
        }
    },
    {
        testName: "Maximum price value",
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
        }
    }
];

export const invalidBookingData = [
    {
        testName: "Missing required fields",
        payload: {
            firstname: "Invalid",
            totalprice: 100
        },
        expectedError: 400
    },
    {
        testName: "Invalid date format",
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
        expectedError: 400
    },
    {
        testName: "Negative price value",
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
        expectedError: 400
    },
    {
        testName: "Empty string values",
        payload: {
            firstname: "",
            lastname: "",
            totalprice: 100,
            depositpaid: true,
            bookingdates: {
                checkin: "2025-01-01",
                checkout: "2025-01-02"
            }
        },
        expectedError: 400
    }
];

export const updateBookingData = [
    {
        testName: "Update single field - price",
        payload: {
            totalprice: 750
        }
    },
    {
        testName: "Update multiple fields",
        payload: {
            firstname: "Updated",
            lastname: "Name",
            additionalneeds: "Dinner"
        }
    }
];