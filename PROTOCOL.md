# VisionSystemRemote - Communication and Video Stream Protocol

The back end is broken up into two discrete chunks - the first deals with communication and the second deals with the video stream. Of the two, communication is significantly more finicky. Depending on your front end architecture, you might want to consider modifying the API on the back end.

## Video Stream

### Port

The video stream is an MJPEG stream hosted at `http://192.168.1.2:8080/`. Given that everything in the labs goes through our router, we have the IP Addresses of the desktop computers reserved. (The desktops can be pinpointed on the network by their MAC Address). 

One of the bugs we've run into in the past, is the MAC Address being overwritten due to some kind of software change - this will cause the client to point to the wrong URL and break.

### Implementation

As implementation goes, aside from size and responsiveness, setting up the image stream in HTML is pretty straightforward. It can be accomplished with a single tag -

```html
<img src="http://192.168.1.2:8080/">
```


## Communication

### Port

Communication is hosted on a WebSocket Server at `ws://192.168.1.2:9000/`. As you can see from the URL, it's the same IP Address, but a different port and protocol (WS as opposed to HTTP). This is prone to the same MAC Address bug I mentioned earlier.

### Implementation

Starting and using WebSockets in JavaScript is quite easy - 

```javascript
const WEBSOCKET_ADDRESS = 'ws://192.168.1.2:9000/'
const connection = new WebSocket(WEBSOCKET_ADDRESS)
```

There are several methods on the connection object you can overwrite -

```javascript
connection.onopen = () => {
    console.log('Connection opened successfully!')
};

connection.onerror = error => {
    console.log('Error!')
    console.log(error)
};

connection.onmessage = message => {
	console.log('Received a message!')
	console.log(message.data)
}

connection.onclose = () {
	console.log('Connection closed...')
}
```

### Protocol

There are several moving parts in the protocol. I will go over them roughly in the order you'll encounter them in production - 
1. Receiving a Port List
2. Managing connections.
3. Handling Different Kinds of Messages

#### Receiving a Port List (Server -> Client)

The first thing that happens when you declare a new WebSocket is that you receive a message that looks like so -

```json
{
	"TYPE": "PORT_LIST",
	"CONTENT": {
		"ttyUSB0": {
			"NAME": "It's Lit",
			"MISSION": "FIRE"
		},
		"ttyUSB1": {
			"NAME": "It's Wet",
			"MISSION": "WATER"
		},
		"ttyUSB2": {
			"NAME": "It's Hard",
			"MISSION": "DEBRIS"
		},
		"ttyUSB3": {
			"NAME": "It's crashy",
			"MISSION": "CRASH_SITE"
		},
		"ttyUSB4": {
			"NAME": "It Doesn't Have a Char in the World",
			"MISSION": "DATA"
		},
		"ttyUSB5": {
			"NAME": "ttyUSB5",
			"MISSION": "CRASH_SITE"
		},
		"ttyUSB6": {
			"NAME": "ttyUSB6",
			"MISSION": "CRASH_SITE"
		},
		"ttyUSB7": {
			"NAME": "ttyUSB7",
			"MISSION": "CRASH_SITE"
		},
	}
}
```

There are several things to note when viewing the example above (aside from the unreasonably high number of working RF communicators there seem to be plugged into the computer). The first is the fact that at a high-level, incoming JSON will have a `TYPE` and `CONTENT`. The `TYPE` for a port list will always be `PORT_LIST`. It's content will be a dictionary that maps USB port name to a dictionary containing a `NAME` and `MISSION`.

The USB port name is important. This is the unique identifier we'll use when communicating to the back end about a given port (and associated team). The reason we do this is because the combination of `NAME` and `MISSION` doesn't uniquely identify a team, but only one team can be assigned a given USB port.

The second thing to note is that if a team hasn't actually connected to an RF Communicator, then the `NAME` attribute will read the USB port. This is useful because it means that you don't actually have to show that team in a select menu. By sending the `MISSION` to the front end, it allows the front end developer to build in some kind of visual cue as to what the team has connected as.

As for `MISSION`, the `MISSION` types are the same as the ones in the ENES100 Arduino Library - 
1. `CRASH_SITE`
2. `DATA`
3. `DEBRIS`
4. `FIRE`
5. `WATER`

#### Connecting to the Back End (Client -> Server)

Once you've received the list of ports and set up some way for the user to select a port, we will have to connect to the right port on the back end. This involves sending a few different kinds of messages.

##### OPEN

When you open a fresh connection (when the user first clicks on a team), you'll want to send JSON of the format - 

```json
{
	"TYPE": "OPEN",
	"PORT": "ttyUSB0"
}
```

This allows the back end to start sending messages from the right port to a given client.

##### SWITCH

What if the client accidentally clicked the wrong team/port and wants to switch to another one? This calls for a message of the following format.

```json
{
	"TYPE": "SWITCH",
	"PORT": "ttyUSB0",
	"NEW_PORT": "ttyUSB3"
}
```

In this case, the user wants to switch from the port `ttyUSB0` to `ttyUSB3`. There are a couple of reasons to maintain a `SWITCH` type. It allows us to reuse a connection on the back end. By simply reassigning which stream the back end sends, it not only allievates load that would otherwise go into sending one stream of messages into limbo, but also prevents an eventual memory leak caused by a billion open ports.

##### SOFT_CLOSE

A helpful option to offer users is the ability to simply not listen for a port. Maybe this comes by way of a clear button, or a 'blank' option in a select menu. In any case, to make this happen, that is, to keep a connection alive while not being bombarded with a stream of messages, you initiate a soft close - 

```json
{
	"TYPE": "SOFT_CLOSE",
	"PORT": "ttyUSB0"
}
```

##### HARD_CLOSE

And for when the client shuts down their browser, kills a tab, or fries their computer by sticking a 32V battery into an Arduino, we want a hard close that kills the connection on the back end.

```json
{
	"TYPE": "HARD_CLOSE",
	"PORT": "ttyUSB0"
}
```

If you build a client with all these in mind, it should have a relatively solid user experience without bearing too much load on client or server.

#### Handling Different Kinds of Messages (Server -> Client)

There are now only a few different cases to handle in terms of messages the client will receive. All of these messages will come only after a port has been selected (via either an `OPEN` or `SWITCH` command).


##### START

This indicates the start of a mission (initiated by the creation of the `Enes100` object on the Arduino). It also comes with a timestamp (in seconds from epoch) that marks when the mission was started. There are two things that should be done with a start message. The first is to visually indicate to the user that a `START` command was received. The second thing is to begin a timer (will get more into that in a second).

```json
{
	"TYPE": "START",
	"CONTENT": 1551408397
}
```

##### TIME

One useful feature of the client is displaying a timer that shows users how long their run has taken (from START to now...) The back end will send system time to the client at regular intervals. You might be wondering why we don't simply check device time and use that calculation after receiving a `START` command. The issue with that is that although it's a perfectly sound idea, it causes battery drain and heat issues on a lot of devices, and what's more can lag with the devices.

```json
{
	"TYPE": "TIME",
	"CONTENT": 1551408568
}
```

##### DEBUG

This is where the money is. These are the messages users send to the client to debug - see coordinates and print funny things. The reason these are labelled `DEBUG` is because by clearly separating them from client generated messages (for things like `START`), you can give users the option to ignore debug messages on the client. This is especially useful for instructors during competition.

```json
{
	"TYPE": "DEBUG",
	"CONTENT": "Gee whiz, this actually works!"
}
```

## Simulator

TODO: Fill this in.

## Conclusion

That should be all of it. In case the back-end API changes, be sure to update this documentation as well. Also, if parts of it are confusing, rambling, or downright unintelligble, feel free to change them.
