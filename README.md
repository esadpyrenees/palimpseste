# palimpseste

## Environnement virtuel

```bash
python -m venv venv
source venv/bin/activate
```

## Requirements
```bash
pip install requirements
pip install "python-socketio[client]"
```

## Usage
```bash
venv/bin/python decode.py
venv/bin/python decode.py --cam 2
venv/bin/python decode.py --cam 2 --roi "407 469 398 311 686 310 690 470"
```
