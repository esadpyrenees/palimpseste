# palimpseste

## Installation 
### Python & environnement virtuel

```bash
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
pip install "python-socketio[client]"
```

### Server node
Le serveur node doit être installé dans le dossier `server` :
```bash
cd server
npm install
```

## Usage
```bash
venv/bin/python decode.py
venv/bin/python decode.py --cam 2
venv/bin/python decode.py --cam 2 --roi "407 469 398 311 686 310 690 470"
```

Puis lancé, après avoir configuré l'adresse IP du serveur dans les fichiers `server/server.js` et `chaussette.py`, lancer le serveur node:

```bash
node server.js
```

## Vues publiques

### Affichage global
`http://{ adresse IP }/`

### Design & layout des cartes
`http://{ adresse IP }/code`

### Vue _master_ pour tester
`http://{ adresse IP }/master`

### Vue _free_ pour qu’une carte envoie un texte libre
`http://{ adresse IP }/free`

## Code carte

identifiant de carte sur 12 bits + 4 bits de contrôle de la position et des valeurs de noir et blanc.

```
blanc = 0
noir  = 1
```
```
##### ctrlB ctrlW #####
bit0  ##### ##### bit6
bit1  ##### ##### bit7 
bit2  ##### ##### bit8 
bit3  ##### ##### bit9
bit4  ##### ##### bit10
bit5  ##### ##### bit11
##### ctrlW crtlB #####

code = bit0 bit1 bit2 bit3 bit4 bit5 bit6 bit7 bit8 bit9 bit10 bit11
102  = 0    0    0    0    0    1    1    0    0    1    1     0
```

