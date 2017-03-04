var express = require('express');
var app = express(); 
var bodyParser = require('body-parser');

var algorithm = require('./algorithm.js');
var solver = new algorithm;

console.log(solver.solve_board);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;   

var router = express.Router();

router.post('/', function(req, res) {
    var board = [];
    for (var i=0; i<5; i++){
        board.push([])
        for (var j=0; j<6; j++){
            board[i].push(req.body.board[i*6+j])
        }
    }

    var weights = new Array(6);
    for (var i = 0; i < 6; ++ i) {
        weights[i] = {
            normal: req.body.weights[2*i],
            mass: req.body.weights[2*i+1],
        };
    }

    solver.solve_board(board, weights, function(solutions){
        console.log(solutions[0]);
        res.json({cursor: solutions[0].init_cursor, path: solutions[0].path});
    });  
});

app.use('/api', router);

app.listen(port);

console.log("Server Initialized");