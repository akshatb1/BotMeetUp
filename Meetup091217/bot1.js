/**

@Authors: Akshat Bordia (akshat.bordia@citrix.com) and Neha Joshi (neha.joshi@citrix.com)
**/
nlp = window.nlp_compromise;

var messages = [], //array that hold the record of each string in chat
  lastUserMessage = "", //keeps track of the most recent input string from the user
  botMessage = "", //var keeps track of what the chatbot is going to say
  botName = 'Chatbot', //name of the chatbot
  talking = true; //when false the speach function doesn't work
  chatmessage = null;
  response = null;
  action = "";
//add zomato token
 var zomatoApiToke = "";
//add dialogflow token
var dialogflowToken = "";
//edit this function to change what the chatbot says
function chatbotResponse() {
  var url = "https://api.dialogflow.com/v1/query?v=20150910&lang=en&query="+encodeURI(lastUserMessage)+"&sessionId=12345"
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader("Authorization", "Bearer " + dialogflowToken);
  xhttp.send();


  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
        console.log(xhttp.response);
        response = JSON.parse(xhttp.response)["result"]

        botMessage = response["fulfillment"]["speech"]

        console.log(botMessage)
        Speech(botMessage);
    //outputs the last few array elements of messages to html
    //document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];

    var node1 = document.createElement('div');
    node1.className = 'bot';
    node1.innerHTML = botMessage;
    chatmessage.appendChild(node1);
    chatmessage.appendChild(document.createElement('br'));
    chatmessage.appendChild(document.createElement('br'));

    chatmessage.scrollTop = chatmessage.scrollHeight;

    action= response["action"]
    if(action != "")
    {
      console.log(response["action"]);
      callZomato(response)}
    }
  };
  
}

function callZomato(response){
  if(action == "findRest")
  {
    var zomatoCityId = {"Bangalore": "4", "Mumbai": "3", "Delhi": "1", "Kolkata": "2"}
    var xhttp = new XMLHttpRequest();
    var city_id = zomatoCityId[response["parameters"]["areaCity"]]
    var entity_type = "city";
    var area = response["parameters"]["Area"]
    var encodedArea = encodeURI(area);
    var zomato_url = "https://developers.zomato.com/api/v2.1/search?entity_id="+ city_id + "&entity_type=" + entity_type + "&q=" + encodedArea
    //var zomato_url2 = "https://developers.zomato.com/api/v2.1/search?entity_id=4&entity_type=city&q=MG%20Road"
    xhttp.open("GET",zomato_url , true);
    xhttp.setRequestHeader("user-key", zomatoApiToke);
    xhttp.send();
    //var response = JSON.parse(xhttp.responseText.substring(1, xhttp.responseText.length-1));
    var restaurants;
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       var response = JSON.parse(xhttp.response);
       restaurants = response["restaurants"];
        var node2 = document.createElement('div');
        node2.className = 'bot';
        node2.innerHTML = "Here are top 5 restaurants<br/>";  
         chatmessage.appendChild(document.createElement('br'));

        chatmessage.appendChild(node2);
        chatmessage.appendChild(document.createElement('br'));
        chatmessage.appendChild(document.createElement('br'));
         chatmessage.appendChild(document.createElement('br'));

         Speech("Here are the top 5 restaurants");

       for (i=0; i<5; i++)
       {
        
        var node2 = document.createElement('div');
        node2.className = 'bot';
        node2.innerHTML = restaurants[i]["restaurant"]["name"] + "<br/> " + restaurants[i]["restaurant"]["cuisines"] 
        chatmessage.appendChild(node2);
        chatmessage.appendChild(document.createElement('br'));
        chatmessage.appendChild(document.createElement('br'));
        chatmessage.appendChild(document.createElement('br'));
        chatmessage.appendChild(document.createElement('br'));


       }


      chatmessage.appendChild(document.createElement('br'));
      chatmessage.scrollTop = chatmessage.scrollHeight;


    }
  }


//Storing City IDs

  }

}
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//
//
//
//this runs each time enter is pressed.
//It controls the overall input and output
function newEntry() {
  //if the message from the user isn't empty then run 
  if (document.getElementById("chatbox").value != "") {
    //pulls the value from the chatbox ands sets it to lastUserMessage
    lastUserMessage = document.getElementById("chatbox").value;
    //sets the chat box to be clear
    document.getElementById("chatbox").value = "";
    chatmessage = document.getElementById("chatmessage")

    var node = document.createElement('div');
    node.className = 'user';
    node.innerHTML = lastUserMessage;
    //var br = document.createElement('br');

    chatmessage.appendChild(node);
    chatmessage.appendChild(document.createElement('br'));
    chatmessage.appendChild(document.createElement('br'));
     chatmessage.appendChild(document.createElement('br'));


    //adds the value of the chatbox to the array messages
    //messages.push(lastUserMessage);
    //Speech(lastUserMessage);  //says what the user typed outloud
    //sets the variable botMessage in response to lastUserMessage
    chatbotResponse();
    //add the chatbot's name and message to the array messages
    //messages.push("<b>" + botName + ":</b> " + botMessage);
    // says the message using the text to speech function written below

    }
  }


//text to Speech
//https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
function Speech(say) {
  if ('speechSynthesis' in window && talking) {
    var utterance = new SpeechSynthesisUtterance(say);
    //msg.voice = voices[10]; // Note: some voices don't support altering params
    //msg.voiceURI = 'native';
    //utterance.volume = 1; // 0 to 1
    //utterance.rate = 0.1; // 0.1 to 10
    //utterance.pitch = 1; //0 to 2
    //utterance.text = 'Hello World';
    //utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
}

//runs the keypress() function when a key is pressed
document.onkeypress = keyPress;
//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
  var x = e || window.event;
  var key = (x.keyCode || x.which);
  if (key == 13 || key == 3) {
    //runs this function when enter is pressed
    newEntry();
  }
  if (key == 38) {
    console.log('hi')
      //document.getElementById("chatbox").value = lastUserMessage;
  }
}

//clears the placeholder text ion the chatbox
//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
  document.getElementById("chatbox").placeholder = "";
}
