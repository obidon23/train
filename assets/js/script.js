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
    "<div class='col-lg-3 newRow'>" + childSnapshot.val().name + 
    "</div> <div class='col-lg-2 newRow'>" + childSnapshot.val().destination + 
    "</div><div class='col-lg-2 newRow'>"+ childSnapshot.val().frequency + 
    "</div><div class='col-lg-2 newRow'>"+ childSnapshot.val().nextArrival + 
    "</div><div class='col-lg-3 newRow'>" + childSnapshot.val().minutesAway +
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

 if ( !newTrainName || !newTrainDestination || !newTrainFirst || !newTrainFrequency ) return;
  var firstValues = newTrainFirst.split(':');
  var firstHours = firstValues[0];
  var firstMinutes = firstValues[1];
  var firstTrain = (firstHours * 60) + firstMinutes;
  var currentHour = moment().format('H');
  var currentMinute = moment().format('mm');
  var current = (currentHour * 60) + currentMinute;
  var difference = current - firstTrain;
  var trains = difference % newTrainFrequency;
  var minutesAway = newTrainFrequency - trains;
  var arrivalTime = moment().add(minutesAway, 'minutes').format('HH:mm');

  database.ref('trains').push({
    name: newTrainName,
    destination: newTrainDestination,
    first: newTrainFirst,
    frequency: newTrainFrequency,
    minutesAway: minutesAway,
    nextArrival: arrivalTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

$("#newTrainName").val("");
$("#newTrainDestination").val("");
$("#newTrainFirst").val("");
$("#newTrainFrequency").val("");

  database.ref().on("child_added", function(snapshot){
    trainList = $("#results").append(
      "<div class='col-lg-3 newRow'>" + snapshot.val().name + 
      "</div> <div class='col-lg-2 newRow'>"+ snapshot.val().destination + 
      "</div><div class='col-lg-2 newRow'>"+ snapshot.val().frequency + 
      "</div><div class='col-lg-2 newRow'>"+ snapshot.val().nextArrival + 
      "</div><div class='col-lg-3 newRow'>" + snapshot.val().minutesAway +"</div>"
      );
    
    $("#results").append(trainList);
  });
});

setup();