const express=require('express')
const eventControllers=require('../controllers/events')
const router=express.Router();

router.get('/',eventControllers.getIndex);
router.post('/registerEvent',eventControllers.addEvent)
router.post('/unregisterEvent',eventControllers.unregisterEvent)
router.get('/registeredEvents',eventControllers.registeredEvents)
router.post('/searchEvents',eventControllers.postSearchEvent)
module.exports=router;