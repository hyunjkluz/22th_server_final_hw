const express = require('express');
const router = express.Router();

//북마크 리스트
const list = require('./list.js');
router.use('/list', list);

//북마크 추가
const add = require('./add.js');
router.use('/add', add);


module.exports = router;