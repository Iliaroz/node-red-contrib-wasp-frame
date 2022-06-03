/*
Copyright 2022 RIN

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

module.exports = function(RED) {
	/*
	*	0: uint8_t
	*	1: int (the same as int16_t)
	*	2: double
	*	3: char*
	*  	4: uint32_t
	*  	5: uint8_t*
	*/
	const  FRAME_SENSOR_TYPES =
	[
		-
		//// Gases v30 /// 0 .. 11
		2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 

		//// Gases PRO v30 /// 12 .. 20
		2,	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 
		//// Cities PRO v30
		2, 
		//// reserved /// 22 .. 29
		0, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 
		//// Gases PRO v30 /// 30 .. 35
		2, 	2, 	2, 	2, 	2, 	2, 
		//// reserved
		0, 	0, 	0, 	0, 
		//// Events v30 /// 40 .. 51
		2, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 
		//// Additional /// 52 .. 99
		0, 	2, 	1, 	3, 	3, 	3, 	0, 	0, 	1, 	1, 	2, 	1, 	4, 	3, 	3, 	3, 	3, 	3, 	2, 	2, 	2, 	4, 	2, 	2, 	2, 	2, 	4, 	1, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 	2, 	2, 	2, 	2, 	2, 	2, 	0, 	0, 	0, 	0, 	0, 
		//// Smart Water Ions /// 100 .. 122
		2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	0, 	0, 
		//// Additional /// 123 .. 128
		4, 	0, 	0, 	0, 	0, 	0, 
		//// Radiation
		2, 
		//// Smart Water /// 130 .. 149
		2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 	0, 
		//// Smart Agriculture /// 150 .. 169
		2, 	2, 	2, 	2, 	2, 	2, 	2, 	0, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	2, 	0, 
		//// Ambient Control /// 170 .. 174
		2, 	2, 	2, 	0, 	0, 
		//// 4-20 mA /// 175 .. 179
		2, 	2, 	2, 	2, 	0, 
		//// Industrial protocols (ModBus & CAN bus) /// 180 .. 189
		1, 	1, 	1, 	1, 	1, 	1, 	1, 	0, 	0, 	1, 
		//// OPC sensor
		1, 	1, 	1, 
		//// fever /// 193 .. 199
		2, 	2, 	2, 	4, 	4, 	2, 	0, 
	];


	const FRAME_SENSOR_STR =
	[
	// Gases v30
	 "CO",  "CO2",  "O2",  "CH4",  "O3",  "NH3",  "NO2",  "LPG",  "AP1",  "AP2",  "SV",  "VOC", 

	// Gases PRO v30
	 "NO",  "CL2",  "ETO",  "H2",  "H2S",  "HCL",  "HCN",  "PH3",  "SO2", 

	// Cities PRO v30
	 "NOISE", 

	// Reserved
	 "",  "",  "",  "",  "",  "",  "",  "", 
	// Gases PRO v30 (P&S)
	 "GP_A",  "GP_B",  "GP_C",  "",  "",  "GP_F",  "",  "",  "",  "", 

	// Events v30
	 "WF",  "PIR",  "LP",  "LL",  "HALL",  "RIN",  "ROUT",  "EV_A",  "EV_C",  "EV_D",  "EV_E",  "", 

	// Additional
	 "BAT",  "GPS",  "RSSI",  "MAC",  "NA",  "NID",  "DATE",  "TIME",  "GMT",  "RAM",  "IN_TEMP",  "ACC",  "MILLIS",  "STR",  "",  "",  "UID",  "RB",  "PM1",  "PM2_5",  "PM10",  "PART",  "TC",  "TF",  "HUM",  "PRES",  "LUX",  "US",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "SPEED_OG",  "COURSE_OG",  "ALT",  "HDOP",  "VDOP",  "PDOP",  "",  "",  "",  "",  "", 

	// Smart Water Ions v30
	 "SWICA",  "SWIFL",  "SWIFB",  "SWINO3",  "SWIBR",  "SWICL",  "SWICU",  "SWIIO",  "SWINH4",  "SWIAG",  "SWIPH",  "SWILI",  "SWIMG",  "SWINO2",  "SWICLO4",  "SWIK",  "SWINA",  "SWI_A",  "SWI_B",  "SWI_C",  "SWI_D",  "",  "", 

	// Additional
	 "TST",  "",  "VAPI",  "VPROG",  "VBOOT",  "PS", 
	// Radiation
	 "RAD", 

	// Smart Water v30
	 "PH",  "ORP",  "DO",  "COND",  "WT",  "TURB",  "PH_A",  "PH_E",  "ORP_A",  "ORP_E",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "", 

	//  Smart Agriculture v30
	 "SOIL1",  "SOIL2",  "SOIL3",  "SOILTC",  "SOILTF",  "LW",  "ANE",  "WV",  "PLV1",  "PLV2",  "PLV3",  "PAR",  "UV",  "TD",  "SD",  "FD",  "SOIL_B",  "SOIL_C",  "SOIL_E",  "", 
	// Ambient Control
	 "TCB",  "HUMB",  "LUM",  "",  "", 
	// 4-20 mA
	 "CUR_A",  "CUR_B",  "CUR_C",  "CUR_D",  "", 
	// Industrial protocols: Modbus & CAN bus
	 "MB_COILS",  "MB_DI",  "MB_HR",  "MB_IR",  "CB_RPM",  "CB_VS",  "CB_FR",  "CB_FL",  "CB_TP",  "CB_FP", 
	// OPC N3 sensor
	 "PM_BIN",  "PM_BINL",  "PM_BINH", 
	// fever kit
	 "USER_TC",  "AIR_TC",  "SI4B1_TC",  "COUNTER",  "FEVER_COUNTER",  "THRESHOLD",  "RESULT"
	];

    function WaspFrameNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.fullNameOutput = config.fullNameOutput == false;
        node.resultType = config.resultType || 'keyvalue';
        node.resultTypeType = config.resultTypeType || 'str';
        node.Measurement = config.Measurement || '';
        node.MeasurementType = config.MeasurementType || 'str';
        node.Bucket = config.Bucket || '';
        node.BucketType = config.BucketType || 'str';
        node.Organization = config.Organization || '';
        node.OrganizationType = config.OrganizationType || 'str';
		



		function ParseIncomeBuffer(msgBuffer) {
			var message = {};
			var tags = {};
			var data = {};
			var timestamp = Date.now();
			var parsed = false;
			node.status({});
			if ( !correctFrameHeader(msgBuffer) ) {
				node.status({ fill: "red", shape: "dot", text: "Incorrect header" });
				return;
			}
			if (typeof(msgBuffer) === "string") {
				/* PARSE as ASCII */
				if ( correctFrameHeader(msgBuffer) ) {
					ParseStringFramePayload(msgBuffer.slice(3));
				} else {
					ParseStringFramePayload(msgBuffer);
				}
				
			} else if ( Buffer.isBuffer(msgBuffer) ) {
				/* PARSE as BINARY */
				if ( msgBuffer[3] >= 128 ) {    // string buffer
					putTag( "frametype" , getFrameType(msgBuffer[3]) );
					/// fieldsNum = msgBuffer[4];
					let strToParse = String(msgBuffer.slice(5));
					ParseStringFramePayload(strToParse);
				} else {    // really BINARY Frame
					ParseBinaryFramePayload();
				}
			}
			/* Form out message */
			message.payload = {};
			switch (node.resultType) {
				case "influx18":
					parseDateTime();
					if (node.Measurement) {
						message.measurement = String(node.Measurement);
					}
					message.payload = [{...data}, {...tags},];
					message.timestamp = timestamp;
					break;
				case "influx20":
					parseDateTime();
					if (node.Bucket) {
						message.payload.bucket = String(node.Bucket);
					}
					if (node.Organization) {
						message.payload.org = String(node.Organization);
					}
					message.payload.data = [{},];
					if (node.Measurement) {
						message.payload.data[0].measurement = String(node.Measurement);
					}
					message.payload.data[0].tags = {...tags};
					message.payload.data[0].fields = {...data};
					message.payload.data[0].timestamp = timestamp;
					break;
				default:	// keyvalue
					message.payload = {...tags, ...data};
			}

 			parsed = true;	// fake it, any stuff passes to output
			if ( parsed ) { return message; };
			
			/// ****** END of ParseIncomeBuffer code.

			function parseDateTime() {
				if ( data.hasOwnProperty( "TST" ) ) {
					if ( isNaN(data["TST"]) == false ) {
						timestamp = new Date(1000 * data["TST"]);	// seconds epoch to millisecond
						delete data["TST"];
					}
				} else if ( data.hasOwnProperty( "DATE" ) && data.hasOwnProperty( "TIME" ) ){
					let Dparts = data["DATE"].split(/[-]/);
					let Tparts = data["TIME"].split(/[+-]/);
					var tstamp = new Date(Number(Dparts[0]) + 2000, Number(Dparts[1]) - 1, Dparts[2], Tparts[0], Tparts[1], Tparts[2]);
					if (isNaN(tstamp.getTime()) == false) {
						timestamp = new Date(tstamp);
						delete data["DATE"];
						delete data["TIME"];
					}
				}
			}

			function correctFrameHeader(buf) {
				return String(buf).startsWith("<=>");
			}

			function ParseStringFramePayload(strToParse) {
				const BufSlices = strToParse.split("#");
				putTag( "SerialID", String(BufSlices[1]) );
				putTag( "WaspmoteID", String(BufSlices[2]) );
				putTag( "Sequence", getIntVal(BufSlices[3]) );
				for (let i=4; i < BufSlices.length - 1; i++) {
					ParseStringChunk(BufSlices[i]);
				}
			}
			
			function putTag(Tname, Tval) {
				switch (node.resultType) {
					case "influx18":
						tags[Tname] = Tval;
						break;
					case "influx20":
						tags[Tname] = Tval;
						break;
					default:
						data[Tname] = Tval;
				}
			}

			function putData(Dname, Dval) {
				data[Dname] = Dval;
			}


			function ParseStringChunk(chunk) {
				const chunkName = chunk.split(":")[0];
				const chunkVal =  chunk.split(":")[1];
				const fname = getUnusedFieldName( data, chunkName );
				var subvals =  chunkVal.split(";");
				switch (chunkName){
					/// HUGE switch for multi-fields chunks
					/// All other with one field go to default
					case "GPS" :    // 2 float fields: latitude, longitude
						putData( getUnusedFieldName( data, chunkName + '_LAT' ) , getValue(chunkName, subvals[0]) );
						putData( getUnusedFieldName( data, chunkName + '_LON' ) ,  getValue(chunkName, subvals[1]) );
						break;
					case "DATE" :    // 3 uint8_t fields: year, month, day
						subvals = chunkVal.split("-");
						//var dd = new Date(subvals[0], subvals[1], subvals[2]);
						//data[ fname ] = dd;
						putData(  fname , chunkVal );
						break;
					case "TIME" :    // 3 uint8_t fields: hours, minutes, seconds
						subvals = chunkVal.split("-");
						//var dt = new Date(0, 0, 0, subvals[0], subvals[1], subvals[2].slice(0, 2));
						//data[ fname ] = dt;
						putData(  fname , chunkVal );
						break;
					case "ACC" :    // 3 int fields: latitude, longitude
						putData( getUnusedFieldName( data, chunkName + '_X' ) , getValue(chunkName, subvals[0]) );
						putData( getUnusedFieldName( data, chunkName + '_Y' ) , getValue(chunkName, subvals[1]) );
						putData( getUnusedFieldName( data, chunkName + '_Z' ) , getValue(chunkName, subvals[2]) );
						break;
					case "MB_COILS" :    // 2 int fields: 
					case "MB_DI" :    // 2 int fields: 
						putData( getUnusedFieldName( data, chunkName + '_A' ) , getValue(chunkName, subvals[0]) );
						putData( getUnusedFieldName( data, chunkName + '_B' ) , getValue(chunkName, subvals[1]) );
						break;
					case "MB_HR" :    // 3 int fields: 
					case "MB_IR" :    // 3 int fields: 
						putData( getUnusedFieldName( data, chunkName + '_A' ) , getValue(chunkName, subvals[0]) );
						putData( getUnusedFieldName( data, chunkName + '_B' ) , getValue(chunkName, subvals[1]) );
						putData( getUnusedFieldName( data, chunkName + '_C' ) , getValue(chunkName, subvals[2]) );
						break;
					default:
						putData( fname , getValue(chunkName, chunkVal) );
				}
			}


			function ParseBinaryFramePayload() {
				// console.log('Payload type is BINARY');
				
			}


			function getValue(id, val) {
				var index;
				if (typeof(id) === 'string'){
					if (id == '') { // empty
						return val;
					} else {
						index = FRAME_SENSOR_STR.indexOf(id) ;
					}
				} else {    // binary ID
					// TODO:
					index = Number(id);
				}
				if ( index < 0 || index > FRAME_SENSOR_TYPES.length ) {
					//error
					return val;
				}
				switch (FRAME_SENSOR_TYPES[index]) {
				// *	0: uint8_t
				// *	1: int (the same as int16_t)
				// *	2: double
				// *	3: char*
				// *  	4: uint32_t
				// *  	5: uint8_t*
					case 0 :
					case 1 :
					case 4 :
					case 5 :
						return getIntVal(val);
					case 2 :
						return getFloatVal(val);
					default :
						return String(val);
				}
			}

			function getFloatVal(val) {
				return parseFloat(val);
			}

			function getIntVal(val) {
				return parseInt(val);
			}


			function getFrameType(type) {
				switch (type){
					case 0 :
					case 128:
						return "Information";
						break;
					case 1 :
					case 129:
						return "TimeOut";
						break;
					case 2 :
					case 130:
						return "Event";
						break;
					case 3 :
					case 131:
						return "Alarm";
						break;
					case 4 :
					case 132:
						return "Service1";
						break;
					case 5 :
					case 133:
						return "Service2";
						break;
					case 6 :
					case 134:
						return "Information";
						break;
					case 7 :
					case 135:
						return "Information";
						break;
					case 8 :
					case 136:
						return "Information";
						break;
					case 96 :
						return "AES_ECB_FRAME_V15";
						break;
					case 97 :
						return "AES128_ECB_FRAME_V12";
						break;
					case 98 :
						return "AES192_ECB_FRAME_V12";
						break;
					case 99 :
						return "AES256_ECB_FRAME_V12";
						break;
					case 100 :
						return "AES_ECB_END_TO_END_V15";
						break;
					case 101 :
						return "AES_ECB_END_TO_END_V12";
						break;
					case 102 :
						return "AES_LIBELIUM_CLOUD_SW_FRAME";
						break;
					case 103 :
						return "AES_LIBELIUM_CLOUD_HW_FRAME";
						break;
					case 155:
						return "TimeSync";
						break;
					default:
						return "UNKNOWN";
				}
			}
			
			function getUnusedFieldName(Owner, Fname) {
				var cname = Fname;
				var n = 0;
				while (Owner.hasOwnProperty( cname ) ) {
					n++;
					cname = Fname + '_' + String(n);
				}
				return cname;
			}
		}




//// Receive message

        node.on('input', function(msg) {
			let msgBuffer = msg.payload;
			// console.log(' * node.on("input" :', msgBuffer);
			msg = {};
			
			try{
				let newmsg = ParseIncomeBuffer(msgBuffer);
				if (newmsg) {
					node.send( newmsg ) ;
				}
			}catch (error) {
                node.error(error, msg);
                node.status({ fill: "red", shape: "dot", text: error.message });
                return;//halt flow
            }
        }
		);
    } ////// END of any functions
    RED.nodes.registerType("wasp-frame",WaspFrameNode);
}

