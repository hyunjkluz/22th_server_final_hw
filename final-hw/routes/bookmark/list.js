const express = require('express');
const router = express.Router();

const request=require('async');
const db = require('../../module/pool.js');

router.get('/:user_idx', async (req, res) => {
    let user_idx = req.params.user_idx;

    if (!user_idx) {
        res.status(403).send( {
            message : "No user_idx input"
        });
    } else {
        let getBookmarkQuery = 'SELECT bm.bookmark_idx, b.* FROM board as b JOIN bookmark as bm ON bm.user_idx = b.user_idx where b.user_idx = ?';
        let getBookmarkResult = await db.queryParam_Arr(getBookmarkQuery, [user_idx]);

        if (!getBookmarkResult) {
            console.log("getBookmark Error");

            res.status(500).send( {
                message : "Internal Server Error"
            });
        } else {
            res.status(200).send( {
                message : "Successfully Get BoardList Data",
                data : getBookmarkResult
            });
        }
    }
    
});

module.exports = router;