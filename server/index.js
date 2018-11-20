const express = require('express');
const { join } = require('path');
const { readFileSync } = require('fs');
const { ApolloServer, gql } = require('apollo-server-express');
const { get, keyBy, set, sortBy } = require('lodash');
const proxy = require('express-http-proxy');
const WebSocket = require('ws');
const http = require('http');

/*
 * JSON Database Setup...this is great for prototyping, but probably not great for anything bigger
 * than a few MB of data.
 */
const db = keyBy(JSON.parse(readFileSync(join(__dirname, 'data', 'pokedex.json'))), i => i.ename.toLowerCase());

/*
 * Setup for everything related to express. Static content, loggin, etc.
 */
const app = express();


/*
 * Setup a proxy to the webpack dev server if you set NODE_ENV to "development"
 */
if (process.env.NODE_ENV === 'development') {
  app.use('/', proxy('0.0.0.0:3000', {
    filter: req => {
      return ['/graphql', '/chat'].indexOf(req.url) === -1;
    },
  }));
} else {
  app.use('/', express.static(join(__dirname, '..', 'client', 'build')));
}

/*
 * Setup for everything related to the Apollo Server
 */
const typeDefs = gql`
  type Query {
    pokemon(ename: String): Pokemon
    pokemons(
      """
      Case insensitive search by name
      """
      query: String,

      """
      Cursor style offset
      """
      from: Int,  

      """
      Max number of results to return
      """
      limit: Int,

      """
      Attribute on which to sort by
      """
      sortBy: String,

      """
      Ascending or descending sort ofder
      """
      direction: String
    ): [Pokemon]
  }

  type Mutation {
    markCollected(ename: String, collected: Boolean): Boolean
  }

  type PageInfo {
    """
    Total number of Pokemon in the query set
    """
    total: Int
  }

  type Pokemon {
    """
    Pokemon base characteristics
    """
    base: PokemonBase
    """
    Chinese language name of the Pokemon
    """
    cname: String
    """
    English language name of the Pokemon
    """
    ename: String
    """
    Unique ID of the pokemon
    """
    id: String
    """
    Japanese language name of the pokemon
    """
    jname: String
    """
    Description of the Pokemon's skills
    """
    skills: PokemonSkills
    """
    Chinse characters representing the Pokemon's type
    """
    type: [String]
    """
    Information about the current page
    """
    pageInfo: PageInfo
    """
    Whether or not this Pokemon has been collected
    """
    collected: Boolean
  }

  type PokemonBase {
    """
    Base attack power
    """
    Attack: Int
    """
    Base defnese power
    """
    Defense: Int
    """
    Base hit points
    """
    HP: Int
    """
    Base speed
    """
    Speed: Int
  }

  type PokemonSkills {
    """
    Skill break points for the egg
    """
    egg: [Int]
    """
    Skill break points for leveling up
    """
    level_up: [Int]
    """
    Skill break points for pre-evolution
    """
    pre_evolotion: [Int]
    """
    Skill break points for tm
    """
    tm: [Int]
    """
    Skill break points for transer
    """
    transfer: [Int]
    """
    Skill break points for tutor
    """
    tutor: [Int]
  }
`;

const resolvers = {
  Query: {
    pokemon: (root, args) => db[args.ename],
    pokemons: (root, args) => {
      const query = args.query || null;
      const sort = args.sortBy || 'ename';
      const from = args.from || 0;
      const limit = args.limit || Object.values(db).length;
      let data = sortBy(Object.values(db), sort);
      if (query) {
        // Always search on ename
        data = data.filter(d => d.ename.toLowerCase().indexOf(args.query.toLowerCase()) > -1);
      }
      if (args.direction !== 'asc') {
        data = data.reverse();
      }
      data = data.slice(from, from + limit).map(d => Object.assign(d, { pageInfo: { total: data.length }}));
      return data;
    }
  },

  Mutation: {
    markCollected: (root, args) => {
      const name = args.ename.toLowerCase();
      set(db[name], 'collected', args.collected);
      return get(db, `${name}.collected`);
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.applyMiddleware({ app });

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState == WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

/*
 * Then make it listen to everything
 */
server.listen({ port: 8000 }, () => {
  console.log(`Server is ready at http://localhost:8000${apolloServer.graphqlPath}`);
});


