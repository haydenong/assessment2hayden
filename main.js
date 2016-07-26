var mysql = require("mysql");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var q = require("q");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123",
    database: "library",
    connectionLimit: 4
});

const findAllStmt = "select * from books where title = ? or author_firstname like ? or author_lastname like ? limit ? offset ?";
const findOneStmt = "select * from books where id = ?";

var makeQuery = function (sql, pool) {
    return function (args) {
        console.log("args", args)
        args[1] = "%" + args[1] + "%";
        args[2] = "%" + args[2] + "%"
        var defer = q.defer();
        pool.getConnection(function (err, conn) {
            if (err) {
                defer.reject(err);
                return;
            }
            conn.query(sql, args || [], function (err, results) {
                console.log(results)
                conn.release();
                if (err) {
                    defer.reject(err);
                    return;
                }
                defer.resolve(results);
            });
        });

        return defer.promise;
    };
}

var findAll = makeQuery(findAllStmt, pool);
var findOne = makeQuery(findOneStmt, pool);

app.get("/api/books", function (req, res) {
    var limit = parseInt(req.query.limit) || 50;
    var offset = parseInt(req.query.offset) || 0;
    var title = req.query.title;
    var author = req.query.author;

    findAll([title, author, author,limit, offset])
        .then(function (results) {
            console.log(results);
            res.status(200).json(results);
        })
        .catch(function(err) {
            console.log(err)
            return res.status(500).end()
        })
});

app.get("/api/book/:id", function (req, res) {
    findOne([req.params.id])
        .then(function (results) {
            console.log(results)
            if (results) {
                res.status(200).json(results[0]);
            }
            else {
                res.status(404).end();
            }
        });
});

app.use(express.static(__dirname + "/public"));


var port = process.argv[2] || 3000;
app.set("port", port);
app.listen(app.get("port"), function () {
    console.info("Web server started on port %d", app.get("port"));
});


function handleError(err, res) {
    console.error(err);
    res.status(500).end();
};