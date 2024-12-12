import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';  // Import TableHead
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Button from '@mui/material/Button';  // For CSV download button

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(district, regionalPostOffice, totalPosts) {
  return { district, regionalPostOffice, totalPosts };
}

// Mock data for Coimbatore and Chennai districts
const rows = [
    createData('Coimbatore', 'Coimbatore North', 1200),
    createData('Coimbatore', 'Coimbatore South', 1500),
    createData('Coimbatore', 'Coimbatore East', 1300),
    createData('Coimbatore', 'Coimbatore West', 1100),
    createData('Coimbatore', 'Coimbatore Central', 1250),
    createData('Chennai', 'Chennai Central', 1800),
    createData('Chennai', 'Chennai East', 1400),
    createData('Chennai', 'Chennai West', 1600),
    createData('Chennai', 'Chennai South', 1500),
    createData('Chennai', 'Chennai North', 1700),
    createData('Chennai', 'Chennai Tambaram', 1100),
    createData('Coimbatore', 'Coimbatore Peelamedu', 1350),
    createData('Coimbatore', 'Coimbatore RS', 1400),
    createData('Chennai', 'Chennai T Nagar', 1800),
    createData('Chennai', 'Chennai Adyar', 1600),
    createData('Chennai', 'Chennai Mylapore', 1550),
    createData('Chennai', 'Chennai Anna Nagar', 1700),
    createData('Chennai', 'Chennai Perungudi', 1500),
    createData('Coimbatore', 'Coimbatore Singanallur', 1200),
    createData('Chennai', 'Chennai Mount Road', 1450),
].sort((a, b) => (a.totalPosts < b.totalPosts ? -1 : 1));

export default function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to download data as CSV
  const downloadCSV = () => {
    const csvRows = [];
    const headers = ['District', 'Regional Post Office', 'Total Posts'];
    csvRows.push(headers.join(','));

    rows.forEach(row => {
      const values = [row.district, row.regionalPostOffice, row.totalPosts];
      csvRows.push(values.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'post_offices_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <TableContainer component={Paper}>
      {/* CSV Download Button */}
      <Box sx={{ marginBottom: 2 }}>
        <Button variant="contained" color="primary" onClick={downloadCSV}>
          Download CSV
        </Button>
      </Box>
      
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        {/* Add TableHead for column headers */}
        <TableHead>
          <TableRow>
            <TableCell>District</TableCell>
            <TableCell align="left">Regional Post Office</TableCell>
            <TableCell align="right">Total Posts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.regionalPostOffice}>
              <TableCell component="th" scope="row">
                {row.district}
              </TableCell>
              <TableCell style={{ width: 160 }} align="left">
                {row.regionalPostOffice}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.totalPosts}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}