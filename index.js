// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';


//carousel
// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
  dialogflow,
  BasicCard,
  BrowseCarousel,
  BrowseCarouselItem,
  LinkOutSuggestion,
  Permission,
  Suggestions,
  Carousel,
  Image,


  
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
const i18n = require('i18n');

//configure the i18n-node with your supported locales:
i18n.configure({
  locales: ['en-IN', 'hi-IN'],
  directory: __dirname + '/locales',
  defaultLocale: 'en-IN'
});
// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});
//Set the locale for the libraries using conv.user.locale from the client library property.
app.middleware((conv) => {
  i18n.setLocale(conv.user.locale);

});
//
//Basic card for no screen
//

// Define a mapping of fake color strings to basic card objects.
const colorMap = {
  'Get Live Price Quotes': {
    title: 'Get Live Crop Price Quotes',
    text: 'This option will redirect you to Get Live Crop Price Quotes ,for this you need a display',
    image: {
      url: 'https://drive.google.com/uc?id=1435gF2NS6SUTkR7p9_W46ChaWeRQYL5K',
      accessibilityText: 'Get Live Crop Prices',
    },
    display: 'WHITE',
  },
  'Get Future Crop Prices': {
    title: 'Get Future Crop Prices',
    text: 'This option will redirect you to Get Future Crop Prices ,for this you need a display',
    image: {
      url: 'https://drive.google.com/uc?id=1435gF2NS6SUTkR7p9_W46ChaWeRQYL5K',
      accessibilityText: 'Get Future Crop Prices',
    },
    display: 'WHITE',
  },
  'Go to ecommerce site': {
    title: 'Go to ecommerce site',
    text: 'This option will redirect you to the ecommerce site ,for this you need a display',
    image: {
      url: 'https://drive.google.com/uc?id=1435gF2NS6SUTkR7p9_W46ChaWeRQYL5K',
      accessibilityText: 'Go to the ecommerce site',
    },
    display: 'WHITE',
  },
  'Get recommendations': {
    title: 'Get recommendations',
    text: 'This option will redirect you to the recommendations ,for this you need a display',
    image: {
      url: 'https://drive.google.com/uc?id=1435gF2NS6SUTkR7p9_W46ChaWeRQYL5K',
      accessibilityText: 'Get recommendations',
    },
    display: 'WHITE',
  },
};
//end Basic card for no screen

//
//BrowseCarousel
//
const fakeColorCarousel = () => {
  const carousel = new BrowseCarousel({
  items: [
    new BrowseCarouselItem({
      title: 'Live Prices(लाइव मूल्य)',
      url: 'https://ncdex.com/MarketData/LiveSpotQuotes.aspx#',
      description: 'Get live Crop price prediction(लाइव फसल मूल्य भविष्यवाणी प्राप्त करें)',
      image: new Image({
        url: 'https://drive.google.com/uc?id=1435gF2NS6SUTkR7p9_W46ChaWeRQYL5K',
        alt: 'Live Prices(लाइव मूल्य)',
      }),
      footer: 'Live Prices(लाइव मूल्य)',
    }),
    new BrowseCarouselItem({
      title: 'Future Prices(भविष्य की कीमतें)',
      url: 'https://ncdex.com/MarketData/LiveFuturesQuotes.aspx',
      description: 'Get Future Crop price prediction(भविष्य की फसल की भविष्यवाणी प्राप्त करें)',
      image: new Image({
        url: 'https://drive.google.com/uc?id=1435gF2NS6SUTkR7p9_W46ChaWeRQYL5K',
        alt: 'Future Prices(भविष्य की कीमतें)',
      }),
      footer: 'Future Prices(भविष्य की कीमतें)',
    }),
    new BrowseCarouselItem({
      title: 'E-Commerce(ई-कॉमर्स)',
      url: 'https://play.google.com/store/apps/details?id=com.sneha.smartagro',
      description: 'Buy or Sell crops online(ऑनलाइन फसल खरीदें या बेचें)',
      image: new Image({
        url: 'https://drive.google.com/uc?id=1435gF2NS6SUTkR7p9_W46ChaWeRQYL5K',
        alt: 'E-Commerce(ई-कॉमर्स)',
      }),
      footer: 'E-Commerce(ई-कॉमर्स)',
    }),
    new BrowseCarouselItem({
      title: 'Recommendations(अनुशंसाएँ)',
      url: 'https://colab.research.google.com/drive/16QrhZrghPlHTKe1B4vkmHBOq-cvIX158#scrollTo=Dvo8I1BALA4E',
      description: 'Checkout our recommendation systems for farmers(किसानों के लिए हमारी सिफारिश प्रणाली प्राप्त करें)',
      image: new Image({
        url: 'https://drive.google.com/uc?id=1435gF2NS6SUTkR7p9_W46ChaWeRQYL5K',
        alt: 'Get Recommendations(अनुशंसाएँ)',
      }),
      footer: 'Recommendations(अनुशंसाएँ)',
    }),
  ],
});
 return carousel;
};
//end BrowseCarousel

//-------------
//intent handlers
//---------------

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
 const name = conv.user.storage.userName;
 if (!name) {
   // Asks the user's permission to know their name, for personalization.
   conv.ask(new Permission({
     context: 'Hi there, to get to know you better',
     permissions: 'NAME',
   }));
 } else {
   conv.ask(`Hi again, ${name}. Please select your crop from suggestions:`);
   conv.ask(new Suggestions('Kharif(खरीफ)', 'Rabbi(रबी)'));
 }
});

app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    // If the user denied our request, go ahead with the conversation.
    conv.ask(`OK, no issue mate! Please select your crop from suggestions:`);
    conv.ask(new Suggestions('Kharif(खरीफ)', 'Rabbi(रबी)'));
  } else {
    // If the user accepted our request, store their name in
    // the 'conv.user.storage' object for the duration of the conversation.
    conv.user.storage.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.user.storage.userName}. Please select your crop from suggestions:`);
    conv.ask(new Suggestions('Kharif(खरीफ)', 'Rabbi(रबी)'));
  }
});

// Handle the Dialogflow NO_INPUT intent.
// Triggered when the user doesn't provide input to the Action
app.intent('actions_intent_NO_INPUT', (conv) => {
  // Use the number of reprompts to vary response
  const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
  if (repromptCount === 0) {
    conv.ask('Which crop would you like to hear about?');
  } else if (repromptCount === 1) {
    conv.ask(`Please state the type of crop you're interested in!`);
    conv.ask(new Suggestions('Kharif', 'Rabbi'));
  } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
    conv.close(`Sorry we're having trouble. Let's ` +
      `try this again later. Goodbye.`);
  }
});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('favorite color', (conv, {subject}) => {
  const userSubject = subject;
  const audioSound = 'https://actions.google.com/sounds/v1/water/pour_into_metal_bucket.ogg';
  if (conv.user.storage.userName) {
    // If we collected user name previously, address them by name and use SSML
    // to embed an audio snippet in the response.
    conv.ask(`<speak>${conv.user.storage.userName}, your crop is ` +
      `${userSubject}.<audio src="${audioSound}"></audio> ` +
      `Would you like to hear about various options for your crop?</speak>`);
    conv.ask(new Suggestions('Yes(हाँ)', 'No(नहीं)'));
    //conv.ask(new Suggestions('Python', 'R', 'C Programming', 'Java','VB.Net','C++','Javascript'));
  } else {
    conv.ask(`<speak>your crop is ${userSubject}.` +
      `<audio src="${audioSound}"></audio> ` +
      `Would you like to hear about various options for your crop?</speak>`);
    conv.ask(new Suggestions('Yes(हाँ)', 'No(नहीं)'));
  }
});
// Handle the Dialogflow intent named 'favorite color - yes' and favourite fake color-yes
app.intent(['favorite color - yes','favorite fake color - yes'], (conv) => {

 conv.ask('Please select & tap on your preferred option below:');

  
 // If the user is using a screened device, display the carousel
 if (conv.screen) return conv.ask(fakeColorCarousel());
});


// Handle the Dialogflow intent named 'favorite fake color'.
// The intent collects a parameter named 'fakeColor'.
app.intent('favorite fake color', (conv, {fakeColor}) => {
  fakeColor = conv.arguments.get('OPTION') || fakeColor;
  // Present user with the corresponding basic card and end the conversation.
  if (!conv.screen) {
    conv.ask(colorMap[fakeColor].text);
  } else {
    conv.ask(`Here you go.`, new BasicCard(colorMap[fakeColor]));
  }
  conv.ask('Do you want to see the options again?');
  conv.ask(new Suggestions('Yes(हाँ)', 'No(नहीं)'));
});
//
//end of index-return onRequest
//

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
