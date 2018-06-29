const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.post('/', async (req, res)=>{
	let board_idx = req.body.board_idx;

	let checkQuery = "SELECT board_idx FROM board where board_idx = ?";
	let checkResult = await db.queryParam_Arr(checkQuery,[board_idx]);

	if(!checkResult){
		res.status(500).send({
			message : "Internal Server Error"
		})
	} else if(checkResult.length == 1){
		let deleteQuery = "DELETE FROM board where board_idx = ?";
		let deleteResult = await db.queryParam_Arr(deleteQuery, [board_idx]);

		if(!deleteResult){
			res.status(500).send({
				message : "Internal Server Error"
			})
		} else{
			res.status(201).send({
				message : "Successfully Delete Board Data"
			})
		}
	}
	
});

module.exports = router;