const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    eventsPinned: {
        events: [
            {
                eventID: {
                    type: Schema.Types.ObjectId,
                    ref: 'Event',
                    required: true
                }
            }
        ]
    }
})
userSchema.methods.addToRegister = function (event) {
    const registeredList = [...this.eventsPinned.events];
    registeredList.push({
        eventID: event._id
    })
    const updatedEvents={
        events:registeredList
    }
    this.eventsPinned = updatedEvents
    return this.save();
}
userSchema.methods.removeEvent = function (eventID) {
    const eventRegisteredIndex = this.eventsPinned.events.findIndex(p => {
        return p.eventID.toString() == eventID.toString();
    })
    let updatedEventsPinned;
    if (eventRegisteredIndex >= 0) {
        const eventItems = [...this.eventsPinned.events];
        updatedEventsPinned = eventItems.filter(p => {
            return p.eventID.toString() !== eventID.toString();
        })

    }
    const updatedEventList = {
        events: updatedEventsPinned
    }
    this.eventsPinned = updatedEventList;
    return this.save();
}

module.exports = mongoose.model('User', userSchema);