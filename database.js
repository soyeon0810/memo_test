// 필요한 모듈을 불러옵니다.
const mysql = require('mysql2');

// MySQL 연결 정보를 설정합니다.
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '19651025',
    database: 'memo_test'
});

// MySQL에 연결합니다.
connection.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
        return;
    }
    console.log('MySQL에 성공적으로 연결되었습니다.');

    // 삽입할 데이터를 정의합니다.
    const data = {
        ID: 'sy0834',
        PW: '비밀번호야',
        NAME: '주소연'
    };

    // SQL 쿼리를 정의합니다.
    const sql = 'INSERT INTO user (id, pw, username) VALUES (?, ?, ?)';
    const params = [data.ID, data.PW, data.NAME];

    // 데이터를 삽입합니다.
    connection.query(sql, params, (queryErr, results) => {
        if (queryErr) {
            console.error('데이터 삽입 오류:', queryErr);
        } else {
            console.log('데이터 삽입 성공:', results);
        }

        // MySQL 연결을 종료합니다.
        connection.end();
    });
});