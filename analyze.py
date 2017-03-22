def analyze_board(board, floor):
    count = [0,0,0,0,0,0]
    require_skill = 0 #0 = no, 1 = kaede, 2 = perseus, 3 = damage pair, 4 = cameo
    heart_cross = 0 #0 for no, 1 for yes
    require_combo = 0

    for i in xrange(5):
        for j in xrange(6):
            count[board[i][j]] += 1

    if floor == 1:
        if count[2] >= 7:
            require_combo = 5;
            require_skill = 0;
            heart_cross = 0;
        
        elif count[2] >= 4:
            require_skill = 1;
            require_combo = 5;
            heart_cross = 0;

        else:
            require_skill = 1;
            if count[4] >= 5:
                heart_cross = 1;
                require_combo = 6;
            else:
                heart_cross = 0;
                require_combo = 7;

    elif floor == 2:
        if count[2] >= 8:
            require_combo = 8;
            require_skill = 0;
            heart_cross = 0;

        elif count[2] >= 4:
            require_skill = 1;
            require_combo = 8;
            heart_cross = 0;

        else:
            if count[1] > 3:
                require_combo = 8
                require_skill = 2
                heart_cross = 0
            else:
                require_skill = 1
                if count[4] >= 5:
                    heart_cross = 1;
                    require_combo = 6;
                else:
                    heart_cross = 0;
                    require_combo = 7;
    elif floor == 3:
        if count[2] >= 8:
            require_combo = 8;
            require_skill = 0;
            heart_cross = 0;

        elif count[2] >= 4:
            require_skill = 1;
            require_combo = 8;
            heart_cross = 0;

        else:
            if count[1] > 3:
                require_combo = 8
                require_skill = 2
                heart_cross = 0
            else:
                require_skill = 1
                if count[4] >= 5:
                    heart_cross = 1;
                    require_combo = 6;
                else:
                    heart_cross = 0;
                    require_combo = 7;
                    
    elif floor == 4:
        require_combo = 6
        require_skill = 3;
        heart_cross = 1;
        
    elif floor == 5:
        if count[2] >= 11:
            require_combo = 8;
            require_skill = 0;
            heart_cross = 0;

        elif count[2] >= 7:
            require_skill = 1;
            require_combo = 8;
            heart_cross = 0;

        else:
            if count[1] > 3:
                require_combo = 8
                require_skill = 2
                heart_cross = 0
            else:
                require_skill = 1
                if count[4] >= 5:
                    heart_cross = 1;
                    require_combo = 7;
                else:
                    heart_cross = 0;
                    require_combo = 8;

    result = {"count": count,
              "required_skills": require_skill,
              "required_combos": require_combo,
              "heart_cross": heart_cross}

    return result




#Testing
#board = [[1,2,1,1,2,2],
#         [3,3,1,2,5,5],
#         [4,5,2,1,3,2],
#         [1,3,1,2,0,3],
#         [2,1,5,0,3,1]]

#print analyze_board(board, 1)
