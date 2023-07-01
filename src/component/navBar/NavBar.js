import React from "react"
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AuthService from "../../service/AuthService";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import styles from "./NavBar.module.css";

export default function NavBar({ boardName, create, dashboard, logout, deleteAccount }) {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={styles.title}>
                        Agiboard
                    </Typography>
                    {
                        create ?
                            <div className={styles.dropdownMaterial}>
                                <Button className={`${styles.btnMaterial} ${styles.btnCreate}`} onClick={create}>
                                    CREATE NEW BOARD
                                </Button>
                            </div> :
                            <div className={styles.dropdownMaterial}>
                                <Button className={`${styles.btnMaterial} ${styles.btnCreate}`} onClick={dashboard}>
                                    DASHBOARD
                                </Button>
                            </div>
                    }
                    <div className={`${styles.dropdownMaterial} ${styles.right}`}>
                        <button className={`${styles.btnMaterial} ${styles.btnDropMaterial}`}>
                            {AuthService.getUserInfo().username}
                            <i className="fa fa-caret-down" style={{ marginLeft: "1em" }} />
                        </button>
                        <div className={styles.dropdownContentMaterial}>
                            <MenuItem className={styles.btnMenuMaterial} onClick={logout}>LOGOUT</MenuItem>
                            <MenuItem className={styles.btnMenuMaterial} onClick={deleteAccount}>DELETE
                                ACCOUNT</MenuItem>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}
