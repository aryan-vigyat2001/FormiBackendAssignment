const { events } = require('../models/event');
const Event=require('../models/event');
const User = require('../models/user');
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
exports.postSearchEvent=async(req,res,next)=>{
    const search=req.body.search;
    console.log(search)
    if(!search)
    {
        res.redirect('/')
    }
    const regex=new RegExp(escapeRegex(search), 'gi');
    Event.find(
        {$or:[
            {"name":{"$in":regex}},
            {"description":{"$in":regex}},
            {"artist":{$in:regex}},
            {"location":{$in:regex}},
        ]},function(err,foundEvents){
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.render("events/search",{
                    allEvents:foundEvents
                })
            }
        }
    )
}


exports.getIndex=async(req,res,next)=>{
    const events= await Event.find();
    if(req.session.user){
    const user =await User.findById(req.session.user._id)
    var eventsRegistered=[]

    for(let event in user.eventsPinned.events)
    {
        eventsRegistered.push(user.eventsPinned.events[event].eventID.valueOf())
    }
    // console.log(eventsRegistered)
    res.render('events/',{
        path:"/",
        isAutheticated:req.session.isLoggedIn,
        allEvents:events,
        eventsRegistered:eventsRegistered
    })
}else{
    return res.redirect('/auth/signup')
}

}


exports.addEvent=(req,res,next)=>{
    let eventID=req.body.eventID
    Event.findById(eventID)
        .then(event=>{
            console.log(event)
            return req.user.addToRegister(event)
        })
        .then(result=>{
            console.log(result)
            res.redirect('/')
    })
}

exports.unregisterEvent=(req,res,next)=>{
    let eventID=req.body.eventID
    Event.findById(eventID)
    .then(event=>{
        console.log(event)
        return req.user.removeEvent(eventID)
    })
    .then(result=>{
        console.log(result)
        res.redirect('/')
})
}

exports.registeredEvents=async(req,res,next)=>{
    const events= await Event.find();
    if(req.session.user){
        const user =await User.findById(req.session.user._id)
        var eventsRegistered=[]
    
        for(let event in user.eventsPinned.events)
        {
            eventsRegistered.push(user.eventsPinned.events[event].eventID.valueOf())
        }
        // console.log(eventsRegistered)
        res.render('events/registeredevents',{
            path:"/",
            isAutheticated:req.session.isLoggedIn,
            allEvents:events,
            eventsRegistered:eventsRegistered
        })
    }else{
        return res.redirect('/auth/login')
    }
}