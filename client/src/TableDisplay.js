import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

const columns = [
  { value: 'Name', key: 'ename', isNumeric: false, canSort: true },
  { value: 'Type', key: 'type', isNumeric: false, canSort: false },
  { value: 'Attack', key: 'base.Attack', isNumeric: true, canSort: true },
  { value: 'Defense', key: 'base.Defense', isNumeric: true, canSort: true },
  { value: 'HP', key: 'base.HP', isNumeric: true, canSort: true },
];

const TableDisplay = (props) =>
  <Paper>
    <TextField
      style={{ margin: '16px' }}
      id="table-search"
      label="Search"
      value={props.query}
      onChange={props.setQuery}
    />
    <Table>
      <TableHead>
        <TableRow>
          {
            columns.map(col =>
              <TableCell
                numeric={col.isNumeric}
                key={col.key}
              >
                <TableSortLabel
                  active={col.canSort && props.sortBy === col.key}
                  direction={props.direction.toLowerCase()}
                  onClick={props.toggleSortDirection(col.canSort && col.key)}
                >
                  { col.value }
                </TableSortLabel>
              </TableCell>
            )
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {
          props.pokemons.length > 0 && props.pokemons.map(p =>
            <TableRow key={p.ename}>
              <TableCell>{p.ename}</TableCell>
              <TableCell>{p.type.join('/')}</TableCell>
              <TableCell numeric>{p.base.Attack}</TableCell>
              <TableCell numeric>{p.base.Defense}</TableCell>
              <TableCell numeric>{p.base.HP}</TableCell>
            </TableRow>
          )
        }
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={3}
            rowsPerPage={props.limit}
            count={props.total}
            page={props.page}
            onChangePage={props.setFrom}
            onChangeRowsPerPage={props.setLimit}
          />
        </TableRow>
      </TableFooter>
    </Table>
  </Paper>

export default TableDisplay;
