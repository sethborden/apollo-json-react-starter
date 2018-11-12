import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import TableContainer from './TableContainer';

const styles = {
  root: {
    flexGrow: 1,
  },
  toolbar: {
    justifyContent: 'space-between',
  }
}

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar style={styles.toolbar}>
            <span>Pokemon (with Chinese characteristics)</span>
            {
              process.env.NODE_ENV === 'development' &&
              <Button
                href="/graphql"
                variant="fab"
                mini
              >
                gQL
              </Button>
            }
          </Toolbar>
        </AppBar>
        <TableContainer />
      </div>
    );
  }
}

export default withStyles(styles)(App);
