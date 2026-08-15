const axios = require('axios');

async function testPaystack() {
    try {
        console.log("Mocking Initialization Request...");
        const pInit = await axios.post('http://localhost:5001/api/admin/payments/initialize', {
            order_id: 1, // just fake a physical database ID
            email: 'demo@gmail.com',
            amount: 10000
        });
        
        console.log("Initialize Response:", pInit.data);
        
        // Let's attempt verify using the reference it gave us natively
        const { reference } = pInit.data.data;
        if(reference) {
            console.log("Initiating verify sequence with reference:", reference);
            // This will likely fail with Paystack because it's not paid, but it should return a 400 from Paystack, NOT crash.
            const pVer = await axios.post('http://localhost:5001/api/admin/payments/verify', {
                reference
            });
            console.log("Verify Response:", pVer.data);
        }
    } catch(e) {
        if(e.response) {
            console.error("Axios Error from server:", e.response.data);
        } else {
            console.error("Fatal Network Exception:", e.message);
        }
    }
}

testPaystack();
