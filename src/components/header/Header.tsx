import React, {useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logout} from "../../store/userSlice";
import {useNavigate} from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    Typography,
    IconButton,
    MenuItem,
    Menu,
    ListItemIcon,
    Divider,
    ButtonGroup, Avatar,
} from "@mui/material";
import {Logout, Settings} from '@mui/icons-material';
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import type {RootState} from '../../store.ts';

const Header: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const menuItems = [
        {label: "O nas", path: "/about"},
        {label: "Oferty", path: "/oferty"},
        {label: "Utwórz CV", path: "/createCV"},
        {label: "Kontakt", path: "/contact"},
    ];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        setAnchorEl(null);
        toast.success(`Zostałeś wylogowany!`);
        dispatch(logout());
        navigate('/');
    };
    const {isAuth, user, id} = useSelector((state: RootState) => state.user);
    const GOLDEN_RATIO_CONJUGATE = 0.61803398875;
    const getHashID = (str: string) => {
        let hashID = 0;
        for (let i = 0; i < str.length; i++) {
            hashID = str.charCodeAt(i) + ((hashID << 5) - hashID);
        }
        return Math.abs(hashID);
    };
    const getColorFromHash = (id: string) => {
        let hash = getHashID(id);
        let spreading = (hash * GOLDEN_RATIO_CONJUGATE) % 1;
        spreading = Math.floor(spreading * 360);
        return `hsl(${spreading}, 65%, 55%)`;
    };
    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "background.default"
            }}>
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                <Link to={'/'}>
                    <ButtonGroup>
                        <Typography variant="h6"
                                    sx={{
                                        color: "text.primary",
                                        fontWeight: "bold"
                                    }}>
                            HireTrack
                        </Typography>
                    </ButtonGroup>
                </Link>
                <Box>
                    {menuItems.map((item, index) => (
                        <Button key={index}
                                component={Link}
                                to={item.path}
                                sx={{
                                    color: "primary.main",
                                    mx: 1,
                                    transition: "color 0.3s ease-in-out, background-color 0.3s ease-in-out",
                                    "&:hover": {
                                        textDecoration: "underline",
                                        textUnderlineOffset: "5px",
                                        color: "secondary.main",
                                        backgroundColor: "transparent"
                                    }
                                }}>
                            {item.label}
                        </Button>
                    ))}
                    <IconButton onClick={(event) => {
                        if (isAuth) {
                            handleClick(event);
                        } else {
                            navigate("/authUser");
                        }
                    }}>
                        <Avatar
                            sx={{
                                bgcolor: isAuth ? getColorFromHash(id ?? "default") : "gray",
                                color: "white",
                                width: 40,
                                height: 40,
                                fontSize: "1.2rem",
                            }}
                            alt={`${user?.firstname ?? ""} ${user?.lastname ?? ""}`}
                        >
                            {isAuth ? `${user?.firstname?.charAt(0)}${user?.lastname?.charAt(0)}` : ""}
                        </Avatar>
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}
                          transformOrigin={{horizontal: 'left', vertical: 'top'}}
                          disableScrollLock
                          sx={{
                              "& .MuiPaper-root": {
                                  bgcolor: "background.default",
                                  color: "primary.main",
                                  minWidth: 200,
                                  borderRadius: 2,
                                  mt: 1
                              },
                              "& .MuiMenuItem-root": {
                                  transition: "color 0.3s ease",
                                  "&:hover": {
                                      color: "gray",
                                  },
                              }
                          }}
                    >
                        <MenuItem disableRipple
                                  sx={{
                                      cursor: 'default',
                                      "&:hover": {
                                          backgroundColor: 'transparent',
                                      },
                                      pointerEvents: 'none'
                                  }}>
                            <Avatar
                                sx={{
                                    bgcolor: isAuth ? getColorFromHash(id ?? "default") : "gray",
                                    color: "white",
                                    width: 40,
                                    height: 40,
                                    fontSize: "1.2rem",
                                }}
                                alt={`${user?.firstname ?? ""} ${user?.lastname ?? ""}`}
                            >
                                {isAuth ? `${user?.firstname?.charAt(0)}${user?.lastname?.charAt(0)}` : ""}
                            </Avatar>
                            {isAuth && user && (
                                <Typography variant="body1">
                                    {user.firstname} {user.lastname}
                                </Typography>
                            )}
                        </MenuItem>
                        <Divider sx={{bgcolor: "secondary.main"}}/>
                        <MenuItem onClick={handleClose}>
                            <Typography variant="body2">Wybrane oferty</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Typography variant="body2">Wiadomości</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Typography variant="body2">Bezpieczeństwo</Typography>
                        </MenuItem>
                        <Divider sx={{bgcolor: "secondary.main"}}/>
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <Settings fontSize="small" sx={{color: 'gray'}}/>
                            </ListItemIcon>
                            <Typography variant="body2">Ustawienia</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" sx={{color: 'red'}}/>
                            </ListItemIcon>
                            <Typography variant="body2">Wyloguj się</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
export default Header;