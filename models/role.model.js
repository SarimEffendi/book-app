const  mongoose = require("express")

const roleSchema = new mongoose.Schema({
    name:{
        type:String,
        enum:['admin','author','reader'],
        required:true
    },
})

module.exports = mongoose.model('Role',roleSchema)