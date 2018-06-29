const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

//북마크 추가 : 넘어오는 값이 있으면 = 삭제 / 없으면 = 등록
router.post('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);
    
    console.log(decoded);

    let user_idx = decoded.user_idx;
    let board_idx = req.body.board_idx;

    let checkQuery = 'SELECT * FROM bookmark WHERE user_idx = ? AND board_idx = ?';
    let checkResult = await db.queryParam_Arr(checkQuery, [user_idx, board_idx]);

    if (!checkResult) {
        console.log("Bookmark Check Error");

        res.status(500).send( {
            message : "Internel Server Error"
        });
    } else if (checkResult.length == 1) {   //이미 있으면 삭제하라는 의미
        let deleteQuery = 'DELETE FROM WHERE user_idx = ? AND board_idx = ?';
        let deleteResult = await db.queryParam_Arr(deleteQuery, [user_idx, board_idx]);

        if (!DeleteBookmark) {
            console.log("Bookmark Delete Error");

            res.status(500).send({
                message : "Internal Server Error"
            });
        } else {
            res.status(201).send({
                message : "Successful Delete Bookmark Data"
            });
        }
    } else {    //해당하는 값이 없으면 북마크에 추가하라는 의미
        let addQuery = 'INSERT INTO bookmark (user_idx, board_idx) VALUES (?, ?)';
		let addResult = await db.queryParam_Arr(addQuery, [user_idx, board_idx]);
		
		if (!addResult) {
            console.log("Bookmark Add Error");

			res.status(500).send({
				message : "Internal Server Error"
			});
		} else {
			res.status(201).send({
                message : "Successful Add Bookmark Data", 
                data : addResult
			});
		}
    }
});


module.exports = router;