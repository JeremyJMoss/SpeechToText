const notesArray = localStorage.getItem("notes")
  ? JSON.parse(localStorage.getItem("notes"))
  : [];
const form = document.getElementById("notes");
const clear = document.getElementById("clear");
const note = document.getElementById("note");
const notesResults = document.getElementById("notesResults");
const recBtn = document.getElementById("rec");
//Database

const updateNotes = function () {
  let html = ``;
  notesArray.forEach((n) => {
    html += `<div class="card">
        <div class="card-body">
          <p class="mb-0">${n.notes}</p>
          <p class="mb-0 float-end text-secondary fs-6">
            ${n.date}
          </p>
        </div>
      </div>`;
  });
  notesResults.innerHTML = html;
};

updateNotes();

const addNotes = function (e) {
  e.preventDefault();
  const newNote = {
    notes: note.value,
    date: new Date(),
  };
  notesArray.push(newNote);

  //localStorage

  localStorage.setItem("notes", JSON.stringify(notesArray));

  updateNotes();
  note.value = "";
};

form.addEventListener("submit", addNotes);
clear.addEventListener("click", (e) => {
  e.preventDefault();
  note.value = "";
  note.focus();
});

//speech

try {
  var speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new speechRecognition();
} catch (error) {
  console.log(error);
  document.getElementsByClassName("no-browser-support").style.display = "block";
}

const instructions = document.getElementsByClassName("recording-instructions");

let noteContent = "";

recognition.continuous = true;
recognition.onresult = function (event) {
  let current = event.resultIndex;
  console.log(event);
  let transcript = event.results[current][0].transcript;
  let mobileRepeatBug =
    current == 1 && transcript == event.results[0][0].transcript;
  if (mobileRepeatBug) {
    noteContent += transcript;
    note.value = noteContent;
  }
};

recognition.onstart = function () {
  noteContent = "";
  instructions.innerHTML =
    "Voice recognition activated. Try speaking into the microphone";
};

recognition.onspeechend = function () {
  instructions.innerHTML =
    "You were quiet for a while so voice recognition was deactivated.";
};

recognition.onerror = function (event) {
  if (event.error == "no-speech") {
    instructions.innerHTML = "No speech was detected. Try again.";
  }
};

recBtn.addEventListener("click", function () {
  recognition.start();
});
