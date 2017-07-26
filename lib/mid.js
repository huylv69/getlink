'use strict';

const path = require('path');
const view = require('consolidate');
const qs = require('querystring');

module.exports = function (app) {
    app.use((req, res, next) => {
        res.render = function render(filename, params) {
            var file = path.resolve('./views', filename);
            view.mustache(file, params || {}, function (err, html) {
                if (err) { return next(err); }
                res.setHeader('Content-Type', 'text/html');
                res.end(html);
            });
        };
        next();
    });


    //parser form
    app.use((req, res, next) => {
        if (req.method !== 'POST') { return next(); }
        let body = '';
        req.on('data', (buf) => {
            body = body + buf.toString();
        });
        req.on('end', () => {
            req.body = qs.parse(body);
            next();
        });
    })
    app.use((req, res, next) => {
        res.json = function json(obj) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(obj));
        }
        next();
    })
}