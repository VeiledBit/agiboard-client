import React from "react"
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AuthService from "../../service/AuthService";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import "./navBar.css"

export default function NavBar({boardName, create, dashboard, logout, deleteAccount}) {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className="title">
                        Agiboard
                    </Typography>
                    {
                        create ?
                            <div className="dropdownMaterial">
                                <Button className="btnMaterial btnCreate" onClick={create}>
                                    CREATE NEW BOARD
                                </Button>
                            </div> :
                            <div className="dropdownMaterial">
                                <Button className="btnMaterial btnCreate" onClick={dashboard}>
                                    DASHBOARD
                                </Button>
                            </div>
                    }
                    <div className="dropdownMaterial right">
                        <button className="btnMaterial btnDropMaterial">
                            {AuthService.getUserInfo().username}
                            <i className="fa fa-caret-down" style={{ marginLeft: "1em" }} />
                        </button>
                        <div className="dropdown-content-material">
                            <MenuItem className="btnMenuMaterial" onClick={logout}>LOGOUT</MenuItem>
                            <MenuItem className="btnMenuMaterial" onClick={deleteAccount}>DELETE
                                ACCOUNT</MenuItem>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}
