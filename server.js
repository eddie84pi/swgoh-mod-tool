var express = require('express'),
    app     = express(),
    morgan  = require('morgan');

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.get('/', function (req, res) {

	const swgoh = require("swgoh").swgoh;
	const username = "Eddy Del Gormo";

	swgoh.mods(username).then(function(mods){
	
	
		console.log("MODS: "+mods);

		var bestModsArr = [];
		var highestSpeedsArr = [];

		mods.forEach(function(mod){

			console.log("MOD: "+mod);
		
			if (mod.primary.type == "Speed") {
				var speed = parseInt(mod.primary.value.replace(/\+|%/g,''));
				
				console.log("SPEED: "+speed);
				
				if (highestSpeedsArr[mod.slot] == null || speed > highestSpeedsArr[mod.slot]) {
					highestSpeedsArr[mod.slot] = speed;
					bestModsArr[mod.slot] = mod;
				}
			}
		
			mod.secondary.forEach(function(param){
				
				console.log("PARAM: "+param);
				
				if (param.type == "Speed") {
					var speed = parseInt(param.value.replace(/\+|%/g,''));
					if (highestSpeedsArr[mod.slot] == null || speed > highestSpeedsArr[mod.slot]) {
						highestSpeedsArr[mod.slot] = speed;
						bestModsArr[mod.slot] = mod;
					}
				}
				
			});
			
		});
		
		res.render('index.html', { bestMods : bestModsArr, highestSpeeds: highestSpeedsArr});

	});

});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
