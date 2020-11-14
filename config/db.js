const mongoose = require('mongoose')
const config = require('config')

const dbURI = config.get('mongoURI');
const connectDB = async () => {
    try
    {   
        await mongoose.connect(dbURI,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true});
        console.log('MongoDB Connected');
    }
    catch (err)
    {
        console.log(`Error DBConnection ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;