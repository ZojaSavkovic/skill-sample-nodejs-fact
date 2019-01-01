# Build An Alexa Fact Skill - Detailed Rain Forecast

To use:
Say “Alexa ask detailed rain for {city}" where {city} is an Australian suburb or city.

Response will be something like:
“In {city}, there is a 80% percent chance of any rain for today..
That's with a 50 percent chance of 5 millimitres. And a 25 percent chance of 1 millimitres.”

To set up:
* Get an API key from Willy Weather. Paste it in to the index.js instead of {apikey}.
* in the Amazon Developer Console: Paste the json in the models folder in to the Intents JSON Editor.
* in AWS Lambda: Use the node JS SDK, in the Serverless Application Repository. Then replace index.js with the one in the lambda folder here.