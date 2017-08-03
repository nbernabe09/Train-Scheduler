// Initialize Firebase
var config = {
	apiKey: "AIzaSyAudviv7IsHmtQksn9UofBC-9OISb0Ps8M",
	authDomain: "testdatabase-a03f2.firebaseapp.com",
	databaseURL: "https://testdatabase-a03f2.firebaseio.com",
	projectId: "testdatabase-a03f2",
	storageBucket: "",
	messagingSenderId: "147137402705"
};

firebase.initializeApp(config);

var database = firebase.database();

// Initial Variables
var tbody = $("table tbody");
var trains = [];
var trainCount = 0;

// Functions
function newTrain() {
	var train = {
			name: $("#name-input").val(),
			destination: $("#destination-input").val(),
			frequency: $("#frequency-input").val(),
			time: $("#time-input").val()
	}
	trains.push(train);
	trainCount++;
	database.ref().set({
		trains: trains,
		trainCount: trainCount,
	});
}

// Buttons
$("#add-train").click(function() {
	event.preventDefault();
	newTrain();
});

// Firebase Watcher
database.ref().on("value", function(snapshot) {
	// showTrain(snapshot);
	trainCount = snapshot.val().trainCount;
	trains = snapshot.val().trains;
	tbody.empty();
	for (var i = 0; i < trainCount; i++) {
		var newRow = $("<tr>");

		newRow.append($("<td>"));
		newRow.append($("<td>"));
		newRow.append($("<td>"));
		newRow.append($("<td>"));
		newRow.append($("<td>"));

		var tds = newRow.find("td");

		tds.eq(0).text(snapshot.val().trains[i].name);
		tds.eq(1).text(snapshot.val().trains[i].destination);
		tds.eq(2).text(snapshot.val().trains[i].frequency);
		tds.eq(3).text(snapshot.val().trains[i].time);
		tds.eq(4).text();

		tbody.append(newRow);
	}
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});