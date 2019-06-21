const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const router = express.Router();
const {Project, projectOwner} = require('../models/Project');
const { User } = require('../models/User');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended : true }));

router.get('/', (req, res) => {
    async function getProjects(){
        let users = await User.find().select({name: 1, email : 1});
        //console.log(users);
        let projects = await Project.find()
        .sort({ _id: 1});
        // console.log(projects);

        let data = {
            "pageTitle" : "Projects",
            "pageType" : "list",
            "records" : projects,
            "users" : users,
            "session" : req.session
        };
        res.render('pages/project', data);
    } 
    getProjects();
    
});

// router.get('/add', (req, res) => {
//     let data = {
//         "pageTitle" : "Add Project",
//         "pageType" : "add",
//         "session" : req.session
//     };
//     res.render('./pages/project', data);
// });
// router.get('/edit/:id', (req, res) => {
//     async function getProject(){
//         const project = await Project.findById(req.params.id)
//         .catch((err) =>{
//             // console.log(err);
//         })

//         if(!project){
//             res.render('./pages/404');
//         }else{
//             // console.log(user);
//             let data = {
//                 "pageTitle" : "Edit Project",
//                 "pageType" : "edit",
//                 "pageProject" : project,
//                 "session" : req.session
//             };
//             res.render('./pages/project', data);
//         }
//     }
//     getProject();
//     // let data = {
//     //     "pageTitle" : "Edit Project",
//     //     "pageType" : "edit"
//     // };
//     // res.render('./pages/project', data);
// });

router.post('/add', (req, res) => {
    let project = new Project({
        name : req.body.project_name,
        status : req.body.project_status,
        detail : req.body.project_description,
        users : req.body.project_users,
        createdBy : new projectOwner({
            ownerID : req.session.UserID,
            ownerName : req.session.UserName
        })
    });

    //console.log(project);

    if(req.session.UserRole == 'Admin'){

        project.save()
        .then((result) => {
            var record = {
                status : '200',
                data : result
            }
            res.status(200).send(record);
        })
        .catch((err) => {
            var record = {
                status : '400',
                data : err
            }
            res.status(400).send(record);      
        });
        
    }else{
        var record = {
            status : '404',
            data : "User not authorized."
        }
        res.status(400).send(err);
    }
    

});
    
router.post('/getSingle', (req, res) => {
    Project.findById(req.body.id)
    .then((result) => {
        // console.log(result);
        var record = {
            status : '200',
            data : result
        }
        res.status(200).send(record);
    })
    .catch((error) => {
        var record = {
            status : '400',
            data : error
        }
        res.status(200).send(record);
    })
        
});

// router.post('/add', (req, res) => {

//     let project = new Project({
//         name : req.body.project_name,
//         detail : req.body.project_details,
//         createdBy : new projectOwner({
//             ownerID : req.session.UserID,
//             ownerName : req.session.UserName
//         }) 
//     });

//     // console.log(req.body);
//     // console.log(project);
//     project.save()
//     .then((result) => {
//         let data = {
//             "pageTitle" : "Add Project",
//             "pageType" : "add",
//             "pageNotification" : { type : "success", message : "Project added sucessfully."},
//             "session" : req.session
//         };
//         res.render('./pages/project', data);
//     })
//     .catch((err) => {
//         const cusError = {};
//         if (err.errors) {
//         const keys = Object.keys(err.errors);
//         keys.forEach((key) => {
//             let message = err.errors[key].message;
//             // message = message.replace('Path ', '').replace('`'+key+'`', key.charAt(0).toUpperCase() + key.substring(1)).trim();
//             cusError[key] = message;
//         });
//         }else{
//             if(typeof err.code != 'undefined'){
//                 cusError['errCode'] = err.code;
//             }
//         }

//         let data = {
//             "pageTitle" : "Add Project",
//             "pageType" : "add",
//             "pageNotification" : { type : "error", message : "Failed to add project."},
//             "errors" : cusError,
//             "session" : req.session
//         };
//         res.render('./pages/project', data);
//     })
//     // console.log(req.body);
//     // res.redirect('/project/add');
// });

// router.post('/edit/:id', (req, res) => {
//     async function updateProject(){
//         // console.log('ID :',req.body.project_id);
//         const project = await Project.findById(req.body.project_id)
//         .catch((err) =>{
//             // console.log(err);
//         })
        
//         if(!project){
//             // console.log('User not found');
//             res.render('./pages/404');
//         }else{
//             // console.log('Body :', req.body);

//             project.name = req.body.project_name;
//             project.detail = req.body.project_details;
            
//             project.save()
//             .then((result) => {
//                 // console.log('Project Updated' );
//                 let data = {
//                     "pageTitle" : "Edit Project",
//                     "pageType" : "edit",
//                     "pageProject" : project,
//                     "pageNotification" : { type : "success", message : "Project updated sucessfully."},
//                     "errors" : "",
//                     "session" : req.session
//                 };
//                 res.render('./pages/project', data);
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
//                     "pageTitle" : "Edit Project",
//                     "pageType" : "edit",
//                     "pageProject" : project,
//                     "pageNotification" : { type : "error", message : "Failed to update project."},
//                     "errors" : cusError,
//                     "session" : req.session
//                 };
//                 res.render('./pages/project', data);
//             })
//             // console.log(result);

            
//         }
//     }
//     updateProject();
// });

router.delete('/delete', (req, res) => {
    let id = req.body.id;
    Project.deleteOne({ _id : id})
    .then((result) =>{
        res.send(true);
    })
    .catch((err) => {
        res.send(false);
    })
});

router.put('/update', (req, res) => {
    // console.log(req.body);
    Project.findById(req.body.id)
    .then((result) => {
        result.name = req.body.project_name;
        result.status = req.body.project_status;
        result.detail = req.body.project_description;
        result.users = req.body.project_users;
        
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
            var record = {
                status : '400',
                data : error_1
            }
            res.status(200).send(record);
        })
    })
    .catch((error) => {

    })
});
module.exports = router;