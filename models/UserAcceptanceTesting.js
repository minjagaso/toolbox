var mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({
        label: String,
        value: String
});

var QuestionSchema = new mongoose.Schema({
        sort_order: Number,
        type: {
                type: String,
                default: 'text'
        },
        title: String,
        description: String,        
        validation: { 
                is_required: { 
                        type: Boolean, 
                        default: false 
                },
                type: {
                        type: String,
                        default: 'none'
                },
                method: {
                        type: String,
                        default: ''
                }
        },
        other: {
                is_enabled: {
                        type: Boolean,
                        default: false
                },
                label: {
                        type: String,
                        default: 'Other'
                }
        },
        answers: [AnswerSchema]
});

var FormSchema = new mongoose.Schema({
        title: {
                type: String,
                default: 'Untitled Form'
        },
        author: String,
        description: String,
        url: String,
        email_to: String,
        email_subject: String,
        questions: [QuestionSchema],
        is_deleted: {
                type: Boolean,
                default: false
        }
});

FormSchema.pre('save', function(next) {
        if ( !this.questions || this.questions.length == 0 ) {
                this.questions = [];                
                this.questions.push({
                        sort_order: 1,
                        type: 'text',
                        title: 'Name',
                        description: 'Name',
                        validation: {
                                is_required: true,
                                is_phone: false,
                                is_email: false
                        }
                });               
                this.questions.push({
                        sort_order: 2,
                        type: 'text',
                        title: 'Phone Number',
                        description: 'Phone Number',
                        validation: {
                                is_required: true,
                                is_phone: true,
                                is_email: false
                        }
                });           
                this.questions.push({
                        sort_order: 3,
                        type: 'text',
                        title: 'Email',
                        description: 'Email',
                        validation: {
                                is_required: true,
                                is_phone: false,
                                is_email: true
                        }
                });             
                this.questions.push({
                        sort_order: 4,
                        type: 'dropdown',
                        title: 'Gender',
                        description: 'Gender',
                        validation: {
                                is_required: false,
                                is_phone: false,
                                is_email: false
                        },
                        answers: [
                                { label: 'Female', value: 'female' },
                                { label: 'Male', value: 'Male' }
                        ]
                }); 
        }
        next();
});

FormSchema.statics.sortQuestionsBySortOrder = function (questions, cb) {
        return questions.sort(function (a, b) {
                return a.sort_order - b.sort_order;
        });
}

module.exports = mongoose.model('Form', FormSchema);