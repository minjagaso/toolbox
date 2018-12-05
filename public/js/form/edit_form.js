(function($){
        $(document).ready(function(){
                $('select').formSelect();
                $('.tabs').tabs();
                $('.collapsible').collapsible({
                        // accordion: true,
                        onOpenEnd: function(el){
                                var item = $(el);
                                item.find('.toggle').html('arrow_drop_up')
                        },
                        onCloseEnd: function(el){
                                var item = $(el);
                                item.find('.toggle').html('arrow_drop_down')
                        },
                });
                $('.collapsible').sortable();
                $('.delete').on('click', function(){
                        $(this).closest('li').remove();
                });
                $('.copy').on('click', function(){
                        var item = $(this).closest('li');
                        var copyItem = item.clone();
                        copyItem.insertAfter(item);
                });
                var resizableMinWidth = 105;
                var resizableMaxWidth = 1260;
                $('.collapsible > li').resizable({
                        minWidth: resizableMinWidth,
                        maxWidth: resizableMaxWidth,
                        resize: function( event, ui ) {
                                ui.size.width = Math.round( ui.size.width / 105 ) * 105;
                                var colClass = 'col s' + ui.size.width / resizableMinWidth;
                                $(this).addClass(colClass);
                        }
                });
                $(document.body).on('click', '.add-answer', addAnswerOption);
                $(document.body).on('click', '.remove-answer', removeAnswerOption);

                var doSubmit = false;
                $('#save').on('click', function(e){
                        if(!doSubmit)
                                e.preventDefault();
                        $.ajax({
                                method: "put",
                                dataType: "json",
                                url: "/form/" + $("[name='_id']").val(),
                                data: $('form').serialize()
                        })
                        .done(function(doc) {
                                doSubmit = true;
                                M.toast({ 
                                        html: doc.message,
                                        classes: "success green"
                                });
                                setTimeout(function(){
                                        $('form').submit();
                                }, 3000);
                        });
                });
                var copyQuestion = $('#copy-from');
                $('#add-question').on('click', function(e){
                        if(!doSubmit) {
                                e.preventDefault();
                        }
                        var thisQuestion = $(this).closest('li');
                        console.log(thisQuestion);
                        var newQuestion = copyQuestion.clone();
                        // newQuestion.removeAttr('id').removeAttr('style');
                        console.log(newQuestion);
                        newQuestion.insertAfter(thisQuestion);
                        // $.ajax({
                        //         method: "put",
                        //         dataType: "json",
                        //         url: "/form/" + $("[name='_id']").val() + "/createQuestion"
                        // })
                        // .done(function(doc) {
                        //         doSubmit = true;
                        //         M.toast({ 
                        //                 html: doc.message,
                        //                 classes: "success green"
                        //         });
                        //         // setTimeout(function(){
                        //         //         $('form').submit();
                        //         // }, 3000);
                        // });
                });
        });
        function addAnswerOption() {
                var addAnswerBtn = $(this);
                var copyEl = $(this).closest('.possible-answer').clone();
                var copyInput = copyEl.find('input');
                copyInput.val('');
                copyEl.insertAfter('.possible-answer:last-child');
                addAnswerBtn.parent().remove();
        }
        function removeAnswerOption() {
                var removeAnswerBtn = $(this);
                var selectedEl = $(this).closest('.possible-answer');
                selectedEl.remove();
        }
})(window.jQuery);