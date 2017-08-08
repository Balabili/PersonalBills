const express = require('express'),
    app = express(),
    router = require('./router/router.js'),
    bodyparser = require('body-parser'),
    session = require('express-session'),
    mongoose = require('./lib/mongo.js'),
    MongoStore = require('connect-mongo')(session),
    handlebars = require('express-handlebars').create({
        extname: 'hbs', defaultLayout: 'main'
    });

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(session({
    secret: 'iufahdiuwaiudyawydiua',
    cookie: { 'maxAge': 60 * 1000 * 60 * 24 * 14 },
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));
app.use(bodyparser());
app.use(express.static(__dirname + '/bin'));
app.use(express.static(__dirname + '/public'));

router(app);

app.listen(8090);