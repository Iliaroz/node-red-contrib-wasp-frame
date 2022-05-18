# node-red-contrib-wasp-frame

Parse frame from Waspmote Frame format into JSON. ASCII format is supported.

Parse frame from Waspmote Frame format into JSON object. ASCII format is supported. (not BINARY)

This wasp-frame node parse input `msg['payload']` buffer from WaspFrame format into JSON format. Currently version Waspmote v15 is supported.

WaspFrame is formatted frames created with a library included within Waspmote API. See [online documentation](https://development.libelium.com/data-frame-programming-guide/) for more information.

THIS IS NOT READY FOR PRODUCTION YET!

## Input

payload object | string

WaspFrame buffer (preferred) or string to parse

#### NOTES:  
Input string example

```<=>†•#1A2B3C4D1A2B3C4D#NB_IOT_TCP#0#EV_A:0#EV_C:0#EV_D:0#WF:0.000#BAT:65#TIME:23-39-3#DATE:21-1-29#```

## Output

payload object | string

the results.

#### NOTES:  
Output examle  

```
{
	"frametype":"Information",
	"SerialID":"1A2B3C4D1A2B3C4D",
	"WaspmoteID":"NB\_IOT\_TCP",
	"Sequence":0,
	"EV\_A":0,
	"EV\_C":0,
	"EV\_D":0,
	"WF":0,
	"BAT":65,
	timestamp: "2021-01-29T21:39:03.000Z"
}
```