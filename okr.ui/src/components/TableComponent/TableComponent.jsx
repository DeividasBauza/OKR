import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from "prop-types";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton'
import { predicateBy } from './sortUtils'
import './table.scss'

const TableComponent = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage);
  const [rows, setRows] = useState([...props.rows]);
  const [order, setOrder] = useState('')
  const [sortedBy, setSortedBy] = useState('');
  const width = 100 / props.columns.length.toFixed();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const handleOrder = () => {
      if (order === '') {
        setRows([...props.rows])
        setSortedBy('');
      }
      else {
        const toSort = [...props.rows];
        setRows([...toSort.sort(predicateBy(sortedBy, order))]);
        setSortedBy(sortedBy);
      }
    }
    handleOrder(order);
  }, [order, sortedBy])

  useEffect(()=>{
     setRows([...props.rows]);
  },[props.rows])

  const sortRows = (column) => {
    if (column !== sortedBy) {
      setOrder('asc');
      setSortedBy(column);
    } else {
      setSortedBy(column);
      setOrder(order === '' ? 'asc' : order === 'asc' ? 'desc' : '');
    }
  }

  const renderTableCell = (column, value) => {
    switch (column.type) {
      case "number":
        return value;
      case "date":
        return value === null ? 'No checkins' : new Date(value).toLocaleString('en-US');
      default:
        return value;
    }
  }

  return (
    <>
      <div id="table-label" style={{ textAlign: "left" }}>
        <h1>{props.header}</h1>
      </div>
      <TableContainer className="table-container">
        <Table stickyHeader aria-label="sticky table" className="table">
          <TableHead>
            <TableRow>
              {props.columns.map((column, index) => (
                <TableCell className="table-head-cell" style={{ width: `${width}%` }}
                  key={column.id}
                >
                  <span style={{ cursor: "pointer" }} className={`${props.columns.length - 1 === index ? 'reverse' : ''}`}
                    onClick={() => { sortRows(column.id) }}>
                    {column.label}
                    <span className={sortedBy === column.id ? '' : 'hidden'}>
                      <IconButton className="icon-button">
                        {order === 'asc' ? <ExpandMoreIcon />
                          : order === 'dec' ? <ExpandLessIcon /> : <ExpandLessIcon />}
                      </IconButton>
                    </span>
                  </span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                  {props.columns.map((column, columnIndex) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={`${column.id}-cell-${columnIndex}`} className="table-cell" style={{ width: `${width}%` }}>
                        {renderTableCell(column, value)}{column.postfix}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={props.rowsPerPageOptions}
          component="div"
          count={props.rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
}

TableComponent.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.array,
  header: PropTypes.string,
  data: PropTypes.object
}
TableComponent.defaultProps = {
  rowsPerPage: 30,
  rowsPerPageOptions: [15, 30, 50],
  header: "Table"
}

export default TableComponent;