const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.get('/', async (req, res) => {
    let getQuery = 'SELECT * from board ORDER BY board_writetime DESC';
    let getResult = await db.queryParam_None(getQuery);

    if (!getResult) {
        console.log("list : Error");
        res.status(500).send ({
            message : "Internal Server Error"
        });
    } else {
        console.log("Get Board OK");
        res.status(200).send ({
            message : "Successfuly Get Board List",
            data : getResult
        });
    }
});

module.exports = router;