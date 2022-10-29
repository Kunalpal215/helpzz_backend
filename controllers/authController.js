const user = require("../models/userModel");
exports.signupController = async (req,res) => {
    let useremail = req.body.useremail;
    let userpassword = req.body.userpassword;
    let username = req.body.username;
    const check = await user.findOne({$or : [{"useremail" : useremail},{"username" : username}]});
    if(check){
        res.status(400).json({"result" : "useremail or username is already in use"});
        return;
    }
    const hashedPassword = bcryptjs.hashSync(userpassword,10);
    userpassword=hashedPassword;
    const newUser = user({useremail: useremail,userpassword: userpassword, username : username });
    const savedUser = await newUser.save();
    if(savedUser){
        res.json({"result" : "Signed up Successfully"});
        return;
    }
    res.status(400).json({"result" : "An error occured while signing up"});
};

exports.loginController = async (req,res) => {
    let useremail = req.body.useremail;
    let userpassword = req.body.userpassword;
    const dbUser = await user.findOne({useremail : useremail});
    if(!dbUser){
        res.status(400).json({"result" : "Useremail or Password maybe incorrect"});
        return;
    }
    let validPassword = bcryptjs.compareSync(userpassword,dbUser.userpassword);
    if(validPassword==false){
        res.status(400).json({"result" : "Useremail or Password maybe incorrect"});
        return;
    }
    res.json({"result" : "Loggedin Successfully"});
};