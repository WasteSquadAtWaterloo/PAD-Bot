from pyautogui import *
from time import sleep

MIN_X = 580
MIN_Y = 550
DIST = 100


def set_cursor(x,y):
    moveTo(MIN_X + DIST*y, MIN_Y+ DIST*x)

def move_up(amt):
    moveRel(0, -amt*100, 0.01*amt)
def move_down(amt):
    moveRel(0, amt*100, 0.01*amt)
def move_left(amt):
    moveRel(-amt*100, 0, 0.01*amt)
def move_right(amt):
    moveRel(amt*100, 0, 0.01*amt)

def do_sequence(start_x, start_y, seq):
    set_cursor(start_x, start_y)
    mouseDown()
    for mv in seq:
        if mv == 'U':
            move_up(1)
        elif mv == 'D':
            move_down(1)
        elif mv == 'L':
            move_left(1)
        elif mv == 'R':
            move_right(1)
    mouseUp()
            
