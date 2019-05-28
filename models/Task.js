const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    ownerID : String,
    ownerName : String
});

const projectSchema = new mongoose.Schema({
    projectID : {
        type : String,
        required : [true , "Projects are required"]
    },
    projectName : String
});

const taskSchema = new mongoose.Schema({
    project : projectSchema,
    detail : {
        type : String,
        required : [true, "Task details are required"]
    },
    date : {
        type : String,
        required : [true, "Task date are required"]
    },
    time : {
        type : String,
        required : [true, "Task hours are required"]
    },
    createdAt : { type : Date, default : Date.now },
    createdBy : ownerSchema
});

const Task = new mongoose.model('task', taskSchema);
const owner = new mongoose.model('taskCreatedBy', ownerSchema);
const project = new mongoose.model('taskProject', projectSchema);

module.exports.Task = Task;
module.exports.taskOwner = owner;
module.exports.taskProject = project;