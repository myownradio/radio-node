# Radio Node
Radio streaming service.

## Supported API
* mor
* fake

## Flowing components
### Decoder
Decoded audio stream.

Methods:
* stop - stop decoder

Events:
* data - audio stream data
* end - end of stream
* error - error occurred


### Stream
Continuous audio stream of channel.

Methods:
* restart - reload now playing info and restart stream
* stop - stop streaming

Events:
* data - audio stream data
* end - end of stream
* error - error occurred
* title - title of now playing track
* restart - stream is restarting
