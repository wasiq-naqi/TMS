const express = require('express');
const app = express();
const path = require('path');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const redirectIfAuth = require('./middleware/redirectIfAuth');
const Auth = require('./middleware/authUser');
const AuthRole = require('./middleware/authRole');

//Configuration
PORT = 80;

//Database
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/tms', { useNewUrlParser: true })
        .then(() => { console.log('Connect to MongoDB..') })
        .catch((err) => { console.log(`Conection to MongoDB failed\nError: ${err}`) });

//Routes
const projects = require('./routes/projects');
const users = require('./routes/users');
const tasks = require('./routes/tasks');
const login = require('./routes/login');

//Middleware
app.use(expressSession({
    secret : 'wasiq.naqi',
    resave: false,
    saveUninitialized: true,
}));
app.use('/project', Auth, AuthRole, projects);
app.use('/user', Auth, AuthRole, users);
app.use('/task', Auth,  tasks);
app.use('/login', redirectIfAuth , login);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

//Routing
app.get('/',  (req, res) => {
    // console.log(req.session);
    app.locals.role = req.session.UserRole;
    if(req.session.UserRole == 'Admin'){
        res.redirect('/project');
    }else{
        res.redirect('/task');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        return res.redirect('/login');
    })
});


//If Not found any request 
app.get('*', function(req, res){
    let data = {
        "pageTitle" : "Page Not Found",
        "pageType" : "404"
    }; 
    res.status(404).render('./pages/404', data);
  });
  

//Starting App
app.listen(PORT, () => {
    console.log(`App is listning on PORT: ${PORT}`);
});

