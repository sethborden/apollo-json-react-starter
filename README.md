# apollo-json-react-starter
Starter kit that uses Apollo Server + JSON for persistence along withe create-react-app and Material UI on the front end.

## Installation
 1. Clone the repo
 2. `cd <repo>/server`
 3. `npm install` (this thing is all setup to use npm, just go with it)
 4. `cd <repo>client`
 5. `npm install`
 6. In separate terminal windows run `npm run watch` for the server and `NODE_ENV=development npm run start` for the client
 
When you load `http://localhost:8000` in your browser you *should* see a list of pokemon that can sorted/searched/etc. This is all being done on the client side from a blob of JSON.  There *should* also be a `gql` button in the top right corner that opens up the graphQL playground where you can play around with queries.

## Repo Setup
<todo>
