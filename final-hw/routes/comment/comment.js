const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const moment = require('moment');

const jwt = require('../../module/jwt.js');

//특정 게시물의 코멘트 보기
router.get('/:board_idx', async (req,res) => {
    let board_idx = req.params.board_idx;

    let getCommentQuery = "SELECT * FROM comment where board_idx = ? ORDER BY comment_idx DESC";
    let getCommentResult = await db.queryParam_Arr(getCommentQuery, [board_idx]);

    if(!getCommentResult){
        res.status(500).send({
            message : "Internal Server Error" 
        })
    } else{
        res.status(200).send({
            message : "Successfully Get Comment Data",
            data : getCommentResult
        })
    }
})

//특정 글의 코멘트 작성
router.post('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);
    
    console.log(decoded);

    let comment_content = req.body.comment_content;
    let comment_writetime = moment().format('YYYY-MM-DD hh:mm:ss');
    let user_idx = decoded.user_idx;
    let board_idx = req.body.board_idx;


    if(!comment_content || !board_idx || !user_idx || !comment_writetime){
        console.log("Comment : NULL");

        res.status(400).send({
            message : "Null Value"
        })
    } else{
        let insertCommentQuery = "INSERT INTO comment(comment_content, comment_writetime, user_idx, board_idx) VALUES(?,?,?,?)";
        let insertCommentResult = await db.queryParam_Arr(insertCommentQuery, [comment_content, comment_writetime, user_idx, board_idx]);

        if(!insertCommentResult){
            console.log("Comment Insert Error");

            res.status(500).send({
                message : "Internal Server Error"
            })
        } else{
            res.status(201).send({
                message : "Successfully Register Comment Data", 
                data : insertCommentResult
            })
        }
    }
})

//코멘트 삭제
router.post('/delete', async (req, res) => {
	let comment_idx = req.body.comment_idx;

	let checkQuery = "SELECT comment_idx FROM comment WHERE comment_idx = ?";
	let checkResult = await db.queryParam_Arr(checkQuery,[comment_idx]);

	if(!checkResult) {
        console.log("Delete : Comment Check Error");

		res.status(500).send({
			message : "Internal Server Error"
		})
	} else if(checkResult.length == 1){
		let deleteQuery = "DELETE FROM comment WHERE comment_idx = ?";
		let deleteResult = await db.queryParam_Arr(deleteQuery, [comment_idx]);

		if(!deleteResult){
			res.status(500).send({
				message : "Internal Server Error"
			})
		} else{
			res.status(201).send({
				message : "Successfully Delete Comment Data"
			})
		}
	}
	
});

module.exports = router;