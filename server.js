const express = require('express');
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
            res.status(500).send('아이디 확인 오류');
        } else {
            if (checkidResults && checkidResults.length > 0) {
                res.status(400).send('이미 존재하는 아이디 입니다.');
            } else {
                connection.query(sql, params, (err, results) => {
                    if (err) {
                        console.error('데이터 삽입 오류:', err);
                        res.status(500).send('데이터 삽입 오류');
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
    const id = req.body.id;
    const pw = req.body.pw;

    const checkid = 'SELECT * FROM user WHERE id=?';
    const checkidparams = [id];

    connection.query(checkid, checkidparams, (error, checkidResults) => {
        if (error) {
            console.error('아이디 확인 오류:', error);
            res.status(500).send('아이디 확인 오류');
        } else {
            res.redirect('/main.html');
        }
    });
});

app.listen(port, () => {});