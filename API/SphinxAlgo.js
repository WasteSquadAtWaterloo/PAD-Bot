var algorithm = function(){
    var ROWS = 5;
    var COLS = 6;
    var TYPES = 7;
    var ORB_X_SEP = 64;
    var ORB_Y_SEP = 64;
    var ORB_WIDTH = 60;
    var ORB_HEIGHT = 60;
    var MULTI_ORB_BONUS = 0.25;
    var COMBO_BONUS = 0.25;
    var MAX_SOLUTIONS_COUNT = ROWS * COLS * 8 * 2 * 5;

    var MAX_LENGTH = 40;
    var ALLOW_EIGHT = false;

    function make_rc(row, col) {
        return {row: row, col: col};
    }

    function make_match(type, count, cross) {
        return {type: type, count: count, cross: cross};
    }

    function to_xy(rc) {
        var x = rc.col * ORB_X_SEP + ORB_WIDTH/2;
        var y = rc.row * ORB_Y_SEP + ORB_HEIGHT/2;
        return {x: x, y: y};
    }

    function copy_rc(rc) {
        return {row: rc.row, col: rc.col};
    }

    function equals_xy(a, b) {
        return a.x == b.x && a.y == b.y;
    }

    function equals_rc(a, b) {
        return a.row == b.row && a.col == b.col;
    }

    function create_empty_board() {
        var result = new Array(ROWS);
        for (var i = 0; i < ROWS; ++ i) {
            result[i] = new Array(COLS);
        }
        return result;
    }

    function ensure_no_X(board) {
        for (var i = 0; i < ROWS; ++ i) {
            for (var j = 0; j < COLS; ++ j) {
                if (board[i][j] == 'X') {
                    throw 'Cannot have "?" orbs when solving.';
                }
            }
        }
    }

    function copy_board(board) {
        return board.map(function(a) { return a.slice(); });
    }

    function get_type(elem) {
        return elem.className.match(/e([\dX])/)[1];
    }

    function advance_type(type, dt) {
        if (type == 'X') {
            return '0';
        } else {
            var new_type = dt + +type;
            if (new_type < 0) {
                new_type += TYPES;
            } else if (new_type >= TYPES) {
                new_type -= TYPES;
            }
            return new_type;
        }
    }

    function find_matches(board) {
        var match_board = create_empty_board();
        // 1. filter all 3+ consecutives.
        //  (a) horizontals
        for (var i = 0; i < ROWS; ++ i) {
            var prev_1_orb = 'X';
            var prev_2_orb = 'X';
            for (var j = 0; j < COLS; ++ j) {
                var cur_orb = board[i][j];
                if (prev_1_orb == prev_2_orb && prev_2_orb == cur_orb && cur_orb != 'X') {
                    match_board[i][j] = cur_orb;
                    match_board[i][j-1] = cur_orb;
                    match_board[i][j-2] = cur_orb;
                }
                prev_1_orb = prev_2_orb;
                prev_2_orb = cur_orb;
            }
        }
        //  (b) verticals
        for (var j = 0; j < COLS; ++ j) {
            var prev_1_orb = 'X';
            var prev_2_orb = 'X';
            for (var i = 0; i < ROWS; ++ i) {
                var cur_orb = board[i][j];
                if (prev_1_orb == prev_2_orb && prev_2_orb == cur_orb && cur_orb != 'X') {
                    match_board[i][j] = cur_orb;
                    match_board[i-1][j] = cur_orb;
                    match_board[i-2][j] = cur_orb;
                }
                prev_1_orb = prev_2_orb;
                prev_2_orb = cur_orb;
            }
        }
        var scratch_board = copy_board(match_board);
        //console.log(scratch_board);
        // 2. enumerate the matches by flood-fill.
        var matches = [];
        for (var i = 0; i < ROWS; ++ i) {
            for (var j = 0; j < COLS; ++ j) {
                var cur_orb = scratch_board[i][j];
                if (typeof(cur_orb) == 'undefined') { continue; }
                var stack = [make_rc(i, j)];
                var count = 0;
                var cross = 0;
                while (stack.length) {
                    var n = stack.pop();
                    if (scratch_board[n.row][n.col] != cur_orb) { continue; }
                    ++ count;
                    scratch_board[n.row][n.col] = undefined;
                    if (n.row > 0) { stack.push(make_rc(n.row-1, n.col)); }
                    if (n.row < ROWS-1) { stack.push(make_rc(n.row+1, n.col)); }
                    if (n.col > 0) { stack.push(make_rc(n.row, n.col-1)); }
                    if (n.col < COLS-1) { stack.push(make_rc(n.row, n.col+1)); }
                }
                // Check for cross
                if (count == 5){
                    if (i >=0 && i <= 2){
                        if (j >= 1 && j <= 4){
                            var orb1 = match_board[i][j];
                            var orb2 = match_board[i+1][j];
                            var orb3 = match_board[i+2][j];
                            var orb4 = match_board[i+1][j+1];
                            var orb5 = match_board[i+1][j-1];

                            if (orb1 == orb2 && orb2 == orb3 && orb3 == orb4 && orb4 == orb5){
                                cross = 1;
                            }
                        }
                    }
                }
                matches.push(make_match(cur_orb, count, cross));
            }
        }
        return {matches: matches, board: match_board};
    }

    function equals_matches(a, b) {
        if (a.length != b.length) {
            return false;
        }
        return a.every(function(am, i) {
            var bm = b[i];
            return am.type == bm.type && am.count == bm.count;
        });
    }

    function compute_weight(matches, weights, requirements) {
        var total_weight = 0;
        var seen_heart_cross = 0;
        //console.log(matches);
        //console.log(matches.length, requirements.required_combo);
        /*
        if (matches.length >= requirements.required_combo){
            console.log(matches);
        }
        */
        matches.forEach(function(m) {
            var type = m.type;
            var size = m.count;
            if (size == 3){
                total_weight += weights[type].normal;
            }
            else if (size == 4){
                total_weight += weights[type].tpa;
            }
            else if (size == 5){
                total_weight += weights[type].five;
            }
            else {
                total_weight += weights[type].mass;
            }

            if (type == 4 && m.cross == 1){
                seen_heart_cross = 1;
            }

        });
        if (requirements.heart_cross == 1){
            if (seen_heart_cross == 1){
                var combo_bonus = (matches.length - 1) * COMBO_BONUS + 1;
                console.log("Seen");
                return (total_weight+20) * combo_bonus;

            }
            else {
                var combo_bonus = (matches.length - 1) * COMBO_BONUS + 1;
                return (total_weight) * combo_bonus;
            }
        }
        else {
            var combo_bonus = (matches.length - 1) * COMBO_BONUS + 1;
            return total_weight * combo_bonus;
        }

    }

    function in_place_remove_matches(board, match_board) {
        for (var i = 0; i < ROWS; ++ i) {
            for (var j = 0; j < COLS; ++ j) {
                if (typeof(match_board[i][j]) != 'undefined') {
                    board[i][j] = 'X';
                }
            }
        }
        return board;
    }

    function in_place_drop_empty_spaces(board) {
        for (var j = 0; j < COLS; ++ j) {
            var dest_i = ROWS-1;
            for (var src_i = ROWS-1; src_i >= 0; -- src_i) {
                if (board[src_i][j] != 'X') {
                    board[dest_i][j] = board[src_i][j];
                    -- dest_i;
                }
            }
            for (; dest_i >= 0; -- dest_i) {
                board[dest_i][j] = 'X';
            }
        }
        return board;
    }

    function can_move_orb(rc, dir) {
        switch (dir) {
            case 0: return                    rc.col < COLS-1;
            case 1: return rc.row < ROWS-1 && rc.col < COLS-1;
            case 2: return rc.row < ROWS-1;
            case 3: return rc.row < ROWS-1 && rc.col > 0;
            case 4: return                    rc.col > 0;
            case 5: return rc.row > 0      && rc.col > 0;
            case 6: return rc.row > 0;
            case 7: return rc.row > 0      && rc.col < COLS-1;
        }
        return false;
    }

    function in_place_move_rc(rc, dir) {
        switch (dir) {
            case 0:              rc.col += 1; break;
            case 1: rc.row += 1; rc.col += 1; break;
            case 2: rc.row += 1;              break;
            case 3: rc.row += 1; rc.col -= 1; break;
            case 4:              rc.col -= 1; break;
            case 5: rc.row -= 1; rc.col -= 1; break;
            case 6: rc.row -= 1;              break;
            case 7: rc.row -= 1; rc.col += 1; break;
        }
    }

    function in_place_swap_orb(board, rc, dir) {
        var old_rc = copy_rc(rc);
        in_place_move_rc(rc, dir);
        var orig_type = board[old_rc.row][old_rc.col];
        board[old_rc.row][old_rc.col] = board[rc.row][rc.col];
        board[rc.row][rc.col] = orig_type;
        return {board: board, rc: rc};
    }
    function copy_solution_with_cursor(solution, i, j, init_cursor) {
        return {board: copy_board(solution.board),
                cursor: make_rc(i, j),
                init_cursor: init_cursor || make_rc(i, j),
                path: solution.path.slice(),
                is_done: solution.is_done,
                weight: 0,
                matches: []};
    }

    function copy_solution(solution) {
        return copy_solution_with_cursor(solution,
                                         solution.cursor.row, solution.cursor.col,
                                         solution.init_cursor);
    }

    function make_solution(board, requirements, floor) {
        return {board: copy_board(board),
                cursor: make_rc(0, 0),
                init_cursor: make_rc(0, 0),
                path: [],
                is_done: false,
                weight: 0,
                floor: floor,
                requirements: requirements, 
                matches: []};
    }

    function in_place_evaluate_solution(solution, requirements, weights) {
        var current_board = copy_board(solution.board);
        var all_matches = [];
        while (true) {
            var matches = find_matches(current_board);
            if (matches.matches.length == 0) {
                break;
            }
            in_place_remove_matches(current_board, matches.board);
            in_place_drop_empty_spaces(current_board);
            all_matches = all_matches.concat(matches.matches);
        }
        solution.weight = compute_weight(all_matches, weights, requirements);
        solution.matches = all_matches;
        //console.log(current_board);
        return current_board;

    }

    function can_move_orb_in_solution(solution, dir) {
        // Don't allow going back directly. It's pointless.
        if (solution.path[solution.path.length-1] == (dir + 4) % 8) {
            return false;
        }
        return can_move_orb(solution.cursor, dir);
    }

    function in_place_swap_orb_in_solution(solution, dir) {
        var res = in_place_swap_orb(solution.board, solution.cursor, dir);
        solution.cursor = res.rc;
        solution.path.push(dir);
    }

    function get_max_path_length() {
        return MAX_LENGTH;
    }

    function is_8_dir_movement_supported() {
        return ALLOW_EIGHT;
    }

    function evolve_solutions(solutions, weights, requirements, dir_step) {
        var new_solutions = [];
        solutions.forEach(function(s) {
            if (s.is_done) {
                return;
            }
            for (var dir = 0; dir < 8; dir += dir_step) {
                if (!can_move_orb_in_solution(s, dir)) {
                    continue;
                }
                var solution = copy_solution(s);
                in_place_swap_orb_in_solution(solution, dir);
                in_place_evaluate_solution(solution, requirements, weights);
                new_solutions.push(solution);
            }
            s.is_done = true;
        });
        solutions = solutions.concat(new_solutions);
        solutions.sort(function(a, b) { return (b.matches.length + (b.weight * 0.25)) - (a.matches.length + (a.weight * 0.25)); });
        return solutions.slice(0, MAX_SOLUTIONS_COUNT);
    }

    this.solve_board = function (board, weights, requirements, floor, done_cb) {
        var solutions = new Array(ROWS * COLS);
        var seed_solution = make_solution(board, requirements, floor);
        //console.log(in_place_evaluate_solution(seed_solution, requirements, weights));
        for (var i = 0, s = 0; i < ROWS; ++ i) {
            for (var j = 0; j < COLS; ++ j, ++ s) {
                solutions[s] = copy_solution_with_cursor(seed_solution, i, j);
            }
        }
        var solve_state = {
            done_cb: done_cb,
            max_length: get_max_path_length(),
            dir_step: is_8_dir_movement_supported() ? 1 : 2,
            p: 0,
            solutions: solutions,
            weights: weights,
        };

        return solve_board_step(solve_state, requirements);
    }
    this.test_matching = function(board, requirements, floor){

        console.log(find_matches(board));
    }

    this.analyze_board_for_wood = function (board, floor) {
        var count = [0,0,0,0,0,0]; //fire, water, wood, light, heart, dark
        var require_skill = 0; //0 = no, 1 = kaede, 2 = perseus, 3 = damage pair, 4 = cameo
        var heart_cross = 0; //0 for no, 1 for yes
        var require_combo = 0;

        for (var i=0; i < ROWS; ++i){
            for (var j=0; j < COLS; ++j){
                count[board[i][j]] += 1;
            }
        }

        switch (floor){
            case 1:  ; 
                if (count[2] >= 7){ //can tpa + 3
                    require_skill = 0;
                    heart_cross = 0;
                    require_combo = 5;
                }
                else if (count[2] >= 4) { //pop kaede for +3 greens
                    require_skill = 1;
                    heart_cross = 1;
                    require_combo = 5;
                }
                else { //bad luck, pop kaede and heart cross
                    require_skill = 1;
                    if (count[4] >= 5){
                        heart_cross = 1;
                        require_combo = 6;
                    }
                    else{
                        heart_cross = 0;
                        require_combo = 7;
                    }
                }
                break;

            case 2:   
                if (count[2] >= 8){ //can tpa twice
                    require_skill = 0;
                    heart_cross = 0;
                    require_combo = 8;
                }
                else if (count[2] >= 4) { //pop kaede for +3 greens
                    require_combo = 8;
                    require_skill = 1;
                    heart_cross = 0;
                }
                else { //bad luck, pop kaede and heart cross
                    if (count[1] > 3){
                        require_skill = 2;
                        require_combo = 8;
                        heart_cross = 0;
                    }
                    else {
                        require_skill = 1;
                        if (count[4] >= 5){
                            heart_cross = 1;
                            require_combo = 6;
                        }
                        else{
                            heart_cross = 0;
                            require_combo = 7;
                        }
                    }
                }                
                break;

            case 3:  ; 
                if (count[2] >= 8){ //can tpa twice
                    require_skill = 0;
                    heart_cross = 0;
                    require_combo = 8;
                }
                else if (count[2] >= 4) { //pop kaede for +3 greens
                    require_combo = 8;
                    require_skill = 1;
                    heart_cross = 0;
                }
                else { //bad luck, pop kaede and heart cross
                    if (count[1] > 3){
                        require_skill = 2;
                        require_combo = 8;
                        heart_cross = 0;
                    }
                    else {
                        require_skill = 1;
                        if (count[4] >= 5){
                            heart_cross = 1;
                            require_combo = 6;
                        }
                        else{
                            heart_cross = 0;
                            require_combo = 7;
                        }
                    }
                }              
                break;

            case 4:  
                require_combo = 6;
                require_skill = 3;
                heart_cross = 1; 

                break;

            case 5:  ; 
                if (count[2] >= 11){ //can fuck them up
                    require_skill = 0;
                    heart_cross = 0;
                    require_combo = 8;
                }
                else if (count[2] >= 7) { //pop kaede for +3 greens
                    require_combo = 8;
                    require_skill = 1;
                    heart_cross = 0;
                }
                else { //bad luck, pop kaede and heart cross
                    if (count[1] > 3){
                        require_skill = 2;
                        require_combo = 8;
                        heart_cross = 0;
                    }
                    else {
                        require_skill = 1;
                        if (count[4] >= 5){
                            heart_cross = 1;
                            require_combo = 7;
                        }
                        else{
                            heart_cross = 0;
                            require_combo = 8;
                        }
                    }
                }     
                break;
        }
        var results = {count: count,
                       required_skill: require_skill,
                       required_combo: require_combo,
                       heart_cross: heart_cross};

        return results;

    }

    function solve_board_step(solve_state, requirements) {
        if (solve_state.p >= solve_state.max_length) {
            solve_state.done_cb(solve_state.solutions);
            return;
        }
        ++ solve_state.p;
        solve_state.solutions = evolve_solutions(solve_state.solutions,
                                                 solve_state.weights,
                                                 requirements,
                                                 solve_state.dir_step);

        setTimeout(function() { solve_board_step(solve_state, requirements); }, 0);
    }

    function simplify_path(xys) {
        // 1. Remove intermediate points.
        var simplified_xys = [xys[0]];
        var xys_length_1 = xys.length - 1;
        for (var i = 1; i < xys_length_1; ++ i) {
            var dx0 = xys[i].x - xys[i-1].x;
            var dx1 = xys[i+1].x - xys[i].x;
            if (dx0 == dx1) {
                var dy0 = xys[i].y - xys[i-1].y;
                var dy1 = xys[i+1].y - xys[i].y;
                if (dy0 == dy1) {
                    continue;
                }
            }
            simplified_xys.push(xys[i]);
        }
        simplified_xys.push(xys[xys_length_1]);
        return simplified_xys;
    }

    function simplify_solutions(solutions) {
        var simplified_solutions = [];
        solutions.forEach(function(solution) {
            for (var s = simplified_solutions.length-1; s >= 0; -- s) {
                var simplified_solution = simplified_solutions[s];
                if (!equals_rc(simplified_solution.init_cursor, solution.init_cursor)) {
                    continue;
                }
                if (!equals_matches(simplified_solution.matches, solution.matches)) {
                    continue;
                }
                return;
            }
            simplified_solutions.push(solution);
        });
        return simplified_solutions;
    }
};

//module.exports = algorithm;


var global_board = [[0,1,2,5,2,3],
                    [1,2,1,4,3,1],
                    [2,1,0,4,1,4],
                    [3,4,2,1,2,1],
                    [5,4,1,5,1,5]];
var weights = [{normal: 1, tpa: 2, five: 2, mass: 1},
               {normal: 1, tpa: 2, five: 2, mass: 1},
               {normal: 4, tpa: 6, five: 3, mass: 3},
               {normal: 1, tpa: 2, five: 2, mass: 1},
               {normal: 1, tpa: 2, five: 2, mass: 1},
               {normal: 1, tpa: 2, five: 2, mass: 1}];

var solver = new algorithm;

//console.log(solver.analyze_board_for_wood(global_board, 1));
//var requirements = solver.analyze_board_for_wood(global_board, 1);

solver.solve_board(global_board, weights, requirements, 1, function(solutions){
    //console.log(solutions);
    for (var i=0; i<5; i++){
        document.write("<p>" + solutions[0].board[i] + "</p>");
    }
});

//call analyze board to see what skills to use
//use then make the solution
//return both the solution and what skill to use in the JSON post
//let the python script click the skill and then make the move
