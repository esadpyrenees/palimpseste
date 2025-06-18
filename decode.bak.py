import cv2, sys
import numpy as np
import argparse
import math

from messages import *


parser = argparse.ArgumentParser()
parser.add_argument("--cam", type=int)
parser.add_argument("--roi")
args = parser.parse_args()

if args.cam:
    cam = cv2.VideoCapture(args.cam)
else:
    cam = cv2.VideoCapture(0)

roi = [None,None,None,None]
if args.roi:
    str_arg = args.roi.strip()
    x1,y1,x2,y2,x3,y3,x4,y4 = str_arg.split(" ")
    roi[0] = (int(x1),int(y1))
    roi[1] = (int(x2),int(y2))
    roi[2] = (int(x3),int(y3))
    roi[3] = (int(x4),int(y4))

# 0----------1
# ------------
# ------------
# ------------
# 3----------2

class App:
    def __init__(self, cam, roi=None):
        self.cam = cam

        if roi[0] is not None:
            self.roi = roi
            self.roi_state = 4
        else:
            self.roi = roi
            self.roi_state = 0
       

        self.carte_width_mm = 60
        self.carte_height_mm = 113

        # GUI properties
        self.GUI_carte_width = self.carte_width_mm * 5
        self.GUI_carte_height = self.carte_height_mm * 5

        self.GUI_handle_diameter = 12

        self.camW = int(self.cam.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.camH = int(self.cam.get(cv2.CAP_PROP_FRAME_HEIGHT))

        self.GUI_grabbing = False

        # masques pour les zones de décodage
        self.mask_white = cv2.imread("masque-blanc.pbm",0)
        self.mask_black = cv2.imread("masque-noir.pbm",0)
        self.mask_code = cv2.imread("masque-code.pbm",0)

        self.contours_white = []
        self.contours_black = []
        self.contours_code = []

        self.current_values = []
        self.current_code = []
        self.current_id = None

        self.buffer_id = []

        self.val_th = 125
        self.is_code = False
        #cam.set(cv2.CAP_PROP_FRAME_WIDTH, self.camW)
        #cam.set(cv2.CAP_PROP_FRAME_HEIGHT, self.camH)

        # init GUI
        cv2.namedWindow('Frame', cv2.WINDOW_NORMAL)
        cv2.resizeWindow('Frame', self.camW, self.camH)

        cv2.namedWindow('ROI', cv2.WINDOW_NORMAL)
        cv2.resizeWindow('ROI', self.GUI_carte_width, self.GUI_carte_height)

        cv2.namedWindow('PROCESSED', cv2.WINDOW_NORMAL)
        cv2.resizeWindow('PROCESSED', self.GUI_carte_width, self.GUI_carte_height)

        #cv2.namedWindow('GRID', cv2.WINDOW_NORMAL)
        #cv2.resizeWindow('GRID', self.GUI_carte_width, self.GUI_carte_height)

        # Register the mouse callback
        cv2.setMouseCallback('Frame', self.GUI_on_mouse)

        if self.roi_state == 4:
            self.roi_init()


    # Called every time a mouse event happen
    def GUI_on_mouse(self,event, x, y, flags, userdata):
        #global state, self.roi[0], self.roi[1], self.roi[2], self.roi[3], self.GUI_grabbing
        
        # Left click
        if event == cv2.EVENT_LBUTTONDOWN and self.roi_state > 0:
            try:
                if math.dist(self.roi[0],(x,y)) < self.GUI_handle_diameter:
                    self.GUI_grabbing = 1
                elif math.dist(self.roi[1],(x,y)) < self.GUI_handle_diameter:
                    self.GUI_grabbing = 2
                elif math.dist(self.roi[2],(x,y)) < self.GUI_handle_diameter:
                    self.GUI_grabbing = 3
                elif math.dist(self.roi[3],(x,y)) < self.GUI_handle_diameter:
                    self.GUI_grabbing = 4
            except TypeError:
                pass
        
        if self.GUI_grabbing == 1:
            self.roi[0] = (x,y)
        elif self.GUI_grabbing == 2:
            self.roi[1] = (x,y)
        elif self.GUI_grabbing == 3:
            self.roi[2] = (x,y)
        elif self.GUI_grabbing == 4:
            self.roi[3] = (x,y)

        if event == cv2.EVENT_LBUTTONUP:
            if self.GUI_grabbing == False:
                # Select first point
                if self.roi_state == 0:
                    self.roi[0] = (x,y)
                    self.roi_state += 1
                    print(self.roi[0])
                # Select second point
                elif self.roi_state == 1:
                    self.roi[1] = (x,y) 
                    self.roi_state += 1
                    print(self.roi[1])
                elif self.roi_state == 2:
                    self.roi[2] = (x,y) 
                    self.roi_state += 1
                    print(self.roi[2])
                elif self.roi_state == 3:
                    self.roi[3] = (x,y) 
                    self.roi_state += 1
                    print(self.roi[3])
            else:
                self.GUI_grabbing = False

        # Middle click (erase current ROI)
        if event == cv2.EVENT_MBUTTONUP:
            self.roi[0], self.roi[1], self.roi[2], self.roi[3] = None, None, None, None
            self.roi_state = 0

        if self.roi_state > 3:
            self.roi_init()


    def roi_init(self):
        # bounding box de la ROI, je ne sais pas si ça peut être utile
        self.bb_x_min = min(self.roi[0][0],self.roi[3][0])
        self.bb_y_min = min(self.roi[0][1],self.roi[1][1])
        self.bb_x_max = max(self.roi[1][0],self.roi[2][0])
        self.bb_y_max = max(self.roi[2][1],self.roi[3][1])

        # calcule de la taille de l'image de la carte pour optimiser les calcules dessus
        self.roi_width = int(max(math.dist(self.roi[0],self.roi[1]),math.dist(self.roi[3],self.roi[2])))
        self.roi_height = int(max(math.dist(self.roi[0],self.roi[3]), math.dist(self.roi[1],self.roi[2])))

        # calcule de la matrice qu'il faut appliquer à l'image pour la redresser
        pts1 = np.float32([self.roi[0], self.roi[1], self.roi[3], self.roi[2]])
        pts2 = np.float32([[0, 0],[self.roi_width, 0],[0, self.roi_height],[self.roi_width, self.roi_height]])
        self.roi_matrix = cv2.getPerspectiveTransform(pts1, pts2)

        # converti les masques en contours pour les différentes zones noir/blanc/code
        tmp_mask_black = cv2.resize(self.mask_black.copy(),(self.roi_width,self.roi_height))
        self.contours_black, hierarchy = cv2.findContours(tmp_mask_black, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        self.contours_black = sort_contours(self.contours_black, self.roi_width, method="left-to-right")
        
        tmp_mask_white = cv2.resize(self.mask_white.copy(),(self.roi_width,self.roi_height))
        self.contours_white, hierarchy = cv2.findContours(tmp_mask_white, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        self.contours_white = sort_contours(self.contours_white, self.roi_width, method="left-to-right")

        if self.check_controls_contours(tmp_mask_black,self.val_th) is not False:
            ValueError("Le masque noir n'a pas passé le test :/")
        if self.check_controls_contours(tmp_mask_white,self.val_th) is not True: 
            ValueError("Le masque blanc n'a pas passé le test :/") 


        tmp_mask_code = cv2.resize(self.mask_code.copy(),(self.roi_width,self.roi_height))
        self.contours_code, hierarchy = cv2.findContours(tmp_mask_code, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        # trier les contours de code selon l'ordre de lecture voulu
        self.contours_code = sort_contours(self.contours_code, self.roi_width, method="top-to-bottom")


    def check_controls_contours(self,img,th=None):
        if th is None:
            th = self.val_th
        
        vals_black = [get_average_val_in_contour(img,cnt) for cnt in self.contours_black]
        vals_white = [get_average_val_in_contour(img,cnt) for cnt in self.contours_white]

        bins_black = [val2bin(val,th) for val in vals_black]
        bins_white = [val2bin(val,th) for val in vals_white]

        check_black = True if sum(bins_black) == len(bins_black) else False # si toutes les cellules noires sont noires
        check_white = True if sum(bins_white) == 0 else False               # si toutes les cellules blanches sont blanches

        ## GUI affichage des zones de controles pour débug
        x,y,width_part,height_part = cv2.boundingRect(self.contours_black[0])
        width_part = width_part + 1
        height_part = height_part + 10
        ctrl2view = np.zeros((height_part * 2, width_part * max(len(self.contours_black),len(self.contours_white)) + 20 ), np.uint8)
        for i,cnt in enumerate(self.contours_black):
            x,y,w,h = cv2.boundingRect(cnt)
            part = img[y:y+h,x:x+w] # fragment de l'image où une cellule de code doit être 
            ctrl2view[0:part.shape[0], width_part*i:width_part*i+part.shape[1]] = part # coller ce fragment dans la fenêtre de débug
        for i,cnt in enumerate(self.contours_white):
            x,y,w,h = cv2.boundingRect(cnt)
            part = img[y:y+h,x:x+w] # fragment de l'image où une cellule de code doit être 
            ctrl2view[height_part:height_part+part.shape[0], width_part*i:width_part*i+part.shape[1]] = part # coller ce fragment dans la fenêtre de débug
        mult2view = 2
        ctrl2view = cv2.resize(ctrl2view,None, fx=mult2view, fy=mult2view,interpolation=0)
        ctrl2view = cv2.putText(ctrl2view, "black", (width_part*2*mult2view +10, height_part*mult2view*1 - 50), cv2.FONT_HERSHEY_SIMPLEX , 0.25*mult2view/2, [255])
        ctrl2view = cv2.putText(ctrl2view, str(int(vals_black[0])), (width_part*0*mult2view, height_part*mult2view*1 - 50), cv2.FONT_HERSHEY_SIMPLEX , 0.25*mult2view/2, [255])
        ctrl2view = cv2.putText(ctrl2view, str(int(vals_black[1])), (width_part*1*mult2view, height_part*mult2view*1 - 50), cv2.FONT_HERSHEY_SIMPLEX , 0.25*mult2view/2, [255])
        ctrl2view = cv2.putText(ctrl2view, "white", (width_part*2*mult2view +10, height_part*mult2view*2 - 50), cv2.FONT_HERSHEY_SIMPLEX , 0.25*mult2view/2, [255])
        ctrl2view = cv2.putText(ctrl2view, str(int(vals_white[0])), (width_part*0*mult2view, height_part*mult2view*2 - 50), cv2.FONT_HERSHEY_SIMPLEX , 0.25*mult2view/2, [255])
        ctrl2view = cv2.putText(ctrl2view, str(int(vals_white[1])), (width_part*1*mult2view, height_part*mult2view*2 - 50), cv2.FONT_HERSHEY_SIMPLEX , 0.25*mult2view/2, [255])
        cv2.imshow("IMAGE CONTROLE", ctrl2view)

        return check_black and check_white                                  # si noir et blanc ok
                


    def run(self):
        while self.cam.isOpened():
            val, frame = cam.read()
            
            frame2view = frame.copy()

            if self.roi_state>0:
                cv2.circle(frame2view, self.roi[0], self.GUI_handle_diameter, (0,0,255))
            if self.roi_state>1:
                cv2.circle(frame2view, self.roi[1], self.GUI_handle_diameter, (0,0,255))
            if self.roi_state>2:
                cv2.circle(frame2view, self.roi[2], self.GUI_handle_diameter, (0,0,255))
            if self.roi_state>3:
                cv2.circle(frame2view, self.roi[3], self.GUI_handle_diameter, (0,0,255))


            # If a ROI is selected, draw it
            if self.roi_state > 3:
                
                # dessiner la ROI sur la cam
                cv2.line(frame2view,self.roi[0],self.roi[1],(0,255,0),2)
                cv2.line(frame2view,self.roi[1],self.roi[2],(0,255,0),2)
                cv2.line(frame2view,self.roi[2],self.roi[3],(0,255,0),2)
                cv2.line(frame2view,self.roi[3],self.roi[0],(0,255,0),2)

                # bounding box de la ROI
                cv2.rectangle(frame2view, (self.bb_x_min, self.bb_y_min), (self.bb_x_max,self.bb_y_max), (255, 0, 0), 2)
                
                # ROI = Region Of Interest, recadrage et correction de la perspective
                img_roi = frame.copy()                
                img_roi = cv2.warpPerspective(img_roi, self.roi_matrix, (self.roi_width, self.roi_height))

                # GUI affichage de la fenêtre ROI
                mult2view = self.GUI_carte_height / self.roi_height
                roi2view = img_roi.copy()
                roi2view = cv2.drawContours(roi2view,self.contours_black,-1,(0,255,0),1)
                roi2view = cv2.drawContours(roi2view,self.contours_white,-1,(255,0,0),1)
                roi2view = cv2.drawContours(roi2view,self.contours_code,-1,(0,0,255),1)
                #debug contours_code sorting:
                for i,cnt in enumerate(self.contours_code):
                    roi2view = cv2.putText(roi2view, str(i), cv2.boundingRect(cnt)[:2], cv2.FONT_HERSHEY_SIMPLEX , 0.4, [255])
                
                roi2view = cv2.resize(roi2view,(self.GUI_carte_width, self.GUI_carte_height))
                cv2.imshow("ROI", roi2view)
                GUI_w1 = cv2.getWindowImageRect("ROI") #bbox de la fenêtre 1 pour placer la 2e à côté

                ## threshold / seuil : plein de process et d'algo à tester 

                img_gray = cv2.cvtColor(img_roi, cv2.COLOR_BGR2GRAY)
                img_blur = cv2.GaussianBlur(img_gray,(5,5),0)
                ret, img_treshold = cv2.threshold(img_blur,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU) 
                #img_treshold = cv2.adaptiveThreshold(img_gray,255,cv2.ADAPTIVE_THRESH_MEAN_C,cv2.THRESH_BINARY,11,2)
                #ret,img_treshold = cv2.threshold(img_gray,127,255,cv2.THRESH_BINARY)
                #image_canny = cv2.Canny(blur, 10, 80), mask = image_canny_inverted = cv2.threshold(image_canny, 30, 255, cv2.THRESH_BINARY_INV)

                # GUI affichage de la fenêtre de l'image traitée                
                processed2view = img_treshold.copy()
                processed2view = cv2.resize(processed2view, (self.GUI_carte_width, self.GUI_carte_height),interpolation=0)
                cv2.moveWindow('PROCESSED',GUI_w1[0]+GUI_w1[2],GUI_w1[1]-50) # pour que la fenêtre suive l'autre
                cv2.imshow("PROCESSED", processed2view)
                GUI_w2 = cv2.getWindowImageRect("PROCESSED")
                
                ## vérification des zones de controle
                self.is_code = self.check_controls_contours(img_treshold)

                if self.is_code:
                    ## DÉCODE : découpe l'image et fait la moyenne de ce qui se trouve dans chaque contour pour en déduire le code
                    
                    # reset temporary values
                    self.current_values = []
                    self.current_code = []
                    
                    x,y,width_part_code,height_img_code = cv2.boundingRect(self.contours_code[0])
                    width_part_code = width_part_code + 1
                    height_img_code = height_img_code + 20
                    code2view = np.zeros((height_img_code,width_part_code * len(self.contours_code)), np.uint8)
                    x_offset = 0
                    for i,cnt in enumerate(self.contours_code):
                        val = get_average_val_in_contour(img_treshold, cnt)
                        self.current_values.append(val)
                        binaire = val2bin(val, self.val_th)
                        self.current_code.append(binaire)
                        
                        # GUI préparation affichage de la zone de code dans une fenêtre
                        x,y,w,h = cv2.boundingRect(cnt)
                        part = img_treshold[y:y+h,x:x+w] # fragment de l'image où une cellule de code doit être 
                        code2view[0:part.shape[0], width_part_code*i:width_part_code*i+part.shape[1]] = part # coller ce fragment dans la fenêtre de débug
                    
                    # GUI affichage des zones de code dans la fenêtre de débug
                    mult2view = 2
                    code2view = cv2.resize(code2view, None, fx=mult2view, fy=mult2view,interpolation=0)
                    #debug values
                    for i,cnt in enumerate(self.contours_code):
                        code2view = cv2.putText(code2view, str(i), (width_part_code*i*mult2view, height_img_code*mult2view - 10*mult2view), cv2.FONT_HERSHEY_SIMPLEX , 0.25*mult2view/2, [255])
                        code2view = cv2.putText(code2view, str(self.current_code[i]), (width_part_code*i*mult2view, height_img_code*mult2view - 5*mult2view ), cv2.FONT_HERSHEY_SIMPLEX , 0.25*mult2view/2, [255])
                        code2view = cv2.putText(code2view, str(int(self.current_values[i])), (width_part_code*i*mult2view, height_img_code*mult2view ), cv2.FONT_HERSHEY_SIMPLEX , 0.25*mult2view/2, [255])

                    cv2.imshow("IMAGES CODE", code2view)

                    ## calcule du code
                    code = [str(i) for i in self.current_code]
                    # print(code)
                    # print(''.join(code))
                    num = int(''.join(code),2)
                    print(num)
                    self.current_id = num
                    # print(f'sendMessage(num) {num}:')
                    sendMessage(num)
                else:
                    cv2.1536destroyWindow("IMAGES CODE") 

            # Show image
            cv2.imshow('Frame', frame2view)
            
            # Let OpenCV manage window events
            key = cv2.waitKey(50)
            # If ESCAPE key pressed, stop
            if key == 'z':
                pass
            if key == 27:
                print('--roi "{} {} {} {} {} {} {} {}"'.format(self.roi[0][0],self.roi[0][1],self.roi[1][0],self.roi[1][1],self.roi[2][0],self.roi[2][1],self.roi[3][0],self.roi[3][1]))
                self.cam.release()

def val2bin(val, th):
    return 1 if val < th else 0

def get_average_val_in_contour(image, contour):
    if(image.size < contour.size):
        raise ValueError("L'image est plus petite que le contour !")
    x,y,w,h = cv2.boundingRect(contour)  
    return cv2.mean(image[y:y+h,x:x+w])[0]

def sort_contours(contour, max_width, method="left-to-right"):
    # je ne comprend pas le rôle de cols dans l'algo de ranking, remplacer par la longeur max ?
    def rank_vertically_first(contour, cols):
        tolerance_factor = 10
        origin = cv2.boundingRect(contour)
        return ((origin[0] // tolerance_factor) * tolerance_factor) * cols + origin[1]
    
    def rank_horizontally_first(contour, cols):
        tolerance_factor = 10
        origin = cv2.boundingRect(contour)
        return ((origin[1] // tolerance_factor) * tolerance_factor) * cols + origin[0]
    
    sorted_contours = []
    reverse = False
    if method == "right-to-left" or method == "bottom-to-top":
        reverse = True

    if method == "top-to-bottom" or method == "bottom-to-top":
        sorted_contours = sorted(contour, key=lambda x:rank_vertically_first(x, max_width), reverse=reverse)

    if method == "left-to-right" or method == "right-to-left":
        sorted_contours = sorted(contour, key=lambda x:rank_horizontally_first(x, max_width), reverse=reverse)

    return sorted_contours

app = App(cam,roi)
app.run()