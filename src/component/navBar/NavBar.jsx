import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import AuthService from "../../service/AuthService";
import styles from "./NavBar.module.css";

// eslint-disable-next-line object-curly-newline
export default function NavBar({ create, boardName, dashboard, logout, deleteAccount }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const menuDeleteAccount = () => {
        setAnchorEl(null);
        deleteAccount();
    };

    const title = boardName || "AGIBOARD";

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={styles.title}>
                        {title}
                    </Typography>
                    {create ? (
                        <div>
                            <Button className={styles.btnMaterial} onClick={create}>
                                CREATE NEW BOARD
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <Button className={styles.btnMaterial} onClick={dashboard}>
                                DASHBOARD
                            </Button>
                        </div>
                    )}
                    <Button
                        className={styles.btnMaterial}
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                    >
                        {AuthService.getUsername()}
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            "aria-labelledby": "basic-button"
                        }}
                    >
                        <MenuItem onClick={logout}>LOGOUT</MenuItem>
                        <MenuItem onClick={menuDeleteAccount}>DELETE ACCOUNT</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    );
}
