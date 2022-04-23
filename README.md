# Auth0-pizza42

This repository hosts the code written by Anushrav Vatsa for a technical exercise.
The application leverages Auth0's Identity Platform and web APIs. It was built with React and Express frameworks using [Auth0's React Sampel SPA](https://github.com/auth0-samples/auth0-react-samples/tree/master/Sample-01).

Live demo hosted at: https://pizza42-demo-app.herokuapp.com/

## Pre-requisites to run this code:

1. An Auth0 Tenant [Sign Up here](https://auth0.com/signup)
2. NPM ( use `brew install node` for mac)

# Local Setup Instructions

## Config

1.  Clone this repository, jump into the root folder, creater `.env` file and install dependencies.
```
git init
git clone gh repo clone https://github.com/anushrav/Auth0-pizza42.git
cd Auth0-pizza42
touch .env
npm install
```
2. In your Auth0 Tenant create a Single Page Application (SPA) and an API. Copy the credentials generated to populate `auth_config.jason`.

```
{
  "domain": "{Auth0 Domain}",
  "clientId": "{SPA ClientID}",
  "audience": "{Odering API Indeitfier}",
  "appOrigin": "{Origin for your App}",
  "apiOrigin": "{Origin for your API}" 
}
```
3. Create Machine2Machie (M2M) for the backend. Copy the credentials generated to populate `.env`
```
AUTH0_DOMAIN='{Auth0 Domain}'
MGMT_API_AUDIENCE='{Auth0 Management API Identifier}'
API_CLIENTID='{CLienID for M2M App}'
API_SECRET='{Client Secret for M2M App}'
```

4. Now you are ready to run this app by using `npm start`. 

This should launch the app at `https://localhost:3000` with the API listening at `https://localhost:3001`

5. Try to order some delicous pizza from the Pizza42 sotre.

## Reffernces:
1. [Auth0's React Sampel SPA](https://github.com/auth0-samples/auth0-react-samples/tree/master/Sample-01)
2. [Auth0 React SDK](https://github.com/auth0/auth0-react)
3. [Auth0 Documentation](https://auth0.com/docs/)
4. [Express Boilerplate App](https://github.com/hagopj13/node-express-boilerplate) by [Hagop Jamkojian](https://github.com/hagopj13)
5. [Deploy your first Heroku app](https://www.youtube.com/watch?v=MxfxiR8TVNU&ab_channel=JonnyKalambay) by [Jonny Kalambay](https://www.youtube.com/watch?v=MxfxiR8TVNU&ab_channel=JonnyKalambay)
6. [Heroku Docs for Deploying with Git](https://devcenter.heroku.com/articles/git)




