const Log = require("../models/log");

exports.getLogs =async (req, res) =>{
    try{
        const logs = await Log.find().populate("visitorId", "name").populate("passId")
        res.json({
            data:logs
        })
    }
    catch(error){
        res.status(400).json({
            error:error.message
        })
    }
}