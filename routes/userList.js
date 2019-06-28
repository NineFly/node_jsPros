var express = require('express');
var router = express.Router();

var mysql=require('mysql');
var url = require('url');
//实现本地链接
var pool = mysql.createPool({
    host: 'localhost',
    
    database: 'first_db',
    port: '3306'
});

//默认情况下是不允许执行多条查询语句的。要使用多条查询语句的功能，就需要在创建数据库连接的时候打开这一功能
mysql.createConnection( { multipleStatements: true } );

function query( sql, values ) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection){
            connection.query(sql, values, function(err, results){
                if(err) {
                    reject( err );
                } else {
                    results = JSON.stringify(results);
                    results = JSON.parse(results);
                    resolve( results );
                }
            });
            connection.release();
        });
    });
};

router.get('/save', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json; charset=utf-8")

    var reqUrl = req.url;
    var reqObj  = url.parse(reqUrl,true).query;
    var name = reqObj.name,
     sex = reqObj.sex,
     age = reqObj.age,
     hobbies = reqObj.hobbies;

    var sql = 'INSERT INTO user SET ' +
        'name=\'' + name + '\', sex=' + sex +
        ', age= ' + age + ', hobbies=\'' + hobbies + '\';';

    query(sql, '').then(function (result) {
        res.send('OK,保存数据成功');
    },function (error) {

    });
});

router.get('/delete', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json; charset=utf-8")

    var reqUrl = req.url,
     reqObj  = url.parse(reqUrl,true).query,
     id = reqObj.id;

    var sql = 'delete from user where id=' + id;

    console.log(JSON.stringify(sql))
    query(sql, '').then(function (result) {
        res.send('OK,删除数据成功');
    },function (error) {

    });
});

router.get('/update', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json; charset=utf-8")

    var reqUrl = req.url;
    var reqObj  = url.parse(reqUrl,true).query;
    var id = reqObj.id,
     name = reqObj.name,
     sex = reqObj.sex,
     age = reqObj.age,
     hobbies = reqObj.hobbies;

    var sql = 'UPDATE user SET name=\'' + name +
        '\', sex= ' + sex +
        ', age= ' + age +
        ', hobbies=\'' + hobbies + '\' ' +
        'where id =' + id + ';';

    console.log(JSON.stringify(sql))
    query(sql, '').then(function (result) {
        res.send('OK,更新数据成功');
    },function (error) {

    });
});

router.get('/getUserList', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json; charset=utf-8");

    query('SELECT * FROM user', '').then(function (result) {
        res.send(JSON.stringify(result));
    },function (error) {

    });
});


module.exports = router;
