var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Book = require('../models/Form.js');
var request = require('request');
var jsdom = require('jsdom');
var { JSDOM } = jsdom;
var cheerio = require('cheerio');
var pug = require('pug');

/* GET ALL BOOKS */
router.get('/form/:id', function (req, res, next) {
        Book.findById(req.params.id, function (err, form) {
                if (err) return next(err);
                res.render('public/form/view', {
                        doc: {
                                title: 'Forms',
                                form
                        }
                });
        });
});

router.get('/form/bswhcom/:id', function (req, res, next) {
        Book.findById(req.params.id, function (err, form) {
                if (err) return next(err);
                res.render('public/form/view_bswhcom', {
                        doc: {
                                title: 'Forms',
                                form
                        }
                });
        });
});

router.get('/form/bswh/:id', function (req, res, next) {
        Book.findById(req.params.id, function (err, form) {
                if (err) return next(err);

                var htmlStr = "";
                request('https://www.bswhealth.med/Pages/refer-form.aspx', (err, resp, body) => {
                        var $ = cheerio.load('' + body);
                        $('[src], [href]').each(function(index, elem){
                                var isSrc = true;
                                var link = $(this);
                                var attr = $(this).attr('src');
                                if (!attr) {
                                        isSrc = false;
                                        attr = $(this).attr('href');
                                }
                                if (attr.startsWith('/')) {
                                        attr = 'https://www.bswhealth.med' + attr;
                                }
                                if (isSrc) {
                                        $(this).attr('src', attr);
                                } else {                                        
                                        $(this).attr('href', attr);
                                }
                        });
                        res.render('public/form/view_bswh', {
                                doc: {
                                        title: 'Forms',
                                        form
                                }
                        }, (err, body) => {
                                console.log('****************************');
                                $('#centerarea').html(body);
                                res.end($.html());
                        });

                });
                // res.render('public/form/view', {
                //         doc: {
                //                 title: 'Forms',
                //                 form
                //         }
                // });
        });
});


module.exports = router;