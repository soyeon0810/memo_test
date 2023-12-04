const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { connect } = require('http2');

//데이터베이스 연결
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '19651025',
    database: 'memo_test'
});

//세션 설정
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'abcdefg',
    cookie:{
        httpOnly: true,
        secure: false,
    },
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connection.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
        return;
    }
    console.log('MySQL에 성공적으로 연결되었습니다.');
});

app.use(express.static(__dirname));

app.get('/login.html',(req, res) => {});
app.get('/join.html',(req, res) => {});

//회원가입
app.post('/join', (req, res) => {
    const id = req.body.id;
    const pw = req.body.pw;
    const username = req.body.username;

    const sql = 'INSERT INTO user (id, username, pw) VALUES (?, ?, ?)';
    const params = [id, username, pw];

    const checkid = 'SELECT * FROM user WHERE id=?';
    const checkidparams = [id];

    connection.query(checkid, checkidparams, (error, checkidResults) => {
        if (error) {
            console.error('아이디 확인 오류:', error);
        } else {
            if (checkidResults && checkidResults.length > 0) {
                console.log("이미 존재하는 아이디 입니다.");
            } else {
                connection.query(sql, params, (err, results) => {
                    if (err) {
                        console.error('데이터 삽입 오류:', err);
                    } else {
                        console.log('데이터 삽입 성공:', results);
                        res.redirect('/login.html');
                    }
                });
            }
        }
    });
});

//로그인
app.post('/login', (req, res) => {
    const id = req.body.loginid;
    const pw = req.body.loginpw;

    console.log(id, pw);
    const checkid = 'SELECT * FROM user WHERE id=?';
    const checkidparams = [id];

    connection.query(checkid, checkidparams, (error, checkidResults) => {
        if (error) {
            console.error('아이디 확인 오류:', error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Query Parameters:', checkidparams);
            console.log('Query Results:', checkidResults);

            if (checkidResults && checkidResults.length > 0) {
                const userID = checkidResults[0].id;
                req.session.userID = userID;
                console.log('로그인 성공. 세션에 저장된 userID:', req.session.userID);
                res.redirect('/main.html');
            } else {
                console.log("존재하지 않는 아이디입니다.");
                res.status(401).send('Unauthorized');
            }
        }
    });
});

//메모 등록
app.post('/load', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    const userID=req.session.userID;
    console.log('메모 등록. 세션에서 가져온 userID:', req.session.userID);

    const sql = 'INSERT INTO memo (title, content,userid) VALUES (?, ?, ?)';
    const params = [title, content, userID];

    connection.query(sql, params, (error) => {
        if (error) {
            console.error('메모 저장 오류', error);
        } else {
            res.redirect('/main.html');
        }
    });
});

app.listen(port, () => {});