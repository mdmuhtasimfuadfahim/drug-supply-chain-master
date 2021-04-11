const connectDB = require('./db');
const File = require('../models/file');
const fs = require('fs');

connectDB();

// Get all records older than 24 hours 
async function fetchData() {
    const files = await File.find({ createdAt : { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)} }) 
    // 24 * 60 * 60
    if(files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`Successfully Deleted ${file.filename}`);
            } catch(err) {
                console.log(`Error While Deleting File ${err} `);
            }
        }
    }
    else{
        console.log('Nothing to Delete');
    }
    
}

// fetchData().then(process.exit);

module.exports = fetchData


