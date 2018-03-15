// function onDeviceReady() {
    // cordova.plugins.backgroundMode is now available
	// cordova.plugins.backgroundMode.setEnabled(true);

	if( localStorage.getItem('myuuid') === null){
		resetUUID();
	}
	//document.getElementById('uuid').innerHTML = localStorage.getItem('myuuid');
	var wsurl = 'wss://ajithkserver.herokuapp.com/';
	/* var wsurl = 'ws://192.168.43.141:3000'; */
	var httpurl = 'http://localhost:3000';
	
	var ws;
	// = new WebSocket( wsurl);
    var element = document.getElementById('geolocation');
	var trigname = document.getElementById('trig');
	var mySelect = document.getElementById('mySelect');

	var buses = ["77", "45D", "210P", "15E", "210E", "6thfloor coordinates","RajHouse"];

	buses.forEach( function( i, j){
			var soption = document.createElement( "option");
			soption.value = i;
			soption.text = i;
			mySelect.appendChild( soption);
		});

	var usertype = 1;

	var active = false; var watchID;
				function onSuccess(position) {
			
			element.innerHTML = 'Latitude: '          + position.coords.latitude + '<br/>' +
			  'Longitude: '         + position.coords.longitude         + '<br/>' +
			  'Altitude: '          + position.coords.altitude          + '<br/>' +
			  'Accuracy: '          + position.coords.accuracy          + '<br/>' +
			  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br/>' +
			  'Heading: '           + position.coords.heading           + '<br/>' +
			  'Speed: '             + position.coords.speed             + '<br/>' +
			  'Timestamp: '         + position.timestamp                + '<br/>' +
								'<hr />'      + element.innerHTML;

			ws.send(JSON.stringify([position.coords.latitude, position.coords.longitude, position.coords.speed]));
		}

		// onError Callback receives a PositionError object
		//
		function onError(error) {
			alert('code: '    + error.code    + '\n' +
				  'message: ' + error.message + '\n');
		}


    function startbus(){
		if( !active){
			
			// ws.close();
			 ws = new WebSocket( wsurl);
			
			/*ws.onopen = function () {
        		// console.log('open');
        			this.send( JSON.stringify([ usertype, mySelect.value,myroutes.value, localStorage.getItem('myuuid')]));       // transmit "hello" after connecting 
   			 }; */
			 
			 ws.onopen = function () {
        		// console.log('open');
        			this.send( JSON.stringify([ usertype, mySelect.value, localStorage.getItem('myuuid')]));       // transmit "hello" after connecting 
   			 };
	
			
			
    		watchID = navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3600000,timeout: 3000, enableHighAccuracy: true });
			active = true;
			trigname.innerHTML = 'Stop';
			trigname.className = 'btn btn-danger btn-circle btn-xl';
		} else{
			stopProcess();
		}
	}
		
	function stopProcess(){
		navigator.geolocation.clearWatch(watchID);
		active = false;
		trigname.innerHTML = 'Start';
		trigname.className = 'btn btn-success btn-circle btn-xl';
		element.innerHTML = "";
		ws.close();
	}
	
	function generateUUID() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	}

	function resetUUID(){
		localStorage.setItem('myuuid', generateUUID());
		document.getElementById('uuid').innerHTML = localStorage.getItem('myuuid');
		stopProcess();
	}

// }

// document.addEventListener('deviceready', onDeviceReady, false);