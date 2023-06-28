import React from "react"
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AuthService from "../../service/AuthService";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import "./navBar.css"

class NavBar extends React.Component {
    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className="title">
                            Agiboard
                        </Typography>
                        {
                            this.props.create ?
                                <div className="dropdownMaterial">
                                    <Button className="btnMaterial btnCreate" onClick={this.props.create}>
                                        CREATE NEW BOARD
                                    </Button>
                                </div> :
                                <div className="dropdownMaterial">
                                    <Button className="btnMaterial btnCreate" onClick={this.props.dashboard}>
                                        DASHBOARD
                                    </Button>
                                </div>
                        }
                        <div className="dropdownMaterial right">
                            <button className="btnMaterial btnDropMaterial">
                                {AuthService.getUserInfo().username}
                                <i className="fa fa-caret-down" style={{marginLeft: "1em"}}/>
                            </button>
                            <div className="dropdown-content-material">
                                <MenuItem className="btnMenuMaterial" onClick={this.props.logout}>LOGOUT</MenuItem>
                                <MenuItem className="btnMenuMaterial" onClick={this.props.deleteAccount}>DELETE
                                    ACCOUNT</MenuItem>
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default NavBar;
