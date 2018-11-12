# apollo-json-react-starter
Starter kit that uses Apollo Server + JSON for persistence along withe create-react-app and Material UI on the front end.

# Installation
 1. Clone the repo
 2. `cd <repo>/server`
 3. `npm install` (this thing is all setup to use npm, just go with it)
 4. `cd <repo>client`
 5. `npm install`
 6. In separate terminal windows run `npm run watch` for the server and `NODE_ENV=development npm run start` for the client
 
When you load `http://localhost:8000` in your browser you *should* see a list of pokemon that can sorted/searched/etc. This is all being done on the client side from a blob of JSON.  There *should* also be a `gql` button in the top right corner that opens up the graphQL playground where you can play around with queries.

# Explanation

This repo is split into two big parts, `client` which is based off the [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) starter kit and `server` which is simply [express](https://expressjs.com/) with the [Apollo Server](https://www.apollographql.com/docs/apollo-server/) wrapped into it.  In development mode the server proxies all requests that **aren't** to the `/graphql` endpoint to the webpack dev server that is started with the `npm run start` command.

The datastore backing everything is a big JSON blob that's read into memory when the server starts up -- probably would be more performant to use a redis store or something...but that's a premature optimization.

## Understanding how Apollo/graphQL works on the **back** end

With GraphQL you describe the parts of a data structure that you want.  Apollo does a bunch of behind the scenes magic to convert JS objects into a GraphQL type, the key parts to understand this are the `typeDefs` and the `resolvers` sections.  The former tells Apollo **what** we're retrieving and the latter tells Apollo **how** to retrieve it.  Notice that in the `Query` section of the `typeDefs` we're defining a number of parameters for each query -- those are are passed into the `resolver` in as the `args` argument that you can then use to write code that returns an array of Objects that are "shaped" like the type your query claims to resolve.

In our case this means that, given a bunch of criteria, we return a filtered and sorted collection of Pokemon.

## Understanding how Apollo/graphQL works on the **front** end

On the front end, we're using [material-ui](https://material-ui.com/) to build the UI along with [Apollo Client](https://www.apollographql.com/docs/react/) -- the main components that we care about from Apollo Client are `Query`, `Mutation`, and `graphql-tag`.  These three together make it **super** easy to sync up data between the front end and the back end.  See `TableContainer.js` and `TableDisplay.js` to undertstand how the UI updates the props that are passed to the `Query` component in `TableContainer.js` that, in turn, update the table as we change sort order, update the search, and page through things.

