import requests
import json
from time import sleep

from computer_vision import *
from mouse import *

weights = [1,2, #fire
           1,2, #water
           1,2, #wood
           1,2, #light
           1,2, #heart
           1,2] #dark

def call_api(board, weights):
    r = requests.post('http://localhost:8080/api/', data={'board': board, 'weights': weights})
    data = r.json()

    sol = {}
    sol['start'] =  (data['cursor']['row'], data['cursor']['col'])
    sol['path'] = data['path']
    
    return sol

def solve_board(board):

    solution = call_api(board, weights)   

    start = solution['start']
    seq = ''
    for i in solution['path']:
        if i==0: seq += 'R'
        elif i==2: seq += 'D'
        elif i==4: seq += 'L'
        elif i==6: seq += 'U'
    print start
    print seq
    do_sequence(start[0], start[1], seq)

sleep(1)
broken = False
while True:    
    board = load_board()
    for i in board:
        for j in i:
            if j == -1:
                print "broken"
                broken = True
                break
        if broken:
            break

    if broken:
        sleep(2)
        broken = False
        continue
    solve_board(board)
    sleep(10)




