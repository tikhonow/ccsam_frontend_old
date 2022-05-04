import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SideBar from "./SideBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import authSlice from "../store/auth/auth";
import useSWR from "swr";
import { fetcher } from "../store/auth/refresh";
import { UserResponse } from "../../types/user";
import { RootState } from "../store";


interface LocationState {
  userId: string;
}

export default function ButtonAppBar() {
  const account = useSelector((state: RootState) => state.auth.account);
  const userId = account?.user;
  const user = useSWR<UserResponse>(`/user/${1}/`, fetcher);

  const dispatch = useDispatch();
  const history = useHistory();

  const settings = ["Logout"];

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log(user);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
    history.push("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <SideBar></SideBar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CС SAM
          </Typography>
          <p> {user.data?.name + " " + user.data?.last_name}</p>
          <Tooltip title={user.data?.username as string}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleLogout}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
