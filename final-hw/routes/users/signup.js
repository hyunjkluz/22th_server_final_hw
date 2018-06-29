const express = require('express');
const router = express.Router();

const crypto = require('crypto-promise');
const db = require('../../module/pool.js');

router.post('/', async (req, res) => {
    let user_id = req.body.user_id;
    let user_pw = req.body.user_pw;

    console.log("id : " + user_id +  "	pw : " + user_pw);

    if (!user_id || !user_pw) {
        res.status(400).send( {
            messag : "NULL Value"
        });
    } else {
        //입력받은 user_id가 원래 있는지 검사
        let selectQuery = 'SELECT * FROM user WHERE user_id = ?';
        let selectResult = await db.queryParam_Arr(selectQuery, [user_id]);

        if (!selectResult) {
            res.status(500).send( {
                message : "Internal Server Error"
            })
        } else if (selectResult.length == 1) {
            console.log("ID is already");
            res.status(400).send( {
                message : "ID Already Exists"
            });
        } else {
            //user_salt값 생성
            const salt = await crypto.randomBytes(32);
            const pwHashed = await crypto.pbkdf2(user_pw, salt.toString('base64'), 10000, 32, 'sha512');
       
            //users table에 새로운 user 등록
            let insertQuery = 'INSERT INTO user (user_id, user_pw, user_salt) values ( ?, ?, ?)';
            let insertResult = await db.queryParam_Arr(insertQuery, [user_id, pwHashed.toString('base64'), salt.toString('base64')]);
       
            if (!insertResult) {
                console.log("DB Insert Error");
                res.send(500).send( {
                    massage : "Internal Server Error"
                })
            } else {    //정상적으로 회원가입 완료
                console.log("Signin Success");
                res.status(201).send ( {
                    message : "Successfully Sign up"
                })
            }
        }
    }
});

module.exports = router;