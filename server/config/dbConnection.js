const mongoose = require('mongoose')

const dbConnect = async()=>{
    try{

        const db = process.env.DB
        mongoose.connect(db)
        console.log("connected to Database")
    }catch(err){
        console.log(err)
        process.exit(1)
    }

}
module.exports = dbConnect;