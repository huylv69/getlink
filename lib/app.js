'use strict';
const http = require('http');
const server = http.createServer();
const finalhandler = require('finalhandler');
const path = require('path');
const router = require('router');
const app = new router();
const dotenv = require('dotenv');

//DB
const level = require('level');
const dbpath = path.resolve('./db');
const db = level(dbpath);

const shortid = require('shortid');

//use middleware
require('./mid')(app);

app.get('/', (req, res) => {
    res.render('home.html');
})

app.post('/', (req, res) => {
    if (!req.body.url) {
        return res.render('home.html', {
            msg: 'ulr missing'
        });
    }

    let id = shortid.generate();
    db.put(id, req.body.url, (err) => {
        if (err) {
            return res.render('home.html', {
                msg: err.toString()
            })
        }

        let url = `${process.env.VIRTUAL_HOST}:${process.env.PORT}/${id}`;
        return res.render('home.html', {
            url: url,
            msg: `Your url  :  `
        });
    })

});

app.get('/:id', (req, res) => {
    db.get(req.params.id, (err, url) => {
        if (err) {
            res.statusCode = 404;
            return res.end('404 not found');
        }

        res.statusCode = 301;
        res.setHeader('Location', url);
        res.end(url);
    });
});
app.get('/user', (req, res) => {
    res.json({
        "name": "huylv",
        "age": "21"
    });
});
app.get('/contact', (req, res) => {
    res.render('contact.html');
})
server.on('request', (req, res) => {
    app(req, res, finalhandler(req, res));
});

module.exports = server;
