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

		var bestMods = [];
		var highestSpeeds = [];

		mods.forEach(function(mod){

			console.log("MOD: "+mod);
		
			if (mod.primary.type == "Speed") {
				var speed = parseInt(mod.primary.value.replace(/\+|%/g,''));
				
				console.log("SPEED - primary: "+speed);
				
				if (highestSpeeds[mod.slot] == null || speed > highestSpeeds[mod.slot]) {
					highestSpeeds[mod.slot] = speed;
					bestMods[mod.slot] = mod;

					console.log("NEW BEST MOD - PRIMARY: speed = "+speed+", mod = "+mod);
				}
			}
		
			mod.secondary.forEach(function(param){
				
				console.log("PARAM: "+param);
				
				if (param.type == "Speed") {
					var speed = parseInt(param.value.replace(/\+|%/g,''));
				
					console.log("SPEED - secondary: "+speed);

					if (highestSpeeds[mod.slot] == null || speed > highestSpeeds[mod.slot]) {
						highestSpeeds[mod.slot] = speed;
						bestMods[mod.slot] = mod;

					console.log("NEW BEST MOD - SECONDARY: speed = "+speed+", mod = "+mod);
					}
				}
				
			});
			
		});

		console.log("BESTMODS: "+bestMods);
		console.log("HIGHESTSPEEDS: "+highestSpeeds);
		
		res.render('index.html', { bestMods : JSON.stringify(bestMods), highestSpeeds: JSON.stringify(highestSpeeds)});

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
