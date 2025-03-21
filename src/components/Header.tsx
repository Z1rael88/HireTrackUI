import React, {useState} from "react";
import {Link} from "react-router-dom";
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
    ButtonGroup,

} from "@mui/material";
import {Person, AccountCircle, Logout, Settings} from '@mui/icons-material';

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
                    <IconButton onClick={handleClick}>
                        <Person fontSize={"large"} sx={{
                            color: "primary.main",
                            "&:hover": {
                                color: "secondary.main",
                            }
                        }}/>

                    </IconButton>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}
                          transformOrigin={{horizontal: 'left', vertical: 'top'}}
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
                        <MenuItem>
                            <ListItemIcon>
                                <AccountCircle fontSize="medium" sx={{color: 'primary.main'}}/>
                            </ListItemIcon>
                            <Typography variant="body1">Dmytro Parfenenko</Typography>
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

                        <MenuItem onClick={handleClose}>
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