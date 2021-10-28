const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
      await mongoose.connect(db,{
         useNewURLParser: true,
         //useCreateIndex: true //true not supported for some reason
      });

      console.log('MongoDB Connected ...')
    } catch(err){
        console.error(err.message);
        //Exit proccess with failure
        process.exit(1);
    }
};

module.exports = connectDB;