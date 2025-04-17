from chaussette import emitMessage

currentCardNumber = 0

def sendMessage(cardNumber):
    global currentCardNumber
    # filtrer le flux constant de valeurs renvoyées par la reconnaissance
    if currentCardNumber != cardNumber:
        # changement de carte !
        currentCardNumber = cardNumber
        # envoi du message via websocket
        emitMessage("card change", cardNumber)
        print(f"Le numéro est {cardNumber} !")