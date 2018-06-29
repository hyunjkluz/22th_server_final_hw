const express = require('express');
const router = express.Router();

const crypto = require('crypto-promise');		
const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

router.post('/', async (req, res) => {
    let user_id = req.body.user_id;
    let user_pw = req.body.user_pw;

    if (!user_id || !user_pw) {
        console.log("NULL");
        res.status(400).send( {
            message : "Null Value"
        })
    } else {
        let checkQuery = 'SELECT * FROM user WHERE user_id = ?';
        let checkResult = await db.queryParam_Arr(checkQuery, [user_id]);

        if (!checkResult) {
            res.status(500).send( {
                message : "Internal Server Error"
            })
        } else if (checkResult.length == 1) {
            let token = jwt.sign(checkResult[0].user_idx);
            
            let pwHashed = await crypto.pbkdf2(user_pw, checkResult[0].user_salt, 10000, 32, 'sha512');

            if (pwHashed.toString('base64') == checkResult[0].user_pw) {
                res.status(201).send( {
                    message : "Login Success",
                    data : {
						'checkResult' : checkResult,
						'token' : token
					}
                });
            } else {    //비밀번호 틀렸을 때
                console.log("pwd error");	
                res.status(400).send( {
                    message : "Login Failed : pw error"
                });
            }

        } else {
            console.log("id error");
            res.status(400).send( {
                message : "Login Failed : Id error"
            });
        }

    }
});

module.exports = router;