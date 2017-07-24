const express = require('express'),
    app = express(),
    bodyparser = require('body-parser'),
    handlebars = require('express-handlebars').create({
        extname: 'hbs', defaultLayout: 'main'
    });

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(bodyparser());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render();
});

app.listen(8090);