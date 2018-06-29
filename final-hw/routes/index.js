const express = require('express');
const router = express.Router();


//계정관리 (로그인, 회원가입)
const users = require('./users/index.js');
router.use('/users',users);

//게시판 화면 (게시판 글 등록)
const main = require('./board/index.js');
router.use('/board',main);


//북마크 (북마크 리스트, 북마크 등록)
const bookmark = require('./bookmark/index.js');
router.use('/bookmark',bookmark);

//게시판 코멘트 (코멘드 작성, 삭제, 검색)
const comment = require('./comment/index.js');
router.use('/comment', comment);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// 현재 js 파일을 다른 파일에서 사용할 수 있도록 exports
module.exports = router;
