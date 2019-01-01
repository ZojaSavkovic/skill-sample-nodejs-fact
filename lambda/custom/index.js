/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
var https = require('https');

async function httpsGet(queryPath) {
  return new Promise ( (resolve, reject) => {
    var options = {
        host: 'api.willyweather.com.au',
        path: '/v2/{apikey}' + queryPath,
        method: 'GET',
    };

    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var responseString = "";
        
        //accept incoming data asynchronously
        res.on('data', chunk => {
            responseString = responseString + chunk;
        });
        
        //return the data when streaming is complete
        res.on('end', () => {
            console.log('==> Answering: ' + responseString);
            resolve(responseString);
        });

    });
    req.end();
  })
}

const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Which suburb would you like a forecast for?')
      .getResponse();
  },
};

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'  && request.intent.name === 'GetNewFactIntent';
  },
  async handle(handlerInput) {
    
    //convert spoken place to cityID
    const cityInput = handlerInput.requestEnvelope.request.intent.slots.citySaid.value;
    var locationString = await httpsGet('/search.json?query='+cityInput);
    var locationJSON = JSON.parse(locationString);
    var cityId = locationJSON[0].id;
    console.log("cityID is: " + cityId);
    
    //use cityID to get forecast:
    var todaysDate = new Date().toJSON().slice(0,10);
    var rainForecastString = await httpsGet('/locations/'+cityId+'/weather.json?forecasts=rainfall&days=1&startDate='+todaysDate);
    
    var rainForecastJSON = JSON.parse(rainForecastString);
    var rainForecast = rainForecastJSON.forecasts.rainfall.days[0].entries[0];

    var speechOutput = 'In ' + cityInput + ' there is a ' + rainForecast.probability + ' percent chance of any rain for today. ';
    if (rainForecast.probability != 0){
      speechOutput = speechOutput + 'Thats with a 50 percent chance of ' + (rainForecast.startRange ? rainForecast.startRange : 0 ) + ' millimitres. And a 25 percent chance of ' 
      + rainForecast.endRange + ' millimitres.';
    }

    return handlerInput.responseBuilder
                   .speak(speechOutput)
                   .withSimpleCard(SKILL_NAME, speechOutput)
                   .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'Detailed rain';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a city or suburb, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchHandler,
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
