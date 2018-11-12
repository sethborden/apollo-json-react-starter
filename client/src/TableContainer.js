import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';
import TableDisplay from './TableDisplay'
import { debounce } from 'lodash';

export const client = new ApolloClient({
  uri: '/graphql',
});

const tableQuery = gql`
  # This block is where you declare type signatures on your variables
  query Pokemons(
    $from: Int,
    $limit: Int,
    $sortBy: String,
    $direction: String,
    $query: String
  ) {
    # This part is where you pass those variables into the gql query
    pokemons (
      from: $from,
      limit: $limit,
      sortBy: $sortBy,
      direction: $direction,
      query: $query
    ) {
      ename
      type
      base {
        Attack
        Defense
        HP
      }
      pageInfo {
        total
      }
    }
  }
`;

class TableContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      from: 0,
      limit: 10,
      sortBy: 'ename',
      direction: 'asc',
      query: '',
    };
  }

  poolQuery = debounce((event) => {
    this.setState({
      pooledQuery: event.target.value,
    })
  }, 300);

  setQuery = (event) => {
    event.persist();
    this.setState({
      query: event.target.value,
    }, this.poolQuery(event));
  };

  /**
   * Setter function for the number of rows to display
   *
   * @param {Object} event React synthetic event object
   * @returns {void}
   */
  setLimit = (event) => {
    this.setState({
      limit: event.target.value,
      from: 0,
      page: 0,
    });
  }

  /**
   * Setter function for the current page
   *
   * @param {Object} event React synthetic event object
   * @param {Number} page 0-based index of the current page
   * @returns {void}
   */
  setFrom = (event, page) => {
    const from = this.state.limit * page;
    this.setState({
      page,
      from,
    });
  }

  /**
   * Utility function to toggle the sort direction of our columns
   *
   * @param {String} column Key value of the column to sort by
   * @returns {void}
   */
  toggleSortDirection = (column) => (event) => {
    this.setState((prevState) => {
      let newDirection = prevState.direction;
      if (column === this.state.sortBy) {
        newDirection = prevState.direction === 'asc' ?
          'desc' :
          'asc';
      }

      return {
        direction: newDirection,
        sortBy: Boolean(column) && column,
      };
    });
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Query
          query={tableQuery}
          variables={{
            from: this.state.from,
            limit: this.state.limit,
            sortBy: this.state.sortBy,
            direction: this.state.direction,
            query: this.state.pooledQuery,
          }}
        >
          {
            ({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error...</p>;
              return (
                <TableDisplay
                  pokemons={data.pokemons}
                  from={this.state.from}
                  page={this.state.page}
                  limit={this.state.limit}
                  sortBy={this.state.sortBy}
                  direction={this.state.direction}
                  toggleSortDirection={this.toggleSortDirection}
                  setFrom={this.setFrom}
                  setLimit={this.setLimit}
                  total={data.pokemons[0].pageInfo.total}
                  query={this.state.query}
                  setQuery={this.setQuery}
                />
              );
            }
          }
        </Query>
      </ApolloProvider>
    );
  }
}

export default TableContainer;
