var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Book = require('../models/Form.js');

/* GET ALL BOOKS */
router.get('/', function (req, res, next) {
        Book.find(function (err, forms) {
                if (err) return next(err);
                // res.json(products);
                var doc = {
                        title: 'Forms',
                        forms
                }
                res.render('form/form', {
                        doc
                });
        });
});

/* GET SINGLE BOOK BY ID */
router.get('/:id', function (req, res, next) {
        Book.findById(req.params.id, function (err, form) {
                if (err) return next(err);
                res.render('form/edit_form', {
                        doc: {
                                title: 'Forms',
                                form
                        }
                })
        });
});

router.post('/:id', function (req, res, next) {
        Book.findById(req.params.id, function (err, form) {
                if (err) return next(err);
                res.render('form/edit_form', {
                        doc: {
                                title: 'Forms',
                                form
                        }
                })
        });
});

/* SAVE BOOK */
router.post('/', function (req, res, next) {
        Book.create(req.body, function (err, form) {
                if (err) return next(err);
                res.redirect('/form/' + form._id)
        });
});

/* Create Question */
router.put('/:id/createQuestion', function (req, res, next) {
        Book.findByIdAndUpdate(req.params.id, {}, function (err, form) {
                if (err) return next(err);

                var updatedForm = form;
                updatedForm.questions.push({ sort_order: updatedForm.questions.length + 1 });
                updatedForm.save(function(err, updatedForm) {
                        res.json({
                                message: 'Question created.',
                                type: 'success'
                        });
                });
        });
});

/* UPDATE BOOK */
router.put('/:id', function (req, res, next) {
        if (req.body.questions) {
                req.body.questions = Book.sortQuestionsBySortOrder(req.body.questions);
        }
        Book.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) return next(err);
                res.json({
                        message: 'Form saved.',
                        type: 'success'
                });
        });
});

/* DELETE BOOK */
router.delete('/:id', function (req, res, next) {
        Book.findByIdAndRemove(req.params.id, req.body, function (err, post) {
                if (err) return next(err);
                res.json(post);
        });
});

module.exports = router;