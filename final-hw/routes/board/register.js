const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const moment = require('moment');

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const s3 = new aws.S3();
aws.config.loadFromPath('./config/aws_config.json');
const upload = require('../../config/multer.js');

const jwt = require('../../module/jwt.js');

router.post('/', upload.array('board_img'), async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);
    
    console.log(decoded);
    
    let board_title = req.body.board_title;
    let board_content = req.body.board_content;
    let board_img = req.files[0].location;
    let board_writetime = moment().format('YYYY-MM-DD HH:mm:ss');
    let user_idx = decoded.user_idx;

    if (! board_title || !user_idx) {
        res.status(400).send( {
            message : "Null Value"
        });
    } else {
        let registerQuery = 'INSERT INTO board(board_title, board_content, board_img, board_writetime, user_idx) VALUES ( ?, ?, ?, ?, ?)';
        let registerResult = await db.queryParam_Arr(registerQuery, [board_title, board_content, board_img, board_writetime, user_idx]);

		if (!registerResult) {
			res.status(500).send({
				message : "Internal Server Error"
			});
		} else {
			res.status(201).send({
                message : "Successful Register Board Data", 
                data : registerResult
			});
		}	
    }
});

module.exports = router;