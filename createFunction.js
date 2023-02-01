const axios = require('axios');
const readline = require('readline');

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

function getDownloadURL(owner, repo, file) {
	return new Promise(function(resolve, reject) {
		options = {
			method: 'GET',
			url: "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + file,
			validateStatus: () => true
		};
		axios.request(options).then(function(response) {
			resolve(response.data.download_url);
		}).catch(function(error) {
			reject(error);
		});
	})
}

function getFileContents(downloadUrl) {
	return new Promise(function(resolve, reject) {
		options = {
			method: 'GET',
			url: downloadUrl,
			validateStatus: () => true
		};
		axios.request(options).then(function(response) {
			resolve(response.data);
		}).catch(function(error) {
			reject(error);
		});
	})
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
	//Set Repo Vars
	var owner = "will-orbit";
	var repo = "segment-integration";
	var functionFile = "segment.js";
	var settingsFile = "functionSettings.txt"

	//Get Function Code
	var functionDownloadUrl = await getDownloadURL(owner, repo, functionFile);
	console.log("Got Function Download URL");
	var functionCode = await getFileContents(functionDownloadUrl);
	console.log("Got Function Code")

	//Get Settings Array for Function
	var settingsDownloadUrl = await getDownloadURL(owner, repo, settingsFile);
	console.log("Got Settings Download URL");
	var settings = await getFileContents(settingsDownloadUrl);
	console.log("Got Settings");

	//Ask for Segment API Key
	var apiToken = await askQuestion("Enter your Segment API Token: ");
	console.log(apiToken)
	//Create Function
	console.log("Creating Segment Function...")
	//var apiToken = "sgp_PKgTKBQUZ0SCOEDUMFMa5rerxsnYDbJivKpjDYLjDB5kI1LQKBjGF4NOt7EgguGX";
	var functionName = "Automated Function Test 2";
	var result = await createSegmentFunction(apiToken,functionName,settings,functionCode);
	console.log("Create response code: " + result.status)
	console.log("Create response text: " + result.statusText)

}

main();