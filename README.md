# IT Day 2014 - Forecast App

Web app to demo stock forcasts based on twitter searches.

## Setup

- install node.js (http://nodejs.org/)
- get this source code (github fork, git clone, or download zip)
- open terminal
- cd *this source code*
- npm install
- get twitter credentials (twitter has low api limits -> everyone needs his own twitter credentials)
  - goto *https://apps.twitter.com/app/new*, fill out (callback url not necessary), and create twitter app
  - goto *Keys and Access Tokens* of the newly created app and create access token
  - copy consumer key, consumer secret, access token, and access token secret into *app/backendApp.js* (line 5 till 8)

## Run app
- open terminal
- cd *this source code*
- npm start
- open in browser *http://localhost:3000*

## Improve app
In *public/js/data.js*:

1. update *CLX.prototype.GetTweet* to change tweet search
2. update *self.scanTweet* to interpret tweets differently
