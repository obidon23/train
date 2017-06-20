  var config = {
    apiKey: "AIzaSyCuwT7aKBp-zOnxeRTteeY8DttZYC89ewk",
    authDomain: "train-scheduler-43ac7.firebaseapp.com",
    databaseURL: "https://train-scheduler-43ac7.firebaseio.com",
    projectId: "train-scheduler-43ac7",
    storageBucket: "",
    messagingSenderId: "990560118090"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var newTrainName;
var newTrainDestination;
var newTrainFirst;
var newTrainFrequency;
var newTrainNextArrival;
var newTrainMinutesAway;
var trainList;
var dateAdded; 

$("#results").html("<div class='col-lg-2 firstRow'>Train Name</div> <div class='col-lg-2 firstRow'>Destination</div><div class='col-lg-2 firstRow'>Frequency(min)</div><div class='col-lg-2 firstRow'>Next Arrival</div><div class='col-lg-2 firstRow'>Minutes Away</div>");
console.log(moment());

database.ref().orderByChild("Start").limitToLast(100).on("child_added", function(childSnapshot) {

  trainList = $("#results").append("<div class='col-lg-2'>" + childSnapshot.val().name + "</div> <div class='col-lg-2'>"+ childSnapshot.val().Role + "</div><div class='col-lg-2'>"+ childSnapshot.val().Start + "</div><div class='col-lg-2'>"+ childSnapshot.val().Service + "</div><div class='col-lg-2'>" + childSnapshot.val().Rate +"</div><div class='col-lg-2'>"+ childSnapshot.val().total + "</div>");
    $("#results").append(trainList);
  });

$(document).on("click", "#form", function(event) {
  event.preventDefault();
  $("#results").html("<div class='col-lg-2 firstRow'>Train Name</div> <div class='col-lg-2 firstRow'>Destination</div><div class='col-lg-2 firstRow'>Frequency</div><div class='col-lg-2 firstRow'>Next Arrival</div><div class='col-lg-2 firstRow'>Minutes Away</div><div class='col-lg-2 firstRow'>Total Billed</div>");

  newTrainName = $("#newTrainName").val().trim();
  newTrainDestination = $("#newTrainDestination").val().trim();
  newTrainFirst = $("#newTrainFirst").val().trim();
  newTrainFrequency = $("#newTrainFrequency").val().trim();
  newTrainMinutesAway = moment().format("HH:mm") % newTrainFirst;
  newTrainNextArrival = moment().format("HH:mm") + newTrainMinutesAway;

  database.ref().push({
    name: newTrainName,
    destination: newTrainDestination,
    // first: newTrainFirst,
    frequency: newTrainFrequency,
    minutes: newTrainMinutesAway,
    next: newTrainNextArrival,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
  console.log("First: " + first + "Frequency: " + frequency + "Next: " + next + "Minutes Away:: " + minutes);

$("#newTrainName").val("");
$("#newTrainDestination").val("");
$("#newTrainFirst").val("");
$("#newTrainFrequency").val("");
  $("#results").html("<div class='col-lg-2 firstRow'>Train Name</div> <div class='col-lg-2 firstRow'>Destination</div><div class='col-lg-2 firstRow'>Frequency(min)</div><div class='col-lg-2 firstRow'>Next Arrival</div><div class='col-lg-2 firstRow'>Minutes Away</div>");    $("#results").append(TrainList);
  database.ref().on("child_added", function(snapshot){
    TrainList = $("#results").append("<div class='col-lg-2'>" + snapshot.val().name + "</div> <div class='col-lg-2'>"+ snapshot.val().destination + "</div><div class='col-lg-2'>"+ snapshot.val().first + "</div><div class='col-lg-2'>"+ snapshot.val().Service + "</div><div class='col-lg-2'>" + snapshot.val().Rate +"</div><div class='col-lg-2'>"+ snapshot.val().total + "</div>");
    $("#results").append(TrainList);
  });
});

