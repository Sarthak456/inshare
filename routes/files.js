const router = require('express').Router();                 //importing the router

const multer = require('multer');                           //importing multer

const path =require('path');                                //importing path

const File = require('../models/file');                     //importing file of js

const { v4: uuid4 } = require('uuid');

let storage =multer.diskStorage({                           //creating configuration of multer
    destination: (req, file, cb) => cb(null, 'uploads/'),   //destination where we want to store our file
    
    filename: (req, file, cb) => {                          //giving unique name to the file
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let uplaod =multer({
    storage,                                                //storage data
    limit : { fileSize: 1000000 * 100},                     //giving file size limit
}).single('myfile');

router.post('/', (req, res)=>{                              //adding post method on router variable

    //store file
    uplaod(req, res, async (err) => {                                //upload the file

        //validate the request
        if(!req.file)                                           //if file not recived
        {
            return res.json({error : "FILE NOT RECEIVED"});
        }

        if(err) {
            return res.status(500).send({ error: err.message})
        }
        //store in database
        const file = new File({
             filename: req.file.filename,
             uuid: uuid4(),
             path: req.file.path,
             size: req.file.size
        });
        const response = await file.save();                 //saving the file
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});
    });

    //response -> download link
});               

router.post('/send', async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;
    //validate request
    if(!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields required'});
    }

    //Get the data from database
    const file = await File.findOne({ uuid: uuid});
    if(file.sender) {
        return res.status(422).send({ error: 'Email already send'});
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    //send email
    const sendMail = require('../services/emailService');
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'inshare File Sharing',
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplete') ({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + ' KB',
            expires: '24 hours'
        })
    });

    return res.send({ success: true});

});

module.exports = router;                                    //exporting the router