import cv2, sys
import numpy as np
import argparse
import math


parser = argparse.ArgumentParser()
parser.add_argument("--cam",type=int)
parser.add_argument("--roi")
args = parser.parse_args()

if args.cam:
    cam = cv2.VideoCapture(args.cam)
else:
    cam = cv2.VideoCapture(0)

camW = 1280
camH = 720

carte_width_mm = 60
carte_height_mm = 113

# GUI properties
win_carte_width = carte_width_mm * 5
win_carte_height = carte_height_mm * 5

GUI_handle_diameter = 12

# Our ROI, defined by two points
p1, p2, p3, p4 = None, None, None, None
state = 0
grabbing = False

if args.roi:
    str_arg = args.roi.strip()
    x1,y1,x2,y2,x3,y3,x4,y4 = args.roi.split(" ")
    p1 = (int(x1),int(y1))
    p2 = (int(x2),int(y2))
    p3 = (int(x3),int(y3))
    p4 = (int(x4),int(y4))
    state = 4

cam.set(cv2.CAP_PROP_FRAME_WIDTH, camW)
cam.set(cv2.CAP_PROP_FRAME_HEIGHT, camH)

cv2.namedWindow('Frame', cv2.WINDOW_NORMAL)
cv2.resizeWindow('Frame', camW, camH)

cv2.namedWindow('ROI', cv2.WINDOW_NORMAL)
cv2.resizeWindow('ROI', win_carte_width, win_carte_height)

cv2.namedWindow('PROCESSED', cv2.WINDOW_NORMAL)
cv2.resizeWindow('PROCESSED', win_carte_width, win_carte_height)

cv2.namedWindow('GRID', cv2.WINDOW_NORMAL)
cv2.resizeWindow('GRID', win_carte_width, win_carte_height)


def img2code(img):
    top = img[0,1:3].tolist()
    #print(top)
    right = img[1:7,-1].tolist()
    #print(right)
    bottom = img[-1,1:3].tolist()
    #print(bottom)
    bottom = list(reversed(bottom))
    left = img[1:7,0].tolist()
    #print(left)
    left = list(reversed(left))
    return ["0" if e > 200 else "1" for e in top+right+bottom+left]


# Called every time a mouse event happen
def on_mouse(event, x, y, flags, userdata):
    global state, p1, p2, p3, p4, grabbing
    
    # Left click
    if event == cv2.EVENT_LBUTTONDOWN and state > 0:
        try:
            if math.dist(p1,(x,y)) < GUI_handle_diameter:
                grabbing = 1
            elif math.dist(p2,(x,y)) < GUI_handle_diameter:
                grabbing = 2
            elif math.dist(p3,(x,y)) < GUI_handle_diameter:
                grabbing = 3
            elif math.dist(p4,(x,y)) < GUI_handle_diameter:
                grabbing = 4
        except TypeError:
            pass
    
    if grabbing == 1:
        p1 = (x,y)
    elif grabbing == 2:
        p2 = (x,y)
    elif grabbing == 3:
        p3 = (x,y)
    elif grabbing == 4:
        p4 = (x,y)

    if event == cv2.EVENT_LBUTTONUP:
        if grabbing == False:
            # Select first point
            if state == 0:
                p1 = (x,y)
                state += 1
                print(p1)
            # Select second point
            elif state == 1:
                p2 = (x,y) 
                state += 1
                print(p2)
            elif state == 2:
                p3 = (x,y) 
                state += 1
                print(p3)
            elif state == 3:
                p4 = (x,y) 
                state += 1
                print(p4)
        else:
            grabbing = False

    # Middle click (erase current ROI)
    if event == cv2.EVENT_MBUTTONUP:
        p1, p2, p3, p4 = None, None, None, None
        state = 0

# Register the mouse callback
cv2.setMouseCallback('Frame', on_mouse)

while cam.isOpened():
    val, frame = cam.read()
    
    frame2view = frame.copy()

    if p1:
        cv2.circle(frame2view, p1, GUI_handle_diameter, (0,0,255))
    if p2:
        cv2.circle(frame2view, p2, GUI_handle_diameter, (0,0,255))
    if p3:
        cv2.circle(frame2view, p3, GUI_handle_diameter, (0,0,255))
    if p4:
        cv2.circle(frame2view, p4, GUI_handle_diameter, (0,0,255))


    # If a ROI is selected, draw it
    if state > 3:
        
        # draw ROI on frame
        cv2.line(frame2view,p1,p2,(0,255,0),2)
        cv2.line(frame2view,p2,p3,(0,255,0),2)
        cv2.line(frame2view,p3,p4,(0,255,0),2)
        cv2.line(frame2view,p4,p1,(0,255,0),2)

        # bounding box de la ROI, je ne sais pas si ça peut être utile
        bb_x_min = min(p1[0],p4[0])
        bb_y_min = min(p1[1],p2[1])
        bb_x_max = max(p2[0],p2[0])
        bb_y_max = max(p3[1],p4[1])
        cv2.rectangle(frame2view, (bb_x_min, bb_y_min), (bb_x_max,bb_y_max), (255, 0, 0), 2)

        # calcule de la taille de l'image de la carte pour optimiser les calcules dessus
        carte_width = int(max(math.dist(p1,p2),math.dist(p4,p3)))
        carte_height = int(max(math.dist(p1,p4), math.dist(p2,p3)))
        
        # ROI = Region Of Interest, recadrage et correction de la perspective
        roi = frame.copy()
        
        pts1 = np.float32([p1, p2, p4, p3])
        pts2 = np.float32([[0, 0],[carte_width, 0],[0, carte_height],[carte_width, carte_height]])
        M = cv2.getPerspectiveTransform(pts1, pts2)
        
        roi = cv2.warpPerspective(roi, M, (carte_width, carte_height))

        #roi_h, roi_w, roi_c = roi.shape
        #mult2view = win_carte_height / roi_h
        #roi2view = cv2.resize(roi.copy(),(int(roi_w * mult2view),win_carte_height))
        
        roi2view = cv2.resize(roi.copy(),(win_carte_width, win_carte_height))
        #cv2.resizeWindow('ROI',int(roi_w * mult2view),win_carte_height)
        cv2.imshow("ROI", roi2view)
        w1 = cv2.getWindowImageRect("ROI")

        # gray
        img_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(img_gray,(5,5),0)
        ret, img_treshold = cv2.threshold(blur,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU) 
        #img_treshold = cv2.adaptiveThreshold(img_gray,255,cv2.ADAPTIVE_THRESH_MEAN_C,cv2.THRESH_BINARY,11,2)
        #ret,img_treshold = cv2.threshold(img_gray,127,255,cv2.THRESH_BINARY)
        #image_canny = cv2.Canny(blur, 10, 80), mask = image_canny_inverted = cv2.threshold(image_canny, 30, 255, cv2.THRESH_BINARY_INV)
        #processed2view = cv2.resize(img_treshold, (int(roi_w * mult2view),720))
        processed2view = cv2.resize(img_treshold, (win_carte_width, win_carte_height))

        #cv2.resizeWindow('PROCESSED',int(roi_w * mult2view),win_carte_height)
        cv2.moveWindow('PROCESSED',w1[0]+w1[2],w1[1]-50) # pour que la fenêtre suive l'autre
        cv2.imshow("PROCESSED", processed2view)
        w2 = cv2.getWindowImageRect("PROCESSED")

        # Desired "pixelated" size
        w, h = (4, 8)
        # Resize input to "pixelated" size
        grid = cv2.resize(img_treshold, (w, h), interpolation=cv2.INTER_LINEAR)

        grid2view = cv2.resize(grid, (win_carte_width, win_carte_height), interpolation=cv2.INTER_NEAREST)
        #cv2.resizeWindow('GRID',int(roi_w * mult2view),win_carte_height)
        cv2.moveWindow('GRID',w2[0]+w2[2],w2[1]-50) # pour que la fenêtre suive l'autre
        cv2.imshow('GRID', grid2view)

        code = img2code(grid)
        print(''.join(code))
        num = int(''.join(code),2)
        print(num)


    # Show image
    cv2.imshow('Frame', frame2view)
    
    # Let OpenCV manage window events
    key = cv2.waitKey(50)
    # If ESCAPE key pressed, stop
    if key == 'z':
        pass
    if key == 27:
        print('--roi "{} {} {} {} {} {} {} {}"'.format(p1[0],p1[1],p2[0],p2[1],p3[0],p3[1],p4[0],p4[1]))
        cam.release()


