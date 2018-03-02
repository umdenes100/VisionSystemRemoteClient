# VisionSystemRemoteClient
Client for Vision System used in ENES100.

JSON Input to the Websockets have the following structure.

{
    "TYPE": ...,
    "CONTENT": ...
}

TYPE can be either -

1. PORTLIST
2. MESSAGE

Content is as follows -

1. PORTLIST -

Mapping of internal port name to a JSON object that contains team name and mission name.

{
    "ACMO": {
                "NAME": "The Japandroids",
                "MISSION": "CHEMICAL"
            },
    "TTYO": {
                "NAME": "Water is Lit",
                "MISSION": "BLACK BOX"
            },
    ...
}

2. MESSAGE -

Contains a JSON object of the format -

{
    "M_TYPE": "DEBUG",
    "CONTENT": "Lalala is this working"
}

{
    "M_TYPE": "MISSION",
    "CONTENT_TYPE": "",
    "CONTENT": ""
}

CONTENT_TYPE => STARTMISSION, ENDMISSION, NAVIGATED, BASE, BONUS
CONTENT => Relevant information.

Where M_TYPE can be either DEBUG or REG.