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
var firstValues; 
  var firstHours;
  var firstMinutes;
  var firstTrain;
  var currentHourrmat;
  var currentMinutes;
  var current;
  var differenceirstTrain;
  var trains;
  var minutesAway;
  var arrivalTime;

var trainList;
var dateAdded; 

function update() {
  database.ref('trains').orderByChild("name").limitToLast(100).on("child_added", function(childSnapshot) {
    firstValues = childSnapshot.val().first.split(':');
    firstHours = firstValues[0];
    firstMinutes = firstValues[1];
    firstTrain = (firstHours * 60) + (firstMinutes*1);
    currentHour = moment().format('H');
    currentMinute = moment().format('mm');
    current = (currentHour * 60) + (currentMinute*1);
    difference = current - firstTrain;
    var frequency = (childSnapshot.val().frequency * 1);
    trains = difference % frequency;
    minutesAway = frequency - trains;
    arrivalTime = moment().add(minutesAway, 'minutes').format('HH:mm');
    console.log(childSnapshot.val().name + " is " + minutesAway + " minutes away and will arrive at " +arrivalTime);
    database.ref('trains').child(childSnapshot.key).update({
        minutesAway: minutesAway,
        nextArrival: arrivalTime
      });
    });
 
};

function setup() {
database.ref('trains').orderByChild("name").limitToLast(100).on("child_added", function(childSnapshot) {

  trainList = $("#results").append(
    "<div class='col-lg-3 newRow'>" + childSnapshot.val().name + 
    "</div> <div class='col-lg-2 newRow'>" + childSnapshot.val().destination + 
    "</div><div class='col-lg-2 newRow'>"+ childSnapshot.val().frequency + 
    "</div><div class='col-lg-2 newRow'>"+ childSnapshot.val().nextArrival + 
    "</div><div class='col-lg-3 newRow'>" + childSnapshot.val().minutesAway +
    "</div>");
  
    $("#results").append(trainList);
  });
}

$(document).on("click", "#form", function(event) {
  event.preventDefault();

  var newTrainName = $("#newTrainName").val().trim();
  var newTrainDestination = $("#newTrainDestination").val().trim();
  var newTrainFirst = $("#newTrainFirst").val().trim();
  var newTrainFrequency = $("#newTrainFrequency").val().trim();

 if ( !newTrainName || !newTrainDestination || !newTrainFirst || !newTrainFrequency ) return;
  firstValues = newTrainFirst.split(':');
  firstHours = firstValues[0];
  firstMinutes = firstValues[1];
  firstTrain = (firstHours * 60) + (firstMinutes*1);
  currentHour = moment().format('H');
  currentMinute = moment().format('mm');
  current = (currentHour * 60) + (currentMinute*1);
  difference = current - firstTrain;
  trains = difference % newTrainFrequency;
  minutesAway = newTrainFrequency - trains;
  arrivalTime = moment().add(minutesAway, 'minutes').format('HH:mm');

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

update();
setup();