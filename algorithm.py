from sets import Set
from collections import deque
from copy import deepcopy

MOVE_LIMIT = 5

def matrix_to_int(board):
    num = 0
    for i in xrange(5):
        for j in xrange(6):
           num += board[i][j]*(6**(i*6+j))
    return num

def swap(board, x,y, a,b):
    board[x][y], board[a][b] = board[a][b], board[x][y]
    return board

def score(board):
    board_score = 0
    for i in xrange(5):
        line_score = 0
        current = board[i][0]
        line_length = 1
        for j in xrange(1,6):
            if board[i][j] == current:
                line_length += 1
                if line_length >= 3:
                    line_score += 1
            else:
                line_length = 1
                current = board[i][j]
        board_score += line_score

        
    for i in xrange(6):
        line_score = 0
        current = board[0][i]
        line_length = 1
        for j in xrange(1,5):
            if board[j][i] == current:
                line_length += 1
                if line_length >= 3:
                    line_score += 1
            else:
                line_length = 1
                current = board[j][i]
        board_score += line_score

    
    return board_score
    
def find_best_sequence(board):
    best_score = 0
    best_seq = ''
    best_start = (-1,-1)
    best_board = [[]]
    
    states = Set()

    for i in xrange(5):
        for j in xrange(6):
            q = deque()
            q.append([board,(i,j),""])
            c = False
            while (q):                
                b, pos, mv = q.popleft()
                
                num_rep = matrix_to_int(b)
                if (b==board):
                    if c==True:                        
                        continue
                    else:
                        c = True
                    
                elif (num_rep in states or len(mv)/2 > MOVE_LIMIT):
                    print "DASD"
                    continue

                print mv
                      
                states.add(num_rep)

                x,y = pos

                if (x-1 >= 0):                    
                    q.append([swap(b[:], x,y, x-1,y), (x-1,y), mv+"L1"])
                if (y-1 >= 0):                    
                    q.append([swap(b[:], x,y, x,y-1), (x,y-1), mv+"U1"])
                if (x+1 < 5):                    
                    q.append([swap(b[:], x,y, x+1,y), (x+1,y), mv+"R1"])
                if (y+1 < 6):                    
                    q.append([swap(b[:], x,y, x,y+1), (x,y+1), mv+"D1"])

                if score(b) > best_score:
                    best_score = score(b)
                    best_seq = mv
                    best_start = (i,j)
                    best_board = b
            
            print i, j, best_score
    return best_start, best_seq, best_board


sample = [
    [1,1,0,4,2,3],
    [0,2,2,0,1,4],
    [1,3,3,2,0,4],
    [2,5,4,2,0,1],
    [0,0,3,0,2,4]
]


