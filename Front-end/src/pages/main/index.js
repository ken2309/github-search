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
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const columns = [
  { id: 'id', label: '#', minWidth: 50 },
  {
    id: 'avatar_url',
    label: 'Avatar',
    minWidth: 50,
    align: 'left',
    isElement: (value) => <img src={value} alt="avatar" width='50px' height="50px" />,
    format: () => { }
  },
  { id: 'login', label: 'Name', minWidth: 50 },
  {
    id: 'html_url',
    label: 'Profile link',
    minWidth: 180,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'url',
    label: 'Public repos',
    minWidth: 180,
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

  const [activeAcc, setActiveAcc] = useState({
    open: false,
    acc: null
  })
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

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
  const handleDetailClick = (x) => {
    setActiveAcc({
      ...activeAcc,
      open: true,
      acc: x
    })
  }
  return (
    <>
      <Navbar />
      {
        (listUser && listUser.items?.length > 0) &&
        <Paper sx={{ width: '100%', overflow: 'hidden', margin: '20px auto' }}>
          <TableContainer sx={{ maxHeight: 500 }}>
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
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code} onClick={() => handleDetailClick(listUser.items[idx])}>
                          {columns.map((column, index) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={index} align={column.align}>
                                {column.id ? column.isElement ? column.isElement(value) : column.format && typeof value === 'number'
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
      <DetailAccModal activeAcc={activeAcc} setActiveAcc={setActiveAcc} acc={activeAcc.acc} />
    </>
  )
}

function FavoriteItem(row) {
  const { user } = useContext(AppContext);
  const [isLike, setIsLike] = useState();
  let id = row.row.id;
  async function like() {
    setIsLike(true);
    usersApi.like({ id: id, phoneNumber: user.phoneNumber })
  }
  async function unLike() {
    setIsLike(false);
    usersApi.unLike({ id: id, phoneNumber: user.phoneNumber })
  }
  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    setIsLike(user?.favouriteList.filter((e) => e == row.row.id).length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.row])
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
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
function DetailAccModal(props) {
  let open = props.activeAcc.open;
  let setOpen = props.setActiveAcc;
  let acc = props.acc

  const handleClose = () => setOpen({ ...props.activeAcc, open: false });
  console.log(acc);
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 56, height: 56 }}
            />
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}