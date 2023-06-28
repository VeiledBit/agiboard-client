import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AuthService from "../../service/AuthService";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import Snackbar from "@material-ui/core/Snackbar";
import {CircularProgress} from "@material-ui/core";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            isPasswordShowed: false,
            isSnackbarWrongCredentialsShowed: false,
            isSpinnerShowed: false
        };
    }

    componentDidMount() {
        localStorage.clear();
    }

    login = (e) => {
        e.preventDefault();
        this.setSpinnerState(true);
        console.log(styles.spinner.display)
        AuthService.login({
            username: this.state.username,
            password: this.state.password
        }).then(response => {
            this.setSpinnerState(false);
            if (response.status === 200) {
                localStorage.setItem("userInfo", JSON.stringify(response.data));
                this.props.history.push("/boards");
            }
        }).catch(error => {
            this.setSpinnerState(false);
            if (error.code === "ECONNABORTED") {
                this.setStateSnackBarTimeout(true);
            } else {
                if (error.response !== undefined) {
                    if (error.response.status === 401) {
                        this.setStateSnackbarWrongCredentials(true);
                    }
                }
            }
        });
    };

    onChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });
    };

    handleClickShowPassword = () => {
        this.setState(prevState => {
            return {
                isPasswordShowed: !prevState.isPasswordShowed
            }
        });
    };

    setStateSnackbarWrongCredentials = (snackbarState) => {
        this.setState({
            isSnackbarWrongCredentialsShowed: snackbarState
        });
    };

    setStateSnackBarTimeout = (snackbarState) => {
        this.setState({
            isSnackBarTimeoutShowed: snackbarState
        });
    }

    setSpinnerState = (isSpinnerShowed) => {
        this.setState({
            isSpinnerShowed: isSpinnerShowed
        })
    }

    register = () => {
        this.props.history.push("/register")
    }

    render() {
        const {isPasswordShowed} = this.state;
        return (
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className="title">
                            Agiboard
                        </Typography>
                        <div className="dropdownMaterial">
                            <Button className="btnMaterial btnCreate" onClick={this.register}>
                                REGISTER
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="sm">
                    <Typography variant="h4" style={styles.center}>Login</Typography>
                    <ValidatorForm ref="form" onSubmit={this.login}>
                        <TextValidator
                            type="text" label="USERNAME" fullWidth margin="normal" name="username"
                            value={this.state.username} onChange={this.onChange}
                            validators={["required"]}
                            errorMessages={["This field is required"]}
                            inputProps={{maxLength: 30}}/>
                        <TextValidator type={isPasswordShowed ? "text" : "password"}
                                       label="PASSWORD" fullWidth margin="normal" name="password"
                                       value={this.state.password} onChange={this.onChange}
                                       validators={["required"]}
                                       errorMessages={["This field is required"]}
                                       inputProps={{maxLength: 30}}
                                       InputProps={{
                                           endAdornment: (
                                               <InputAdornment position="end">
                                                   <IconButton
                                                       aria-label="toggle password visibility"
                                                       onClick={this.handleClickShowPassword}>
                                                       {this.state.isPasswordShowed ?
                                                           <Visibility/> : <VisibilityOff/>}
                                                   </IconButton>
                                               </InputAdornment>
                                           )
                                       }}/>
                        <Button variant="contained" color="secondary" type="submit">Login</Button>
                    </ValidatorForm>
                </Container>
                <Snackbar
                    open={this.state.isSnackbarWrongCredentialsShowed}
                    autoHideDuration={4000}
                    onClose={() => this.setStateSnackbarWrongCredentials(false)}
                    message="Wrong username and/or password."/>
                <Snackbar
                    open={this.state.isSnackBarTimeoutShowed}
                    autoHideDuration={5000}
                    onClose={() => this.setStateSnackBarTimeout(false)}
                    message="Backend services are hibernating, please wait a bit and try again."/>
                {this.state.isSpinnerShowed && <CircularProgress style={styles.spinner}/>}
            </React.Fragment>
        )
    }
}

const styles = {
    center: {
        display: "flex",
        justifyContent: "center",
        paddingTop: "1em"
    },
    notification: {
        display: "flex",
        justifyContent: "center",
        color: "#dc3545"
    },
    spinner: {
        position: "fixed",
        left: "50%",
        bottom: "40%"
    }
};

export default Login;