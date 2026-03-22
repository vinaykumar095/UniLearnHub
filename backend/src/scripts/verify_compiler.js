const axios = require('axios');

async function verify() {
    const baseUrl = 'http://localhost:5000/api';
    
    // 1. Get a token (using student account found earlier)
    try {
        const loginRes = await axios.post(`${baseUrl}/auth/login`, {
            email: 'new_student_notify_test@gmail.com',
            password: 'password'
        });
        const token = loginRes.data.token;
        console.log('Login Successful.');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Test Python
        console.log('\nTesting Python...');
        const pyRes = await axios.post(`${baseUrl}/compiler/run`, {
            language: 'python',
            code: 'print(22 + 20)'
        }, config);
        console.log('Python Output:', pyRes.data.output.trim());

        // 3. Test JavaScript
        console.log('\nTesting JavaScript...');
        const jsRes = await axios.post(`${baseUrl}/compiler/run`, {
            language: 'javascript',
            code: 'console.log("Node Works " + (10*2))'
        }, config);
        console.log('JS Output:', jsRes.data.output.trim());

        // 4. Test C++
        console.log('\nTesting C++...');
        const cppRes = await axios.post(`${baseUrl}/compiler/run`, {
            language: 'cpp',
            code: '#include <iostream>\nint main() { std::cout << "C++ Power " << (5+5); return 0; }'
        }, config);
        console.log('C++ Output:', cppRes.data.output?.trim() || cppRes.data.error);

    } catch (err) {
        console.error('Verification Failed:', err.response?.data || err.message);
    }
}

verify();
