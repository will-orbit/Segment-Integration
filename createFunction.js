const axios = require('axios');
const readline = require('readline');
const fs = require('fs')

function askQuestion(query) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise(resolve => rl.question(query, ans => {
		rl.close();
		resolve(ans);
	}))
}

function readFile(fileName) {
	try {
		const data = fs.readFileSync('config/' + fileName, 'utf8');
		return data;
	} catch (err) {
		console.error(err);
	}
}



function createSegmentFunction(apiToken, functionName, settings, code) {
	return new Promise(function(resolve, reject) {
		options = {
			method: 'POST',
			url: "https://api.segmentapis.com/functions",
			validateStatus: () => true,
			headers: {
				'Authorization': 'Bearer ' + apiToken,
				'Content-Type': 'application/json'
			},
			data: {
				"code": code,
				"displayName": functionName,
				"resourceType": "DESTINATION",
				"logoUrl": "https://avatars.githubusercontent.com/u/55637052?s=280&v=4",
				"settings": settings,
				"description": "Send your Segment Track Events into Orbit.love. See this repo for more information: https://github.com/will-orbit/Segment-Integration"
			}
		};
		axios.request(options).then(function(response) {
			resolve(response);
		}).catch(function(error) {
			reject(error);
		});
	})
}



async function main() {
	//Set Vars
	var functionFile = "segment.js";
	var settingsFile = "functionSettings.txt"

	//Get Function Code
	var functionCode = readFile(functionFile);

	//Get Settings Array for Function
	var settings = readFile(settingsFile);

	//Ask for Segment API Key
	var apiToken = await askQuestion("Enter your Segment API Token: ");

	//Create Function
	console.log("Creating Segment Function...")
	var functionName = "Orbit";
	var result = await createSegmentFunction(apiToken, functionName, settings, functionCode);
	if(result.status == "200"){
		console.log("Function Created Successully! Please connection this Function to a Segment Source and configure the settings.")
	}else{
	console.log("Create response code: " + result.status);
	console.log("Create response text: " + result.statusText);
	console.log("Please make sure you do not already have a Desintation Function in Segment with the name 'Orbit'");
}

}

main();