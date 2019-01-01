# Build An Alexa Fact Skill - Number Facts

To use:
Say "ask dynamic number facts for a fact about 8", and this will query a the public API numbersapi.com with the number, and say a sentence in return.

To set up:
* in the Amazon Developer Console: Paste the json in the models folder in to the Intents JSON Editor.
* in AWS Lambda: Use the node JS SDK, in the Serverless Application Repository. Then replace index.js with the one in the lambda folder here.