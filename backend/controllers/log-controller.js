const Log = require("../models/log");

exports.getLogs =async (req, res) =>{
    try{
        const logs = await Log.find().populate("visitorId", "name").populate("passId")
        res.status(200).json({
            success:true,
            data:logs
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            error:error.message
        })
    }
}