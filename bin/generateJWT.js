#!/usr/bin/env node

const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Generate a secure random JWT secret using bcrypt
const generateSecret = async () => {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(Date.now().toString(), salt);
    return hash;
};

// Create or update .env file with JWT_SECRET
const updateEnvFile = (secret) => {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.existsSync(envPath) 
        ? fs.readFileSync(envPath, 'utf8')
        : '';

    const envLines = envContent.split('\n');
    const jwtSecretLine = envLines.findIndex(line => line.startsWith('JWT_SECRET='));

    if (jwtSecretLine >= 0) {
        envLines[jwtSecretLine] = `JWT_SECRET=${secret}`;
    } else {
        envLines.push(`JWT_SECRET=${secret}`);
    }

    fs.writeFileSync(envPath, envLines.join('\n'));
};

try {
    generateSecret().then(secret => {
        updateEnvFile(secret);
        console.log('JWT secret generated and added to .env file successfully');
        console.log('Secret:', secret);
    }).catch(error => {
        console.error('Error generating JWT secret:', error);
        process.exit(1);
    });
} catch (error) {
    console.error('Error generating JWT secret:', error);
    process.exit(1);
}
