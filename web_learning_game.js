var init_lower_array = "abcdefghijklmnopqrstuvwxyz"
var init_upper_array = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
var game_array = []
var voices
var speech_instance
var current_text = ""
var total_answers = 0
var correct_answers = 0
var wrong_answer = 0
var done_array = []

function change_game(){
   game_select = document.getElementById("game_select")
   if(game_select.value == "flash_cards"){
      flash_cards = document.getElementById("flash_card")
      flash_cards.style.display = "block"
      choice_game = document.getElementById("choice_game")
      choice_game.style.display = "none"
   }
   if(game_select.value == "choice_game"){
      flash_cards = document.getElementById("flash_card")
      flash_cards.style.display = "none"
      choice_game = document.getElementById("choice_game")
      choice_game.style.display = "block"
   }
   init_game()
}

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

function init_game(){
   var use_lower;
   var use_upper;
   var use_numbers;
   var number_lower;
   var number_upper;
   use_lower = document.getElementById("use_lower").checked == true;
   use_upper = document.getElementById("use_upper").checked == true;
   use_numbers = document.getElementById("use_numbers").checked == true;
   number_lower = document.getElementById("start_number").value;
   number_upper = document.getElementById("end_number").value;
   game_sounds = document.getElementById("use_voice").checked == true;
   
   game_array = [];
   done_array = [];
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
   if(game_array.length == 0){
      game_array.push("Please Select Game Options!")
   }
   total_answers = game_array.length
   correct_answers = 0
   wrong_answer = 0
   set_game_text()
   game_select = document.getElementById("game_select")
   if(game_select.value == "choice_game"){
      if(game_sounds == true){
         say_answer();
      }
   }
}

function set_game_text(){
   index = Math.floor(Math.random() * game_array.length);
   current_text = game_array[index] 
   game_array.splice(index, 1)

   question_div = document.getElementById("game_text");
   question_div.innerText = current_text;

   correct_option = Math.floor(Math.random() * 3);
   if(correct_option == 0){
      correct_div = document.getElementById("choice1");
      other1_div = document.getElementById("choice2");
      other2_div = document.getElementById("choice3");
   }
   if(correct_option == 1){
      correct_div = document.getElementById("choice2");
      other1_div = document.getElementById("choice3");
      other2_div = document.getElementById("choice1");
   }
   if(correct_option == 2){
      correct_div = document.getElementById("choice3");
      other1_div = document.getElementById("choice1");
      other2_div = document.getElementById("choice2");
   }

   correct_div.style.backgroundColor = ""
   other1_div.style.backgroundColor = ""
   other2_div.style.backgroundColor = ""

   correct_div.innerText = current_text;
   if(game_array.length < 3){
      index = Math.floor(Math.random() * done_array.length);
      other1_div.innerText = done_array[index]
      index1 = Math.floor(Math.random() * done_array.length);
      while((index == index1) && (done_array.length > 1)){
         index1 = Math.floor(Math.random() * done_array.length);
      }
      other2_div.innerText = done_array[index1]
   } else {
      index = Math.floor(Math.random() * game_array.length);
      other1_div.innerText = game_array[index]
      index1 = Math.floor(Math.random() * game_array.length);
      while((index == index1) && (game_array.length > 1)){
         index1 = Math.floor(Math.random() * game_array.length);
      }
      other2_div.innerText = game_array[index1]
   }
}

async function next_question(){
   game_sounds = document.getElementById("use_voice").checked == true;
   
   if(window.speechSynthesis.speaking){
      return
   }

   game_select = document.getElementById("game_select")
   if(game_select.value == "flash_cards"){
      if(game_sounds == true){
         await say_answer();
      }
   }
   
   if(game_array.length <= 0 && total_answers > 0){
      end_text = "You Scored: " + correct_answers + " of " + total_answers + "!"
      alert(end_text)
      init_game();
   } else {
      done_array.push(current_text)
      set_game_text(game_array[index])
   }

   if(game_select.value == "choice_game"){
      if(game_sounds == true){
         say_answer();
      }
   }
}

function check_answer(div_id){
   selected_div = document.getElementById(div_id)
   if(selected_div.innerText == current_text){
      selected_div.style.backgroundColor = "green"
      if(wrong_answer == 0){
         correct_answers = correct_answers + 1
      }
      next_question();
      wrong_answer = 0
   } else {
      selected_div.style.backgroundColor = "red"
      wrong_answer = 1
   }
}

async function say_answer(){
   if(window.speechSynthesis.speaking){
      return
   }
   if(current_text != ""){
      speech_instance.text = current_text;
      window.speechSynthesis.speak(speech_instance);
      await sleep(1000);
   }
}
initiate_voices();
init_game();

