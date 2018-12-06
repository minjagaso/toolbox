var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Form = require('../models/Form.js');
var request = require('request');
var jsdom = require('jsdom');
var { JSDOM } = jsdom;
var cheerio = require('cheerio');
var pug = require('pug');
var pdf = require('html-pdf');
var path = require('path');

/* GET ALL FormS */
router.get('/form/:id', function (req, res, next) {
        Form.findById(req.params.id, function (err, form) {
                if (err) return next(err);
                res.render('public/form/view', {
                        doc: {
                                title: 'Forms',
                                form
                        }
                });
        });
});

router.post('/form/:id', function (req, res, next) {
        console.log(req.body.submission);
        Form.findById(req.params.id, (err, form) => {
                form.submissions.push(req.body.submission);

                form.save( (err, updatedForm) => {
                        res.end('Submitted.');
                });
        });
});

router.get('/form/bswhcom/:id', function (req, res, next) {
        Form.findById(req.params.id, function (err, form) {
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
        Form.findById(req.params.id, function (err, form) {
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
                                $('#centerarea').html(body);
                                res.set({ 'content-type': 'text/html; charset=utf-8' });
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

router.get('/form/submission/:id', function (req, res, next) {
        Form.findById(req.params.id, function (err, form) {
                if (err) return next(err);
                res.render('public/form/submissions/pdf', {
                        doc: {
                                title: 'Forms',
                                form
                        }
                });
                // res.render('public/form/submissions/pdf', {
                //         doc: {
                //                 title: 'Forms',
                //                 form
                //         }
                // }, (err, body) => {
                //         var base = path.resolve('static');
                //         pdf.create(body).toStream((err, pdfStream) => {
                //                 if (err) {
                //                         // handle error and return a error response code
                //                         console.log(err)
                //                         return res.sendStatus(500)
                //                 } else {
                //                         // send a status code of 200 OK
                //                         res.statusCode = 200
                //                         res.set({ 'content-type': 'application/pdf; charset=utf-8' });
                //                         // once we are done reading end the response
                //                         pdfStream.on('end', () => {
                //                                 // done reading
                //                                 return res.end();
                //                         })

                //                         // pipe the contents of the PDF directly to the response
                //                         pdfStream.pipe(res)
                //                 }
                //         })
                // });
        });
});


module.exports = router;