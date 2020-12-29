const User = require('../models/user.js');
var multer = require('multer');

exports.create = (req, res) => {
    // Validate request
    if(!req.body) {
      return res.status(400).send({
      message: "Please fill all required field"
    });
    }
    const user = new User(req.body);
    user.save()
      .then(data => {
      res.send({status:200,message:"saved successfully",data});
    }).catch(err => {
        console.log(err.code);
       if(err.code===11000){
        res.status(500).send({
            message: "Email already exist"
          });
       }else{
        res.status(500).send({
            message: err.message || "Something went wrong while creating new user."
          });
       }
     
    });
};

exports.findAll = (req, res) => {
    User.find()
      .then(users => {
      res.send({status:200,users});
    }).catch(err => {
      res.status(500).send({
      message: err.message || "Something went wrong while getting list of users."
    });
    });
    };

    exports.update = (req, res) => {
        // Validate Request
        if(!req.body) {
          return res.status(400).send({
          message: "Please fill all required field"
        });
        }
        // Find user and update it with the request body
        User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then(user => {
         if(!user) {
           return res.status(404).send({
           message: "user not found with id " + req.params.id
         });
        }
        //res.send(user);
        res.send({status:200,message:"update successfully",user});
        }).catch(err => {
        if(err.kind === 'ObjectId') {
          return res.status(404).send({
          message: "user not found with id " + req.params.id
        });
        }
        if(err.code===11000){
            return res.status(500).send({
                message: "Email already exist"
              });
           }else{
            return res.status(500).send({
                message: "Error updating user with id " + req.params.id
              });
           }

        });
        };
    
        exports.delete = (req, res) => {
            User.findByIdAndRemove(req.params.id)
            .then(user => {
            if(!user) {
              return res.status(404).send({
              message: "user not found with id " + req.params.id
            });
            }
            res.send({message: "user deleted successfully!"});
            }).catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
              return res.status(404).send({
              message: "user not found with id " + req.params.id
            });
            }
            return res.status(500).send({
              message: "Could not delete user with id " + req.params.id
            });
            });
    };

    exports.uploadimage = async function (request, response) {
                try {
                    const folderpath = './uploads/';
                    var userId = request.query.name;
                    var storage = multer.diskStorage({
                        destination: function (req, file, cb) {
                         
                                cb(null, folderpath )
                        },
                        filename: function (req, file, cb) {
                            let filename=Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+Date.now();
                            if(file.mimetype=='image/jpeg'){
                                cb(null, filename+'.jpg' );
                            } else{
                                cb(null, filename+'.png' );
                            }
                           
                        }
                    });
                    var upload = multer({ storage: storage, limits: { fileSize: 4000000 } }).any();
    
                    upload(request, response,async function (err) {
                        if (err) {
                            if (err.code === 'LIMIT_FILE_SIZE') {
                                return response.send({ status: "403", message: "File too large max<2Mb" });
                            }else{
                                return response.send({ status: "403", message: err.message });
                            }
                           
                        } else {
                        
                            let file = {};
                            request.files.forEach(async function (f) {
                                     file.path = f.path.replace(/\\/g, '/');
                                    let a=file.path.indexOf("uploads");
                                    file.path=file.path.substr(a+7,a.length);
                                })
                                response.json({status:"200", message:'File has been uploaded',data: file});
                            };
                            
                        })
                    }
                catch (error) {
                        response.status(403).send({message: error.message});
                    
                    
                }
    }