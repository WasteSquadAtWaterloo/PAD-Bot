from pyautogui import *
from time import sleep

MIN_X = 580
MIN_Y = 550
DIST = 100


def set_cursor(x,y):
    moveTo(MIN_X + DIST*x, MIN_Y+ DIST*y)

def move_up(amt):
    moveRel(0, -amt*100, 0.12*amt)
def move_down(amt):
    moveRel(0, amt*100, 0.12*amt)
def move_left(amt):
    moveRel(-amt*100, 0, 0.12*amt)
def move_right(amt):
    moveRel(amt*100, 0, 0.12*amt)

def do_sequence(start_x, start_y, seq):
    set_cursor(start_x, start_y)
    mouseDown()
    for mv in seq:
        if mv[0] == 'U':
            move_up(mv[1])
        elif mv[0] == 'D':
            move_down(mv[1])
        elif mv[0] == 'L':
            move_left(mv[1])
        elif mv[0] == 'R':
            move_right(mv[1])
    mouseUp()
            

sleep(3)
set_cursor(4,0)
do_sequence([['R',1],['D',4],['L',1],['U',1],['R',1]])

