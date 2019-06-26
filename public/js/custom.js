
$(document).ready(function () {
    //Global Variables
    var THIS;
    //Default Page settings
    

    if ($(".selectSearch").length) {
        $(".selectSearch").select2();
    }
  
    $(".project_users").select2();

    // var DatatableProject = $("#project-table").DataTable({});
    var DatatableProject = $("#project-table").DataTable({
        "order": [[ 0, "desc" ]],
		"columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            }
			],
       responsive: true
    });
    var DatatableUser = $("#user-table").DataTable({
        "order": [[ 0, "desc" ]],
		"columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            }
			],
        responsive: true
    });
    var DatatableTask = $("#task-table").DataTable({
        "order": [[ 0, "desc" ]],
		"columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            }
			],
        responsive: true
    });

    $('.set-project').change(function(){
        var val = $(".set-project option:selected").text();        
        $('.get-project').val(val);
    });

    

    //========Project Page========\\
    //#Add Project modal
    $('.addNewProject').click(function(){
        $('#Form-AddProject')[0].reset();
        $('#addProjectModal').modal('show');
    });
    //#Add project
    $('#Form-AddProject').submit(function(e){
        e.preventDefault();
        var data = $('#Form-AddProject').serializeArray();
        data.push({ name : 'W', value : 'Wasiq'},{name : 'N', value : "NaQi"});

        $.ajax({
            url: '/project/add',
            type: 'POST',
            dataType: 'json',
            data:  data,
            success: function(info) {
                // var record = JSON.parse(info);
                // alert(info.data.name);
                if(info.status == '200'){
                    var dt = new Date(info.data.createdAt);
                    var date = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
                    // DatatableProject.row.add( [
                    //     '<a class="text-primary editProject" data-id="' + info.data._id + '">' + info.data.name + '</a>', 
                    //     info.data.detail,
                    //     info.data.status,
                    //     info.data.createdBy.ownerName,
                    //     date,
                    //     '<button data-id="' + info.data._id + '" class="btn btn-danger btn-xs cus-btn-xs project-delete"><i class="ti-trash"></i></button>'] ).draw( false );
                    var detailChk = info.data.detail;
                    var detail = '';
                    if(detailChk.length > 50){detail = info.data.detail.substring(0, 50)+"...";}else{detail = info.data.detail;}
                    
                    // $('#project-table').prepend('<tr>'+
                    // '<td><a class="text-primary project-edit" data-id="' + info.data._id + '">' + info.data.name + '</a></td>'+
                    // '<td>' + detail + '</td>'+
                    // '<td>' + info.data.status + '</td>'+
                    // '<td>' + info.data.createdBy.ownerName + '</td>'+
                    // '<td>' + date + '</td>'+
                    // '<td><button data-id="' + info.data._id + '" class="btn btn-danger btn-xs cus-btn-xs project-delete"><i class="ti-trash"></i></button></td>'+
                    // '</tr>').hide().fadeIn('slow');

                    var col_sr;
                    var col = DatatableProject.row(':first').data();
                    // alert(col);
                    if(typeof col == 'undefined'){
                        col_sr = 0;
                    }else{
                        col_sr = col[0];
                    }
		            var col_1 = parseInt(col_sr) + 1;
                    var col_2 = '<a class="text-primary project-edit" data-id="' + info.data._id + '">' + info.data.name + '</a>';
                    var col_3 =  detail;
                    var col_4 =  info.data.status;
                    var col_5 = info.data.createdBy.ownerName;
                    var col_6 = date;
                    var col_7 = '<button data-id="' + info.data._id + '" class="btn btn-danger btn-xs cus-btn-xs project-delete"><i class="ti-trash"></i></button>';

                    DatatableProject.row.add([ col_1,col_2,col_3,col_4,col_5,col_6, col_7 ]).draw("true");
                    new PNotify({title: 'Success',text: 'Project Added',type: 'success'});
                    $("#Form-AddProject [name='project_users[]']").val(null).trigger('change');
                    // $('#mySelect2').val(null).trigger('change');
                    $('#Form-AddProject')[0].reset();
                
                } else {
                    new PNotify({title: 'Failed',text: 'Failed to add project',type: 'error'});
                }
                // alert(JSON.stringify(info));
            }
        });
        // return false;
        
    });
    //#Delate Project
    $('.content-wrapper').on('click','.project-delete',function(){
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
                        // row.parent().parent().remove();
                        // row.parent().parent().fadeOut('slow', function(){
                            
                        // });
                        DatatableProject.row(row.closest('tr')).remove().draw();
                    }else{
                        new PNotify({title: 'Failed',text:  'Failed to delete',type: 'error'});
                    }
                }
            });
            
        });


        
    });
    //Edit project
    $('.content-wrapper').on('click','.project-edit',function(){
        
        var id = $(this).attr('data-id');
        THIS = $(this);
        $.ajax({
            url : '/project/getSingle',
            type : 'POST',
            data : {id : id},
            success : function(result){
                // alert(result.data);

                $("#Form-EditProject [name='project_id']").val(result.data._id);
                $("#Form-EditProject [name='project_name']").val(result.data.name);
                $("#Form-EditProject [name='project_users[]']").val(result.data.users);
                //$("#Form-EditProject [name='project_users[]']").val(['5cfa4e01748a5b18dc8b8e68','5d0b4f936da21b15dc53a01e']);
                $("#Form-EditProject [name='project_users[]']").trigger('change');
                $("#Form-EditProject [name='project_description']").val(result.data.detail);
                $("#Form-EditProject [name='project_status']").val(result.data.status);
                $('#Modal-EditProject').modal('show');
            },
            error: function(response) {
                console.log(response);
            }
        });
    });
    $('#Form-EditProject').submit(function(e){
        // alert($('#Form-EditProject').serialize());
        e.preventDefault();
        var data = $('#Form-EditProject').serializeArray();
        data.push({ name : 'id', value : $("#Form-EditProject [name='project_id']").val()});
        // alert(THIS.parent().parent().html());

        $.ajax({
            url: '/project/update',
            type: 'PUT',
            dataType: 'json',
            data:  data,
            success: function(info) {
                // var record = JSON.parse(info);
                // alert(info.data.name);
                if(info.status == '200'){
                    var row = THIS.parent().parent();
                    // alert(info.data.name);
                    // alert($(row).children(":nth-child(2)").html());
                    var detailChk = info.data.detail;
                    var detail = '';
                    if(detailChk.length > 50){detail = info.data.detail.substring(0, 50)+"...";}else{detail = info.data.detail;}
                    
                    $(row).children(":nth-child(2)").text(detail);
                    $(row).children(":nth-child(3)").text(info.data.status);
                    new PNotify({title: 'Success',text: 'Sucessfully updated',type: 'success'});
                    // alert("Success");
                    $('#Modal-EditProject').modal('hide');
                
                } else {
                    alert("Failed to update project");
                }
                // alert(JSON.stringify(info));
            },
            error : function(error){
                alert(error);
            }
        });
        
    });

    //========Task========\\
    //# Add Task modal
    $('.addNewTask').click(function(){
        $.ajax({
        url : '/task/project',
        type : 'POST',
        // data : {id : id},
        success : function(result){
            // alert(result.data);
            var options = '';
            result.data.forEach(function(record){
                // alert(record.name);
                options = options + '<option value="' + record._id + '">' + record.name + '</option>';
            });
            $('#Form-AddTask [name="task_project"]').empty().append('<option value="">Select Project</option>');
            $('#Form-AddTask [name="task_project"]').append(options);
            $('#Form-AddTask')[0].reset();
            $('#addTaskModal').modal('show');
            
        }
         });
       
    });
    // # Add Task
    $('#Form-AddTask').submit(function(e){
        e.preventDefault();
        var data = $('#Form-AddTask').serializeArray();
        // alert(data);
        $.ajax({
            url: '/task/add',
            type: 'POST',
            dataType: 'json',
            data:  data,
            success: function(info) {
                // var record = JSON.parse(info);
                // alert(info.data.name);
                if(info.status == '200'){

                    var detailChk = info.data.detail;
                    var detail = '';
                    if(detailChk.length > 50){detail = info.data.detail.substring(0, 50)+"...";}else{detail = info.data.detail;}

                    var col_sr;
                    var col = DatatableTask.row(':first').data();
                    if(typeof col == 'undefined'){
                        col_sr = 0;
                    }else{
                        col_sr = col[0];
                    }
		            var col_1 = parseInt(col_sr) + 1;
                    var col_2 = '<a class="text-primary task-edit" data-id="' + info.data._id + '">' + info.data.project.projectName + '</a>';
                    var col_3 =  detail;
                    var col_4 =  info.data.date;
                    var col_5 = info.data.time;
                    var col_6 = info.data.createdBy.ownerName;
                    var col_7 = '<button data-id="' + info.data._id + '" class="btn btn-danger btn-xs cus-btn-xs task-delete"><i class="ti-trash"></i></button>';

                    DatatableTask.row.add([ col_1,col_2,col_3,col_4,col_5,col_6,col_7 ]).draw("true");
                    new PNotify({title: 'Success',text: 'Task Added',type: 'success'});

                    $('#Form-AddTask')[0].reset();
                
                } else {
                    alert("Failed to add project");
                }
            }
        });

    });
    // # Edit Task Modal
    $('.content-wrapper').on('click','.task-edit',function(){
      
        var id = $(this).attr('data-id');
        THIS = $(this);
        $.ajax({
            url : '/task/getSingle',
            type : 'POST',
            data : {id : id},
            success : function(result){
                // alert(result.data);
                $("#Form-EditTask [name='task_id']").val(result.data._id);
                $("#Form-EditTask [name='task_project']").val(result.data.project.projectName);
                $("#Form-EditTask [name='task_description']").val(result.data.detail);
                $("#Form-EditTask [name='task_date']").val(result.data.date);
                $("#Form-EditTask [name='task_time']").val(result.data.time);
                $('#editTaskModal').modal('show');
            },
            error: function(response) {
                console.log(response);
                // alert("error");
            }
        });
    });
    // # Edit form Submit
    $('#Form-EditTask').submit(function(e){
        // alert($('#Form-EditProject').serialize());
        e.preventDefault();
        var data = $('#Form-EditTask').serializeArray();
        // alert(data);
        // data.push({ name : 'id', value : $("#Form-EditProject [name='project_id']").val()});
        // alert(THIS.parent().parent().html());

        $.ajax({
            url: '/task/update',
            type: 'PUT',
            dataType: 'json',
            data:  data,
            success: function(info) {
                if(info.status == '200'){
                    var row = THIS.parent().parent();
                    var detailChk = info.data.detail;
                    var detail = '';
                    if(detailChk.length > 50){detail = info.data.detail.substring(0, 50)+"...";}else{detail = info.data.detail;}
                    $(row).children(":nth-child(2)").text(detail);
                    $(row).children(":nth-child(3)").text(info.data.date);
                    $(row).children(":nth-child(4)").text(info.data.time);
                    new PNotify({title: 'Success',text: 'Sucessfully updated',type: 'success'});
                    // alert("Success");
                    $('#editTaskModal').modal('hide');
                
                } else {
                    alert("Failed to update project");
                }
                // alert(JSON.stringify(info));
            },
            error : function(error){
                console.log(error);
                alert(error);
            }
        });
        
    });
    // # Delete Task
    $('.content-wrapper').on('click','.task-delete',function(){
        
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
                        // row.parent().parent().remove();
                        // row.parent().parent().fadeOut('slow', function(){
                        //     $(this).remove();
                        // });
                        DatatableTask.row(row.closest('tr')).remove().draw();
                    }else{
                        new PNotify({title: 'Failed',text:  'Failed to delete',type: 'error'});
                    }
                    // new PNotify({title: 'Success',text: 'Sucessfully deleted',type: 'success'});
                }
            });
            
        });

    });

    //========User========\\
    //# Add User modal
    $('.addNewUser').click(function(){
        $('#Form-AddUser')[0].reset();
        $('#Form-AddUser').find('span.error').remove();
        $('#addUserModal').modal('show');
    });
    // # Add User Form Submit
    $('#Form-AddUser').submit(function(e){
        e.preventDefault();
        $('#Form-AddUser').find('span.error').remove();
        var data = $('#Form-AddUser').serializeArray();
        // alert(data);
        $.ajax({
            url: '/user/add',
            type: 'POST',
            dataType: 'json',
            data:  data,
            success: function(info) {
                // alert(info.data.code);
                if(info.status == '200'){
                    
                    var col_sr;
                    var col = DatatableUser.row(':first').data();
                    if(typeof col == 'undefined'){
                        col_sr = 0;
                    }else{
                        col_sr = col[0];
                    }
		            var col_1 = parseInt(col_sr) + 1;
                    var col_2 = '<a class="text-primary user-edit" data-id="' + info.data._id + '">' + info.data.name + '</a>';
                    var col_3 =  info.data.email;
                    var col_4 =  info.data.role;
                    var col_5 = '<button data-id="' + info.data._id + '" class="btn btn-danger btn-xs cus-btn-xs user-delete"><i class="ti-trash"></i></button>';

                    DatatableUser.row.add([ col_1,col_2,col_3,col_4,col_5]).draw("true");
                    $('#Form-AddUser')[0].reset();
                    new PNotify({title: 'Success',text: 'User Added',type: 'success'});
                
                }
            },
            error : function(error){
                var res = error.responseJSON;
                // console.log(error);
                if (res.status == '400') {
                    if(res.data.code == 11000){
                        $("#Form-AddUser [name='user_email']").after('<span class="error">Email already exist</span>');
                    }else{
                        if(typeof res.data.errors.name != 'undefined'){
                            $("#Form-AddUser [name='user_name']").after('<span class="error">' + res.data.errors.name.message + '</span>');
                        }
                        if(typeof res.data.errors.email != 'undefined'){
                            $("#Form-AddUser [name='user_email']").after('<span class="error">' + res.data.errors.email.message + '</span>');
                        }
                        if(typeof res.data.errors.password != 'undefined'){
                            $("#Form-AddUser [name='user_password']").after('<span class="error">' + res.data.errors.password.message + '</span>');
                        }
                        if(typeof res.data.errors.role != 'undefined'){
                            $("#Form-AddUser [name='user_role']").after('<span class="error">' + res.data.errors.role.message + '</span>');
                        }
                    }
                }
            }
        });

    });
    // # Edit User Modal
    $('.content-wrapper').on('click','.user-edit',function(){
      
        var id = $(this).attr('data-id');
        THIS = $(this);
        $.ajax({
            url : '/user/getSingle',
            type : 'POST',
            data : {id : id},
            success : function(result){
                // alert(result.data);
                $("#Form-EditUser [name='user_id']").val(result.data._id);
                $("#Form-EditUser [name='user_name']").val(result.data.name);
                $("#Form-EditUser [name='user_email']").val(result.data.email);
                $("#Form-EditUser [name='user_role']").val(result.data.role);
                $('#editUserModal').modal('show');
            },
            error: function(response) {
                console.log(response);
                // alert("error");
            }
        });
    });
    // # Edit User form Submit
    $('#Form-EditUser').submit(function(e){
        e.preventDefault();
        $('#Form-EditUser').find('span.error').remove();
        var data = $('#Form-EditUser').serializeArray();

        $.ajax({
            url: '/user/update',
            type: 'PUT',
            dataType: 'json',
            data:  data,
            success: function(info) {
                console.log(info);
                if(info.status == '200'){
                    var row = THIS.parent().parent();
                    var userName = '<a class="text-primary user-edit" data-id="' + info.data._id + '">' + info.data.name + '</a>';
                    $(row).children(":nth-child(1)").html(userName);
                    $(row).children(":nth-child(2)").text(info.data.email);
                    $(row).children(":nth-child(3)").text(info.data.role);
                    new PNotify({title: 'Success',text: 'Sucessfully updated',type: 'success'});
                    // alert("Success");
                    $('#editUserModal').modal('hide');
                
                } else {
                    if (info.status == '400') {
                        if(info.data.code == 11000){
                            $("#Form-EditUser [name='user_email']").after('<span class="error">Email already exist</span>');
                        }else{
                            if(typeof info.data.errors.name != 'undefined'){
                                $("#Form-EditUser [name='user_name']").after('<span class="error">' + info.data.errors.name.message + '</span>');
                            }
                            if(typeof info.data.errors.email != 'undefined'){
                                $("#Form-EditUser [name='user_email']").after('<span class="error">' + info.data.errors.email.message + '</span>');
                            }
                            // if(typeof res.data.errors.password != 'undefined'){
                            //     $("#Form-EditUser [name='user_password']").after('<span class="error">' + res.data.errors.password.message + '</span>');
                            // }
                            if(typeof info.data.errors.role != 'undefined'){
                                $("#Form-EditUser [name='user_role']").after('<span class="error">' + info.data.errors.role.message + '</span>');
                            }
                        }
                    }
                }
                // alert(JSON.stringify(info));
            },
            error : function(error){
                var res = error.responseJSON;
                console.log(error);
                if (res.status == '400') {
                    if(res.data.code == 11000){
                        $("#Form-EditUser [name='user_email']").after('<span class="error">Email already exist</span>');
                    }else{
                        if(typeof res.data.errors.name != 'undefined'){
                            $("#Form-EditUser [name='user_name']").after('<span class="error">' + res.data.errors.name.message + '</span>');
                        }
                        if(typeof res.data.errors.email != 'undefined'){
                            $("#Form-EditUser [name='user_email']").after('<span class="error">' + res.data.errors.email.message + '</span>');
                        }
                        // if(typeof res.data.errors.password != 'undefined'){
                        //     $("#Form-EditUser [name='user_password']").after('<span class="error">' + res.data.errors.password.message + '</span>');
                        // }
                        if(typeof res.data.errors.role != 'undefined'){
                            $("#Form-EditUser [name='user_role']").after('<span class="error">' + res.data.errors.role.message + '</span>');
                        }
                    }
                }
            }
        });
        
    });
    // # Delete User   
    $('.content-wrapper').on('click','.user-delete',function(){
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
                        DatatableUser.row(row.closest('tr')).remove().draw();
                    }else{
                        new PNotify({title: 'Failed',text:  'Failed to delete',type: 'error'});
                    }
                    // new PNotify({title: 'Success',text: 'Sucessfully deleted',type: 'success'});
                }
            });
            
        });


        
    });

    //Recover Password
    $('#Form-PasswordReset').submit(function(e){
        e.preventDefault();

        $('#Form-PasswordReset').find('span.error').remove();
        $('#Form-PasswordReset').find('span.success').remove();
        var data = $('#Form-PasswordReset').serializeArray();
        // alert(data);
        // alert(data);
        $.ajax({
            url: '/recover',
            type: 'POST',
            dataType: 'json',
            data:  data,
            success: function(info) {
                alert(info.status);
                if(info.status == '200'){
                    $('#Form-PasswordReset')[0].reset();
                    $("#Form-PasswordReset [name='user_email']").after('<span class="success">' + info.data.message + '</span>');
                }else{
                    $("#Form-PasswordReset [name='user_email']").after('<span class="error">' + info.data.message + '</span>');
                }
            },
            error: function(error){
                var res = error.responseJSON;
                if(res.status == '400'){
                    $("#Form-PasswordReset [name='user_email']").after('<span class="error">' + res.data.message + '</span>');
                }
            }
        });
    });

    //Change Password
    // $('#Form-PasswordReset').submit(function(e){
    //     e.preventDefault();
    //     var $('#Form-PasswordReset').serializeArray();
    // });
    $('#Form-PasswordChange  :submit').click(function(){
        $('#Form-PasswordChange').find('span.error').remove();
        var data = $('#Form-PasswordChange').serializeArray();
        // alert(data[2].value);
        if(data[2].value == ""){
            $("#Form-PasswordChange [name='change_pass_1']").after('<span class="error">This field cannot be blank.</span>')
            return false;
        }else{
            if(data[3].value == ""){
            $("#Form-PasswordChange [name='change_pass_2']").after('<span class="error">This field cannot be blank.</span>')
            return false;
            }else{
                if(data[2].value != data[3].value){
                $("#Form-PasswordChange [name='change_pass_2']").after('<span class="error">Password does not match.</span>')
                return false;
                }else{
                    return true;
                }
            }
        }
    });


    $('#change_password').click(function(){
        // alert("Btn working");
        $('#new_password').val('');
        $('#new_password_error').html('');
        $('#passwordModal').modal('show');
    });
    $('#Form-changePassword').submit(function(e){
        e.preventDefault();
        var val = $('#new_password').val();
        if(val == ''){
            $('#new_password_error').html("Password cannot be empty");
        }else{
            $.ajax({
                url : "/user/password",
                type : "POST",
                // dataType: 'json',
                data : {val : val},
                success : function(data){
                    // alert(data);
                    if(data == 'true'){
                        new PNotify({title: 'Success',text: 'Sucessfully updated!',type: 'success'});
                        $('#passwordModal').modal('hide');
                    }else{
                        new PNotify({title: 'Failed',text:  'Failed to update!',type: 'error'});
                    }
                    // new PNotify({title: 'Success',text: 'Sucessfully deleted',type: 'success'});
                },
                error: function (error){
                    // alert(error);
                    console.log(error);
                }
            });
        }
    });
});