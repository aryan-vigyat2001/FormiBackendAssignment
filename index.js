const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const csrf = require('csurf')
const app = express();
const flash = require('connect-flash')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoDBStore = require('connect-mongodb-session')(session)
const path = require('path')
const authRoutes = require('./routes/auth')
const eventRoutes = require('./routes/events')
const MONGODB_URI = 'mongodb+srv://aryancodez72:ycFcDoPxK2gk9Tl2@cluster0.ae3na.mongodb.net/eventWeb?retryWrites=true&w=majority'
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
const User = require('./models/user')
const csrfProtection = csrf({ cookie: true })
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.use(session(
    {
        secret: 'my secret key', resave: false, saveUninitialized: false,
        store: store
    }

))
app.use(csrfProtection);
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();    // console.log(req.session.isLoggedIn)
    next();
});

app.use('/auth', authRoutes)
app.use('/', eventRoutes)

app.get('/form', csrfProtection, function (req, res) {
    // pass the csrfToken to the view
    // res.render('send', { csrfToken: req.csrfToken() })
    res.send({ csrfToken: req.csrfToken() })
})

app.post('/process', csrfProtection, function (req, res) {
    res.send('data is being processed')
})

mongoose.
    connect('mongodb+srv://aryancodez72:ycFcDoPxK2gk9Tl2@cluster0.ae3na.mongodb.net/eventWeb?retryWrites=true&w=majority')
    .then(result => {
        app.listen(5000)
    })
    .catch(err => {
        console.log(err)
    })