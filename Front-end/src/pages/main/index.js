import { useState, useEffect, useContext } from 'react'
import { AppContext } from "../../AppProvider";
import Navbar from '../../components/navbar';
import usersApi from '../../apis/users';
// Start Data Table
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const columns = [
  { id: 'id', label: 'id', minWidth: 70 },
  { id: 'login', label: 'login', minWidth: 100 },
  {
    id: 'avatar_url',
    label: 'avatar_url',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'html_url',
    label: 'Profile link',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'url',
    label: 'Public repos',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toFixed(2),
  },
  {
    id: false,
    label: 'Reaction',
    minWidth: 20,
    align: 'center',
  },
];

export default function Index() {
  const { user, listUser, setListUser, key } = useContext(AppContext);
  console.log(user);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchListGitAccount(newPage + 1, rowsPerPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    fetchListGitAccount(1, +event.target.value);
    setPage(0);
  };
  console.log("Home render =>>", listUser);

  async function fetchListGitAccount(page, per_page) {
    try {
      console.log(key, page, per_page);
      let res = await usersApi.getAll(key, page, per_page);
      console.log("res =>>", res);
      setListUser(res.data);
    } catch (err) {
      alert('System errors');
      console.log(err);
    }
  }

  return (
    <>
      <Navbar />
      {
        (listUser && listUser.items?.length > 0) &&
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  listUser.items?.length > 0
                    ?
                    listUser.items?.map((row, idx) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                          {columns.map((column, index) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={index} align={column.align}>
                                {column.id ? column.format && typeof value === 'number'
                                  ? column.format(value)
                                  : value : <FavoriteItem index={idx} row={listUser.items[idx]} />}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })
                    :
                    <TableRow hover role="checkbox" tabIndex={-1} key="">
                      <TableCell align='left'>
                        {columns.map((column, index) => {
                          const value = '';
                          return (
                            <TableCell key={index} align={column.align}>
                              {column.id ? column.format && typeof value === 'number'
                                ? column.format(value)
                                : value : <div key={index} ></div>}
                            </TableCell>
                          );
                        })}
                      </TableCell>
                    </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 7, 10, 30]}
            component="div"
            count={listUser?.total_count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      }
    </>
  )
}

function FavoriteItem(row) {
  const { user } = useContext(AppContext);
  const [isLike, setIsLike] = useState(user?.favouriteList.filter((e) => e === row.row.id).length > 0);
  let id = row.row.id;
  console.log("isLike ==> "+isLike,"id ==>",row);
  async function like() {
    setIsLike(true);
    usersApi.like({ id: id, phoneNumber: user.phoneNumber })
  }
  async function unLike() {
    setIsLike(false);
    usersApi.unLike({ id: id, phoneNumber: user.phoneNumber })
  }
  return (
    isLike
      ?
      <div style={{ cursor: 'pointer' }} onClick={() => unLike()}>
        <FavoriteIcon className='Icon' />
      </div>
      :
      <div style={{ cursor: 'pointer' }} onClick={() => like()}>
        <FavoriteBorderIcon className='Icon' />
      </div>
  )
}