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


var trainList;
var dateAdded; 

console.log(moment());
function setup() {
database.ref('trains').orderByChild("Start").limitToLast(100).on("child_added", function(childSnapshot) {

  trainList = $("#results").append(
    "<div class='col-lg-2'>" + childSnapshot.val().name + 
    "</div> <div class='col-lg-2'>" + childSnapshot.val().destination + 
    "</div><div class='col-lg-2'>"+ childSnapshot.val().frequency + 
    "</div><div class='col-lg-2'>"+ childSnapshot.val().nextArrival + 
    "</div><div class='col-lg-4'>" + childSnapshot.val().minutesAway +
    "</div>");
  
    $("#results").append(trainList);
  })
};

$(document).on("click", "#form", function(event) {
  event.preventDefault();

  var newTrainName = $("#newTrainName").val().trim();
  var newTrainDestination = $("#newTrainDestination").val().trim();
  var newTrainFirst = $("#newTrainFirst").val().trim();
  var newTrainFrequency = $("#newTrainFrequency").val().trim();
  var firstTime = newTrainFirst.split(":");
  var firstHour = firstTime[0];
  var firstMinutes = firstTime[1];
  var firstTrain = 500 + firstMinutes;
  var currentHours = moment().format("H");
  var currentMinutes = moment().format("mm");
  var currentTotal = ((currentHours * 60) + currentMinutes);
  var difference = currentTotal - firstTrain;
  var minutesAway = difference % newTrainFrequency;
  var nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");

console.log(firstTrain);
console.log(currentTotal);
console.log(difference);
console.log(nextArrival);

  database.ref('trains').push({
    name: newTrainName,
    destination: newTrainDestination,
    first: newTrainFirst,
    frequency: newTrainFrequency,
    minutesAway: minutesAway,
    nextArrival: nextArrival,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

$("#newTrainName").val("");
$("#newTrainDestination").val("");
$("#newTrainFirst").val("");
$("#newTrainFrequency").val("");

  database.ref().on("child_added", function(snapshot){
    trainList = $("#results").append(
      "<div class='col-lg-2'>" + snapshot.val().name + 
      "</div> <div class='col-lg-2'>"+ snapshot.val().destination + 
      "</div><div class='col-lg-2'>"+ snapshot.val().frequency + 
      "</div><div class='col-lg-2'>"+ snapshot.val().nextArrival + 
      "</div><div class='col-lg-4'>" + snapshot.val().minutesAway +"</div>"
      );
    
    $("#results").append(trainList);
  });
});

setup();