
var https = require('https')

exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        //console.log(`LAUNCH REQUEST`)
        console.log("Custom log, if you see this, it means it is in launch request case")
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Namaskara Bengaluru. Welcome to the bot developers meetup. I can help you find good restaurants if you are bored of the meetup", false),
            {}
          )
        )
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)
        var endpoint = "api.dialogflow.com"
        switch(event.request.intent.name) {
          case "Findrestaurants":
          
          var path1 = "/v1/query?v=20150910&lang=en&query="+encodeURI("Please find some restaurants in " + event.request.intent.slots.cityslot.value)+"&sessionId=12345"
            var options = {
             host: endpoint,
            path: path1,
            method: 'GET',
        headers: {
          "Authorization": 'Bearer 7de585ea37764c8eafb48fc3ad6991a6'
      }
    };
            var botMessage = ""
            var body = ""
            https.get(options, (response) => {
              response.on('data', (chunk) => { body += chunk })
              response.on('end', () => {
              
            console.log("This is a custom log in find restaurant section, means some good news")
          
       var data = JSON.parse(body)["result"]
        console.log(data)
        botMessage = data["fulfillment"]["speech"]

        console.log(botMessage)
              context.succeed(
              generateResponse(
                 buildSpeechletResponse(botMessage, false),
                 
            {}
          )
        )  
          
      })
        })
      
            break;

        case "AreaIsMgRoad":
          var path1 = "/v1/query?v=20150910&lang=en&query="+encodeURI("The area is " + event.request.intent.slots.areaslot.value)+"&sessionId=12345"

          var options = {
             host: endpoint,
            path: path1,
            method: 'GET',
        headers: {
          "Authorization": 'Bearer 7de585ea37764c8eafb48fc3ad6991a6'
      }
    };
            var botMessage = ""
            console.log("This is a custom log in find restaurant section, means some good news")
            var body1 = ""
            https.get(options, (response) => {
              response.on('data', (chunk) => { body1 += chunk })
              response.on('end', () => {
              
            var data  = JSON.parse(body1)["result"]
            console.log(data)
        botMessage = data["fulfillment"]["speech"]
        if(data["action"] == "findRest")
        {
              var zomatoCityId = {"Bangalore": "4", "Mumbai": "3", "Delhi": "1", "Kolkata": "2"}
          
    var city_id = zomatoCityId[data["parameters"]["areaCity"]]
    var entity_type = "city";
    var area = data["parameters"]["Area"]
    var encodedArea = encodeURI(area);
    //var zomato_url = "https://developers.zomato.com
    //var zomato_url2 = "https://developers.zomato.com/api/v2.1/search?entity_id=4&entity_type=city&q=MG%20Road"
    var body = ""
    var options1 = {
      host: "developers.zomato.com",
            path: "/api/v2.1/search?entity_id="+ city_id + "&entity_type=" + entity_type + "&q=" + encodedArea,
            method: 'GET',
        headers: {
          "user-key": "1ef15fec260d6ff41776d0294867d8d1"
      }
    };
    https.get(options1, (response) => {
              response.on('data', (chunk) => { body += chunk })
              response.on('end', () => {

       var data = JSON.parse(body);
       var res = "Here are the top three restaurants "
       restaurants = data["restaurants"];
       for(i=0 ; i< 3; i ++){
         res += (i+1) + " , " + restaurants[i]["restaurant"]["name"] + " serving " + restaurants[i]["restaurant"]["cuisines"] + " . "
       }
       
               console.log(res)
              context.succeed(
              generateResponse(
                 buildSpeechletResponse(res, true),
                 
            {}
          )
        )  

        })


          
      })
        }
        })
        })
        
            break;


          default:
            throw "Invalid intent"
        }

        break;


      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}
