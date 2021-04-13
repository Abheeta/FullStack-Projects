const axios = require('axios');
// const objectsToCsv = require('objects-to-csv');
const fs = require('fs');
function getApiURL() {
// Returns a String denoting the API url which fetches all problems
	var apiUrl = "https://leetcode.com/api/problems/all/";
	
	return apiUrl
}
async function getAllProblems() {
// Returns a Promise object of the response on calling
// the API to fetch all problems
//method 1 creating our custom promise
	const promise = new Promise((resolve,reject) => {

		axios.get(getApiURL()).then(res => {
			resolve(res.data)
		}).catch(err =>{
			reject(err)
		})
	})
	return promise;
	
	
	// return axios.get("https://leetcode.com/api/problems/all/")
	// 		.then(res => res.data);

}


function getTopHundredProblems(allProblems) {
    // Returns the top 100 most submitted problems
	// Input:
	//  	allProblems - Raw API response
	// Output:
	//  	Array of objects with the question id, title and total submissions values for the
	//      top 100 problems ordered by their total submissions in descending order
	let dataToFilter = allProblems.stat_status_pairs; 
	let filteredData = dataToFilter.filter(problem => !(problem.paid_only))
	
	let transformedData = filteredData.map((object) => ({
		id: object.stat.frontend_question_id,
		question_title: object.stat.question__title,
		submissions: object.stat.total_submitted
	}))

	
	
	let sortedData = transformedData.sort((a,b)=>{
			return b.submissions - a.submissions
	})
	
	return sortedData.slice(0,100);
		
}


// async function createCSV(topHundredProblems) {
//     // Write data to a CSV file
// 	// Input:
// 	//  	topHundredProblems - data to write
// 	const csv = new ObjectsToCsv(topHundredProblems);
// 	return await csv.toDisk('./list.csv');

// }

async function main() {
    console.log("Running main");
    const allProblems = await getAllProblems();
    if (allProblems != null) {
		fs.writeFile("./problemsAll.json", JSON.stringify(allProblems, null, 4), (err) => {
			if (err) {
				console.error(err);
				return;
			}
	   });
	}

    const topHundredProblems = await getTopHundredProblems(allProblems);
    // createCSV(topHundredProblems);
}

module.exports = {getApiURL, getAllProblems, getTopHundredProblems, main};
