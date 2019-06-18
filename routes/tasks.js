const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { Project } = require('../models/Project');
const { Task, taskOwner, taskProject } = require('../models/Task');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended : true }));

router.get('/', (req, res) => {
    // console.log(req.session.UserRole);
    async function getTasks(){
        let tasks = '';
        let role = req.session.UserRole;
        var ObjectId = require('mongodb').ObjectId;
        var o_id = ObjectId(req.session.UserID);
        // console.log(req.session.UserID);
        // console.log(o_id);
        if(role == 'Admin'){
            tasks = await Task.find()
            .sort({ _id: 1});
        }else{
            tasks = await Task.find({"createdBy.ownerID" : o_id})
            .sort({ _id: 1});
        }
        // console.log(tasks);
            let data = {
                "pageTitle" : "Task",
                "pageType" : "list",
                "pageTasks" : tasks,
                "session" : req.session
            };
            res.render('pages/task', data);
        
    }
    getTasks();
    
})

// router.get('/add', (req, res) => {
    
//     async function getProject(){
//         const projects = await Project.find();
//         // console.log(projects);
//             let data = {
//                 "pageTitle" : "Task",
//                 "pageType" : "add",
//                 "pageProject" : projects,
//                 "session" : req.session
//             };
//             res.render('pages/task', data);
        
//     }
//     getProject();
// });

router.post('/add' , (req, res) => {

    Project.findById(req.body.task_project)
    .then((result) => {
        let task = new Task ({
            project : new taskProject({
                projectID : result._id, 
                projectName : result.name
            }),
            detail : req.body.task_description,
            date : req.body.task_date,
            time : req.body.task_time,
            createdBy : new taskOwner({
                ownerID : req.session.UserID,
                ownerName : req.session.UserName 
            }) 
        });

        task.save()
        .then((result_1) => {
            var record = {
                status : '200',
                data : result_1
            }
            // console.log(result_1);
            res.status(200).send(record);
        })
        .catch((error_1) => {
            var record = {
                status : '400',
                data : error_1
            }
            res.status(400).send(record);
        })


    })
    .catch((error) => {
        var record = {
            status : '400',
            data : error
        }
        res.status(400).send(record);
    })
 
});

// router.post('/add' , (req, res, err) => {
    
//     // console.log(req.body);

//     async function saveTask(){
//     const projects = await Project.find();
    
//     let task = new Task ({
//         project : new taskProject({
//             projectID : req.body.task_project, 
//             projectName : req.body.task_project_name
//         }),
//         detail : req.body.task_details,
//         date : req.body.task_date,
//         time : req.body.task_time,
//         createdBy : new taskOwner({
//             ownerID : req.session.UserID,
//             ownerName : req.session.UserName 
//         })
        
//     });

//     task.save()
//         .then((result) => { 
//             let data = {
//                 "pageTitle" : "Add Task",
//                 "pageType" : "add",
//                 "pageNotification" : { type : "success", message : "Task added successfully."},
//                 "pageTask" : task,
//                 "pageProject" : projects,
//                 "errors" : "",
//                 "session" : req.session
//             };
//             res.render('./pages/task', data);
//         })
//         .catch((err) => {
//             // console.log(error);
//             const cusError = {};
//             if (err.errors) {
//             const keys = Object.keys(err.errors);
//             keys.forEach((key) => {
//                 let message = err.errors[key].message;
//                 // message = message.replace('Path ', '').replace('`'+key+'`', key.charAt(0).toUpperCase() + key.substring(1)).trim();
//                 cusError[key] = message;
//             });
//             }else{
//                 if(typeof err.code != 'undefined'){
//                     cusError['errCode'] = err.code;
//                 }
//             }

//             // console.log(task);
//             // console.log(cusError);
//             // console.log(err.errors); 
//             let data = {
//                 "pageTitle" : "Add Task",
//                 "pageType" : "add",
//                 "pageNotification" : { type : "error", message : "Task not added."},
//                 "pageTask" : task,
//                 "pageProject" : projects,
//                 "errors" : cusError,
//                 "session" : req.session
//             };
//             res.render('./pages/task', data);
//         })
//     }


//     saveTask();
    
// });

// router.get('/edit/:id', (req, res) => {
//     async function getTask(){
//         const projects = await Project.find();
//         const task = await Task.findById(req.params.id)
//         .catch((err) =>{
//             // console.log(err);
//         })
        
//         if(!task){
//             res.render('./pages/404');
//         }else{
//             // console.log(user);
//             let data = {
//                 "pageTitle" : "Edit Task",
//                 "pageType" : "edit",
//                 "pageTask" : task,
//                 "pageProject" : projects,
//                 "session" : req.session
//             };
//             res.render('./pages/task', data);
//         }
//     }
//     getTask();
// });

// router.post('/edit/:id', (req, res) => {
//     async function updateTask(){
//         // console.log('ID :',req.body.user_id);
//         const projects = await Project.find();
//         const task = await Task.findById(req.body.task_id)
//         .catch((err) =>{
//             // console.log(err);
//         })
        
//         if(!task){
//             // console.log('User not found');
//             res.render('./pages/404');
//         }else{
//             // console.log('Body :', req.body);

//             // task.name = req.body.task_project;
//             task.detail = req.body.task_details;
//             task.date = req.body.task_date;
//             task.time = req.body.task_time;
            
//             task.save()
//             .then((result) => {
//                 // console.log('task Updated' );
//                 let data = {
//                     "pageTitle" : "Edit Task",
//                     "pageType" : "edit",
//                     "pageNotification" : { type : "success", message : "Task updated successfully."},
//                     "pageTask" : task,
//                     "pageProject" : projects,
//                     "errors" : "",
//                     "session" : req.session
//                 };
//                 res.render('./pages/task', data);
//             })
//             .catch((err) => {
//                 const cusError = {};
//                 if (err.errors) {
//                 const keys = Object.keys(err.errors);
//                 keys.forEach((key) => {
//                     let message = err.errors[key].message;
//                     // message = message.replace('Path ', '').replace('`'+key+'`', key.charAt(0).toUpperCase() + key.substring(1)).trim();
//                     cusError[key] = message;
//                 });
//                 }else{
//                     if(typeof err.code != 'undefined'){
//                         cusError['errCode'] = err.code;
//                     }
//                 }
//                 // console.log(err);
//                 let data = {
//                     "pageTitle" : "Edit Task",
//                     "pageType" : "edit",
//                     "pageTask" : task,
//                     "pageNotification" : { type : "error", message : "Task not updated."},
//                     "errors" : cusError,
//                     "pageProject" : projects,
//                     "session" : req.session
//                 };
//                 res.render('./pages/task', data);
//             })
//             // console.log(result);

            
//         }
//     }
//     updateTask();
// });

router.delete('/delete', (req, res) => {
    let id = req.body.id;
    Task.deleteOne({ _id : id})
    .then((result) =>{
        res.send(true);
    })
    .catch((err) => {
        res.send(false);
    })
});

router.post('/project', (req, res) => {
    Project.find({status : "Active"})
    .then((result) =>{
        var records = {
            status : '200',
            data : result
        }
        // console.log(result);
        res.status(200).send(records);
    })
    .catch((error) => {
        var records = {
            status : '400',
            data : error
        }
        res.status(400).send(records);
    })
});

router.post('/getSingle', (req, res) => {
    // console.log(req.body);
    Task.findById(req.body.id)
    .then((result) => {
        // console.log(result);
        var record = {
            status : '200',
            data : result
        }
        res.status(200).send(record);
    })
    .catch((error) => {
        // console.log(error);
        var record = {
            status : '400',
            data : error
        }
        res.status(200).send(record);
    })
        
});

router.put('/update', (req, res) => {
    // console.log(req.body);
    
    Task.findById(req.body.task_id)
    .then((result) => {
        result.detail = req.body.task_description;
        result.date = req.body.task_date;
        result.time = req.body.task_time;

        result.save()
        .then((result_1) => {
            var record = {
                status : '200',
                data : result_1
            }
            // console.log(record);
            res.status(200).send(record);
        })
        .catch((error_1) => {
            // console.log(error_1);
            var record = {
                status : '400',
                data : error_1
            }
            res.status(400).send(record);
        })
    })
    .catch((error) => {
        var record = {
            status : '400',
            data : error
        }
        res.status(400).send(record);
    })
});

module.exports = router;