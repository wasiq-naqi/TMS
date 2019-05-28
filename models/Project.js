const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    ownerID : String,
    ownerName : String
});

const projectSchema = new mongoose.Schema({
    name : { type :String , required : [true, "Project name is required"]},
    detail : { type :String , required : [true, "Project details are required"]},
    createdAt : { type : Date, default : Date.now },
    status : {type : Boolean, default : true},
    createdBy : ownerSchema
});

const Project = new mongoose.model('projects', projectSchema);
const Owner = new mongoose.model('taskProjects', ownerSchema);

module.exports.Project = Project;
module.exports.projectOwner = Owner;