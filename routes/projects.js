const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const router = express.Router();
const {Project, projectOwner} = require('../models/Project');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended : true }));

router.get('/', (req, res) => {
    async function getProjects(){
        let projects = await Project.find()
        .sort({ _id: -1});
        // console.log(projects);

        let data = {
            "pageTitle" : "Projects",
            "pageType" : "list",
            "records" : projects,
            "session" : req.session
        };
        res.render('pages/project', data);
    } 
    getProjects();
    
});

router.get('/add', (req, res) => {
    let data = {
        "pageTitle" : "Add Project",
        "pageType" : "add",
        "session" : req.session
    };
    res.render('./pages/project', data);
});
router.get('/edit/:id', (req, res) => {
    async function getProject(){
        const project = await Project.findById(req.params.id)
        .catch((err) =>{
            // console.log(err);
        })

        if(!project){
            res.render('./pages/404');
        }else{
            // console.log(user);
            let data = {
                "pageTitle" : "Edit Project",
                "pageType" : "edit",
                "pageProject" : project,
                "session" : req.session
            };
            res.render('./pages/project', data);
        }
    }
    getProject();
    // let data = {
    //     "pageTitle" : "Edit Project",
    //     "pageType" : "edit"
    // };
    // res.render('./pages/project', data);
});

router.post('/add', (req, res) => {

    let project = new Project({
        name : req.body.project_name,
        detail : req.body.project_details,
        createdBy : new projectOwner({
            ownerID : req.session.UserID,
            ownerName : req.session.UserName
        }) 
    });

    // console.log(req.body);
    // console.log(project);
    project.save()
    .then((result) => {
        let data = {
            "pageTitle" : "Add Project",
            "pageType" : "add",
            "pageNotification" : { type : "success", message : "Project added sucessfully."},
            "session" : req.session
        };
        res.render('./pages/project', data);
    })
    .catch((err) => {
        const cusError = {};
        if (err.errors) {
        const keys = Object.keys(err.errors);
        keys.forEach((key) => {
            let message = err.errors[key].message;
            // message = message.replace('Path ', '').replace('`'+key+'`', key.charAt(0).toUpperCase() + key.substring(1)).trim();
            cusError[key] = message;
        });
        }else{
            if(typeof err.code != 'undefined'){
                cusError['errCode'] = err.code;
            }
        }

        let data = {
            "pageTitle" : "Add Project",
            "pageType" : "add",
            "pageNotification" : { type : "error", message : "Failed to add project."},
            "errors" : cusError,
            "session" : req.session
        };
        res.render('./pages/project', data);
    })
    // console.log(req.body);
    // res.redirect('/project/add');
});

router.post('/edit/:id', (req, res) => {
    async function updateProject(){
        // console.log('ID :',req.body.project_id);
        const project = await Project.findById(req.body.project_id)
        .catch((err) =>{
            // console.log(err);
        })
        
        if(!project){
            // console.log('User not found');
            res.render('./pages/404');
        }else{
            // console.log('Body :', req.body);

            project.name = req.body.project_name;
            project.detail = req.body.project_details;
            
            project.save()
            .then((result) => {
                // console.log('Project Updated' );
                let data = {
                    "pageTitle" : "Edit Project",
                    "pageType" : "edit",
                    "pageProject" : project,
                    "pageNotification" : { type : "success", message : "Project updated sucessfully."},
                    "errors" : "",
                    "session" : req.session
                };
                res.render('./pages/project', data);
            })
            .catch((err) => {
                const cusError = {};
                if (err.errors) {
                const keys = Object.keys(err.errors);
                keys.forEach((key) => {
                    let message = err.errors[key].message;
                    // message = message.replace('Path ', '').replace('`'+key+'`', key.charAt(0).toUpperCase() + key.substring(1)).trim();
                    cusError[key] = message;
                });
                }else{
                    if(typeof err.code != 'undefined'){
                        cusError['errCode'] = err.code;
                    }
                }
                // console.log(err);
                let data = {
                    "pageTitle" : "Edit Project",
                    "pageType" : "edit",
                    "pageProject" : project,
                    "pageNotification" : { type : "error", message : "Failed to update project."},
                    "errors" : cusError,
                    "session" : req.session
                };
                res.render('./pages/project', data);
            })
            // console.log(result);

            
        }
    }
    updateProject();
});

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
module.exports = router;