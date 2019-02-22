# VisionSystemRemoteClient

## Connecting and Disconnecting Websockets

Clients will send three types of messages to connect and disconnect from the server.

Open a connection - 
```json
{
    "PORT": "ttyUSB4",
    "TYPE": "OPEN"
}
```

Close a connection - 
```json
{
    "PORT": "ttyUSB4",
    "TYPE": "CLOSE"
}
```

Switch a connection - 
```json
{
    "PORT": "ttyUSB4",
    "TYPE": "SWITCH",
    "NEW_PORT": "ttyUSB3"
}
```


## Communication Protocol

Every message will have a TYPE and CONTENT.

JSON Input to the Websockets have the following structure.
```json
{
    "TYPE": ...,
    "CONTENT": ...
}
```
TYPE can be either -

1. PORTLIST
2. MESSAGE

Content is as follows -

1. PORTLIST -

Mapping of internal port name to a JSON object that contains team name and mission name.
```json
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
```

2. MESSAGE -

Contains a JSON object of the format -

```json
{
    "M_TYPE": "DEBUG",
    "CONTENT": "Lalala is this working"
}
```
```json
{
    "M_TYPE": "MISSION",
    "CONTENT_TYPE": "",
    "CONTENT": ""
}
```
CONTENT_TYPE => STARTMISSION, ENDMISSION, NAVIGATED, BASE, BONUS
CONTENT => Relevant information.

Where M_TYPE can be either DEBUG or REG.

## How to Run

To run a local development server, install Jekyll locally.

```bash
cd VisionSystemRemoteClient
bundle install && bundle exec jekyll serve
```