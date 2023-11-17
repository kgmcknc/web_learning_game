var init_lower_array = "abcdefghijklmnopqrstuvwxyz"
var init_upper_array = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
var game_array = []
var voices
var speech_instance

function initiate_voices(){
   
   if ('speechSynthesis' in window) {
    // Speech Synthesis supported 🎉
   }else{
     // Speech Synthesis Not Supported 😣
     alert("Sorry, your browser doesn't support text to speech!");
     return
   }

   speech_instance = new SpeechSynthesisUtterance();
   speech_instance.volume = 1; // From 0 to 1
   speech_instance.rate = 0.75; // From 0.1 to 10
   speech_instance.pitch = 1; // From 0 to 2
   populateVoiceList();
   if (
     typeof speechSynthesis !== "undefined" &&
     speechSynthesis.onvoiceschanged !== undefined
   ) {
     speechSynthesis.onvoiceschanged = populateVoiceList;
   }
}

function populateVoiceList() {
  if (typeof speechSynthesis === "undefined") {
    return;
  }

  voices = speechSynthesis.getVoices();

  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement("option");
    option.textContent = `${voices[i].name} (${voices[i].lang})`;

    if (voices[i].default) {
      option.textContent += " — DEFAULT";
    }

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    document.getElementById("voiceSelect").appendChild(option);
  }
  
  voice_select = document.getElementById("voiceSelect");
  voice_select.selectedIndex = 4;
  set_voice();
}

//speech_instance.text = "Hello World";
// msg.text = "Como estas Joel";
// msg.lang = 'es';

// speechSynthesis.getVoices().forEach(function(voice) {
  // console.log(voice.name, voice.default ? voice.default :'');
// });

function set_voice(){
   voice_select = document.getElementById("voiceSelect");
   speech_instance.voice = voices[voice_select.selectedIndex]
}

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

async function next_question(){
   var use_lower;
   var use_upper;
   var use_number;
   var number_lower;
   var number_upper;
   use_lower = document.getElementById("use_lower").checked == true;
   use_upper = document.getElementById("use_upper").checked == true;
   use_numbers = document.getElementById("use_numbers").checked == true;
   number_lower = document.getElementById("start_number").value;
   number_upper = document.getElementById("end_number").value;
   question_div = document.getElementById("game_text");
   
   say_answer();
   
   await sleep(1000);
   
   if(game_array.length <= 0){
      game_array = [];
      if(use_lower == true){
         for(var x=0; x<init_lower_array.length; x++){
            game_array.push(init_lower_array[x]);
         }
      }
      if(use_upper == true){
         for(var x=0; x<init_upper_array.length; x++){
            game_array.push(init_upper_array[x]);
         }
      }
      if(use_numbers == true){
         for(var x=number_lower; x<number_upper; x++){
            game_array.push(String(x))
         }
      }
   }
   
   index = Math.floor(Math.random() * game_array.length);
   question_div.innerText = game_array[index];
   game_array.splice(index, 1)
}

function say_answer(){
   speech_instance.text = document.getElementById("game_text").innerText;
   speechSynthesis.speak(speech_instance);
}
initiate_voices();
next_question();

