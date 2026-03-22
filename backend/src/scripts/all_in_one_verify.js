const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');

async function run() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/unilearnhub');
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        
        const email = 'new_student_notify_test@gmail.com';
        const password = 'password';
        const hash = await bcrypt.hash(password, 10);
        
        await User.updateOne(
            { email },
            { 
                $set: { 
                    password: hash,
                    status: 'active' 
                } 
            }
        );
        console.log('User Updated.');

        // Verify Compiler
        const baseUrl = 'http://localhost:5000/api';
        const loginRes = await axios.post(`${baseUrl}/auth/login`, { email, password });
        const token = loginRes.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log('--- TESTING COMPILER ---');
        
        const languages = [
            { id: 'python', code: 'print("Python Output: " + str(10+10))' },
            { id: 'javascript', code: 'console.log("JS Output: " + (5*5))' },
            { id: 'cpp', code: '#include <iostream>\nint main() { std::cout << "CPP Output: " << (100-1); return 0; }' },
            { id: 'java', code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Java Output: " + (50+50));\n    }\n}' }
        ];

        for (const lang of languages) {
            const res = await axios.post(`${baseUrl}/compiler/run`, {
                language: lang.id,
                code: lang.code
            }, config);
            console.log(`[${lang.id}]`, res.data.success ? res.data.output.trim() : 'ERROR: ' + res.data.error);
        }

        process.exit(0);
    } catch (err) {
        console.error('FAILED:', err.response?.data || err.message);
        process.exit(1);
    }
}
run();
