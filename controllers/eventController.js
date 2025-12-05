const Event = require('../models/Events')

const createEvent = async (req,res) =>{
    try{
        const { title, date, time, location, eventType, description, budget} = req.body;

        // validation

        if(!title || !date || !location){
            return res.status(400).json({
                message: 'please fill in required fields'
            })
        }

        //create the event

        const event = await Event.create({
            organizer: req.user._id,
            title,
            date,
            time,
            location,
            eventType,
            description,
            budget,
            status: 'confirmed'
        })
        res.status(201).json(event)
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: 'server error'
        })
    }
};


const getMyEvents = async (req,res) =>{
    try{
        const events = await Event.find({organizer: req.user._id})
        res.json(events);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: 'server Error'
        })
    }
}

module.exports = {createEvent, getMyEvents}