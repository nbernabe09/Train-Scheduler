// Initialize Firebase
var config = {
  apiKey: "AIzaSyCvkJPJM_Bbh7ScEO2cko4BlGf2n6AnWac",
  authDomain: "trainscheduler-79d3e.firebaseapp.com",
  databaseURL: "https://trainscheduler-79d3e.firebaseio.com",
  projectId: "trainscheduler-79d3e",
  storageBucket: "trainscheduler-79d3e.appspot.com",
  messagingSenderId: "83289470867"
};

firebase.initializeApp(config);
var database = firebase.database();

// Initial Variables
var tbody = $("table tbody");

// Functions
function train(trainObj) {
	this.name = trainObj.name;
	this.destination = trainObj.destination;
	this.time = trainObj.time;
	this.frequency = trainObj.frequency;
}

function newTrain(train) {
	database.ref().push({
		trains: train,
		dateAdded: firebase.database.ServerValue.TIMESTAMP
	});
}

function createRow(rowObj) {
	var newRow = $("<tr>");

	for (prop in rowObj) {
		var tempTd = $("<td>");
		var tempVal = $("<p>");
		tempVal.text(rowObj[prop]);
		tempTd.append(tempVal);
		newRow.append(tempTd);
	}

	tempTd = tempTd = $("<td>");
	var tempVal = $("<p>");
	tempVal.html("<button class='btn btn-xs btn-info' id='edit-train'>Edit</button> <button class='btn btn-xs btn-danger' id='delete-train'>Delete</button>");
	tempTd.append(tempVal);
	newRow.append(tempTd);

	return newRow;
}

function addArrival(time, away) {
	var now = moment();
	var firstTime = moment([time], "HH:mm");
	var convertTime = moment(firstTime, "HH:mm").subtract(1, "y");
	var diffTime = now.diff(moment(convertTime), "m");
	var remain = diffTime % away;
	return away - remain;
}

function addContent(trainCont) {
	var until = addArrival(trainCont.time, trainCont.frequency);
	var rowObj = {
		name: trainCont.name,
		destination: trainCont.destination,
		frequency: trainCont.frequency,
		arrival: moment().add(until, "m").format("HH:mm"),
		away: until
	}

	var tempRow = createRow(rowObj);
	tbody.append(tempRow);
}

// Buttons
$("#add-train").click(function() {
	event.preventDefault();
	var newT = new train({
		name: $("#name-input").val(),
		destination: $("#destination-input").val(),
		time: $("#time-input").val(),
		frequency:$("#frequency-input").val()
	});
	newTrain(newT);

	database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
		var sv = snapshot.val();
		addContent(sv.trains);
	}, function(errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});
});

$(document).on("click", "#edit-train", function() {
	alert("This is when it allows you to edit.");
}),

$(document).on("click", "#delete-train", function() {
	var deleteTrain = confirm("Are you sure you want to delete?");
	if (deleteTrain === true) {
		alert("This is when it deletes the row.")
		// $(this).closest('tr').remove();
	}
}),

// Firebase Watcher
database.ref().on("value", function(snapshot) {
	tbody.empty();
	var snap = snapshot.val();

	for (var prop in snap) {
		var tempTrains = snap[prop].trains;
		addContent(tempTrains);
	}

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});