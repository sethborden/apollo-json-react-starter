const express = require('express');
const { join } = require('path');
const { readFileSync } = require('fs');
const { ApolloServer, gql } = require('apollo-server-express');
const { get, keyBy, set, sortBy } = require('lodash');
const proxy = require('express-http-proxy');

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
  console.log('Proxying requests to dev server!');
  app.use('/', proxy('0.0.0.0:3000', {
    filter: req => req.url !== '/graphql',
  }));
} else {
  app.use(express.static(join(__dirname, '..', 'client', 'build')));
}

/*
 * Setup for everything related to the Apollo Server
 */
const typeDefs = gql`
  type Query {
    pokemon(ename: String): Pokemon
    pokemons(
      query: String,
      from: Int,
      limit: Int,
      sortBy: String,
      direction: String
    ): [Pokemon]
  }

  type Mutation {
    markCollected(ename: String, collected: Boolean): Boolean
  }

  type PageInfo {
    total: Int
  }

  type Pokemon {
    base: PokemonBase
    cname: String
    ename: String
    id: String
    jname: String
    skills: PokemonSkills
    type: [String]
    pageInfo: PageInfo
    collected: Boolean
  }

  type PokemonBase {
    Attack: Int
    Defense: Int
    HP: Int
    Speed: Int
  }

  type PokemonSkills {
    egg: [Int]
    level_up: [Int]
    pre_evolotion: [Int]
    tm: [Int]
    transfer: [Int]
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

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

/*
 * Then make it listen to everything
 */
app.listen({ port: 8000 }, () => {
  console.log(`Server is ready at http://localhost:4000${server.graphqlPath}`);
});
