$(document).ready(function () {
    // alert("Ready function Working ");
    if ($(".selectSearch").length) {
        $(".selectSearch").select2();
    }

    $("#project-table").dataTable({
        "aaSorting": []
    });
    $("#user-table").dataTable({
        "aaSorting": []
    });
    $("#task-table").dataTable({
        "aaSorting": []
    });

    $('.set-project').change(function(){
        var val = $(".set-project option:selected").text();        
        $('.get-project').val(val);
    });
    $('.project-delete').click(function(){
        var id = $(this).attr('data-id');
        var row = $(this);

        (new PNotify({
            title: 'Confirmation!',
            text: 'Are you sure you want to delete this?',
            icon: 'glyphicon glyphicon-question-sign',
            type: 'error',
            hide: false,
            confirm: {
               confirm: true
                // prompt: true,
            },
            buttons: {
                closer: false,
                sticker: false
            },
            history: {
                history: false
            },
            addclass: 'stack-modal',
            stack: {
                'dir1': 'down',
                'dir2': 'right',
                'modal': true
            }
        })).get().on('pnotify.confirm', function (em, notice, val) {
            // alert("deleted");
            
            $.ajax({
                type : "DELETE",
                url : "/project/delete",
                data : {id : id},
                success : function(data){
                    if(data = true){
                        new PNotify({title: 'Success',text: 'Sucessfully deleted',type: 'success'});
                        row.parent().parent().remove();
                    }else{
                        new PNotify({title: 'Failed',text:  'Failed to delete',type: 'error'});
                    }
                    // new PNotify({title: 'Success',text: 'Sucessfully deleted',type: 'success'});
                }
            });
            
        });


        
    });

    $('.user-delete').click(function(){
        var id = $(this).attr('data-id');
        var row = $(this);

        (new PNotify({
            title: 'Confirmation!',
            text: 'Are you sure you want to delete this?',
            icon: 'glyphicon glyphicon-question-sign',
            type: 'error',
            hide: false,
            confirm: {
               confirm: true
                // prompt: true,
            },
            buttons: {
                closer: false,
                sticker: false
            },
            history: {
                history: false
            },
            addclass: 'stack-modal',
            stack: {
                'dir1': 'down',
                'dir2': 'right',
                'modal': true
            }
        })).get().on('pnotify.confirm', function (em, notice, val) {
            // alert("deleted");
            
            $.ajax({
                type : "DELETE",
                url : "/user/delete",
                data : {id : id},
                success : function(data){
                    if(data = true){
                        new PNotify({title: 'Success',text: 'Sucessfully deleted',type: 'success'});
                        row.parent().parent().remove();
                    }else{
                        new PNotify({title: 'Failed',text:  'Failed to delete',type: 'error'});
                    }
                    // new PNotify({title: 'Success',text: 'Sucessfully deleted',type: 'success'});
                }
            });
            
        });


        
    });

    $('.task-delete').click(function(){
        var id = $(this).attr('data-id');
        var row = $(this);

        (new PNotify({
            title: 'Confirmation!',
            text: 'Are you sure you want to delete this?',
            icon: 'glyphicon glyphicon-question-sign',
            type: 'error',
            hide: false,
            confirm: {
               confirm: true
                // prompt: true,
            },
            buttons: {
                closer: false,
                sticker: false
            },
            history: {
                history: false
            },
            addclass: 'stack-modal',
            stack: {
                'dir1': 'down',
                'dir2': 'right',
                'modal': true
            }
        })).get().on('pnotify.confirm', function (em, notice, val) {
            // alert("deleted");
            
            $.ajax({
                type : "DELETE",
                url : "/task/delete",
                data : {id : id},
                success : function(data){
                    if(data = true){
                        new PNotify({title: 'Success',text: 'Sucessfully deleted',type: 'success'});
                        row.parent().parent().remove();
                    }else{
                        new PNotify({title: 'Failed',text:  'Failed to delete',type: 'error'});
                    }
                    // new PNotify({title: 'Success',text: 'Sucessfully deleted',type: 'success'});
                }
            });
            
        });


        
    });

    $('#change_password').click(function(){
        // alert("Btn working");
        $('#passwordModal').modal('show');
    });
    $('#set_password').click(function(){
        var val = $('#new_password').val();
        if(val == ''){
            $('#new_password_error').html("Password cannot be empty");
        }else{
            $.ajax({
                type : "POST",
                url : "/user/password",
                data : {val : val},
                success : function(data){
                    if(data = 'true'){
                        new PNotify({title: 'Success',text: 'Sucessfully updated!',type: 'success'});
                        $('#passwordModal').modal('hide');
                    }else{
                        new PNotify({title: 'Failed',text:  'Failed to update!',type: 'error'});
                    }
                    // new PNotify({title: 'Success',text: 'Sucessfully deleted',type: 'success'});
                }
            });
        }
    });
});