import cv2
import numpy as np
from PIL import ImageGrab
from time import sleep

w = 98
h = 97
threshold = 0.9

#Loading assets
fire_template = cv2.imread("assets/fire_orb.png", 0)
water_template = cv2.imread("assets/water_orb.png", 0)
wood_template = cv2.imread("assets/wood_orb.png", 0)
dark_template = cv2.imread("assets/dark_orb.png", 0)
heart_template = cv2.imread("assets/heart_orb.png", 0)
light_template = cv2.imread("assets/light_orb.png", 0)

def screenshot():
    ImageGrab.grab().save("screen.png", "PNG")
    screen = cv2.imread("screen.png")
    screen = cv2.cvtColor(screen, cv2.COLOR_BGR2GRAY)
    return screen

def load_board():
    screen = screenshot()
    
    fires = cv2.matchTemplate(screen, fire_template, cv2.TM_CCOEFF_NORMED)
    waters = cv2.matchTemplate(screen, water_template, cv2.TM_CCOEFF_NORMED)
    woods = cv2.matchTemplate(screen, wood_template, cv2.TM_CCOEFF_NORMED)
    lights = cv2.matchTemplate(screen, light_template, cv2.TM_CCOEFF_NORMED)
    hearts = cv2.matchTemplate(screen, heart_template, cv2.TM_CCOEFF_NORMED)
    darks = cv2.matchTemplate(screen, dark_template, cv2.TM_CCOEFF_NORMED)
    
    fire_loc = np.where(fires >= threshold)
    water_loc = np.where(waters >= threshold)
    wood_loc = np.where(woods >= threshold)
    light_loc = np.where(lights >= threshold)
    heart_loc = np.where(hearts >= threshold)
    dark_loc = np.where(darks >= threshold)

    board = [[-1 for i in xrange(6)] for j in xrange(5)]
    
    for point in zip(*fire_loc[::-1]):
        #print (point[0] - 520)/100,(point[1] -480)/100
        board[(point[1] -480)/100][(point[0] - 520)/100] = 0
    #print 
    for point in zip(*water_loc[::-1]):
        #print (point[0] - 520)/100,(point[1] -480)/100
        board[(point[1] -480)/100][(point[0] - 520)/100] = 1
    #print
    for point in zip(*wood_loc[::-1]):
        #print (point[0] - 520)/100,(point[1] -480)/100
        board[(point[1] -480)/100][(point[0] - 520)/100] = 2
    #print
    for point in zip(*light_loc[::-1]):
        #print (point[0] - 520)/100,(point[1] -480)/100
        board[(point[1] -480)/100][(point[0] - 520)/100] = 3
    #print
    for point in zip(*heart_loc[::-1]):
        #print (point[0] - 520)/100,(point[1] -480)/100
        board[(point[1] -480)/100][(point[0] - 520)/100] = 4
    #print
    for point in zip(*dark_loc[::-1]):
        #print (point[0] - 520)/100,(point[1] -480)/100
        board[(point[1] -480)/100][(point[0] - 520)/100] = 5
    #print
    return board

sleep(3)
for i in load_board():
    print i
        
