const express = require('express');
const router = express.Router();

//글 목록 보기
const list = require('./list.js');
router.use('/list', list);

//글 등록
const register = require('./register.js');
router.use('/register', register);

//글 삭제
const remove = require('./delete.js');
router.use('/delete', remove);

module.exports = router;