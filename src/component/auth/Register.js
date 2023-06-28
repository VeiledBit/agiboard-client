import React from "react"
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import UserService from "../../service/UserService";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import Snackbar from "@material-ui/core/Snackbar";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            name: "",
            passwordRepeat: "",
            isPasswordShowed: false,
            isPasswordRepeatShowed: false,
            isSnackbarRegistrationSuccessfulShowed: false,
            isSnackbarUsernameTakenShowed: false,
            isSnackBarTimeoutShowed: false
        };
    }

    componentDidMount() {
        ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
            return value === this.state.password;
        });
    }

    register = (event) => {
        event.preventDefault();
        UserService.saveUser({
            username: this.state.username,
            password: this.state.password,
            name: this.state.name
        }).then(response => {
            if (response.status === 200) {
                this.setState({
                    isSnackbarRegistrationSuccessfulShowed: true
                })
                setTimeout(() => {
                    localStorage.clear(); // Prevent infinite loop
                    this.props.history.push("");
                }, 2000);
            }
        }).catch(error => {
            if (error.code === "ECONNABORTED") {
                this.setStateSnackBarTimeout(true);
            } else {
                if (error.response !== undefined) {
                    if (error.response.status === 302) {
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                isSnackbarUsernameTakenShowed: true
                            }
                        })
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

    login = () => {
        this.props.history.push("")
    }

    handleVisualChange = (origin) => {
        this.setState(prevState => {
            return {
                [origin]: !prevState[origin],
            }
        });
    };

    setStateSnackBarTimeout = (snackbarState) => {
        this.setState(prevState => {
            return {
                ...prevState,
                isSnackBarTimeoutShowed: snackbarState
            }
        });
    }

    render() {
        const {isPasswordShowed, isPasswordRepeatShowed} = this.state;
        return (
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className="title">
                            Agiboard
                        </Typography>
                        <div className="dropdownMaterial">
                            <Button className="btnMaterial btnCreate" onClick={this.login}>
                                LOGIN
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="sm">
                    <Typography variant="h4" style={styles.center}>Register</Typography>
                    <ValidatorForm ref="form" onSubmit={this.register}>
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
                                               <InputAdornment name="passwordShowed" position="end">
                                                   <IconButton
                                                       aria-label="toggle password visibility"
                                                       onClick={() => this.handleVisualChange("isPasswordShowed")}>
                                                       {this.state.isPasswordShowed ? <Visibility/> : <VisibilityOff/>}
                                                   </IconButton>
                                               </InputAdornment>
                                           )
                                       }}/>
                        <TextValidator type={isPasswordRepeatShowed ? "text" : "password"}
                                       label="REPEAT PASSWORD" fullWidth margin="normal" name="passwordRepeat"
                                       value={this.state.passwordRepeat} onChange={this.onChange}
                                       validators={["isPasswordMatch", "required"]}
                                       errorMessages={["Passwords do not match", "This field is required"]}
                                       inputProps={{maxLength: 30}}
                                       InputProps={{
                                           endAdornment: (
                                               <InputAdornment position="end">
                                                   <IconButton
                                                       aria-label="toggle password visibility"
                                                       onClick={() => this.handleVisualChange("isPasswordRepeatShowed")}>
                                                       {this.state.isPasswordRepeatShowed ?
                                                           <Visibility/> : <VisibilityOff/>}
                                                   </IconButton>
                                               </InputAdornment>
                                           )
                                       }}/>
                        <TextValidator
                            type="text" label="NAME" fullWidth margin="normal" name="name"
                            value={this.state.name} onChange={this.onChange}
                            validators={["required"]}
                            errorMessages={["This field is required"]}
                            inputProps={{maxLength: 30}}/>
                        <Button variant="contained" color="secondary" type="submit">Register</Button>
                    </ValidatorForm>
                </Container>
                <Snackbar
                    open={this.state.isSnackbarRegistrationSuccessfulShowed}
                    autoHideDuration={2000}
                    onClose={() => null}
                    message="Registration successful. Redirecting..."/>
                <Snackbar
                    open={this.state.isSnackbarUsernameTakenShowed}
                    autoHideDuration={4000}
                    onClose={() => this.handleVisualChange("isSnackbarUsernameTakenShowed")}
                    message="Username is already taken."/>
                <Snackbar
                    open={this.state.isSnackBarTimeoutShowed}
                    autoHideDuration={5000}
                    onClose={() => this.setStateSnackBarTimeout(false)}
                    message="Backend services are hibernating, please wait a bit and try again."/>
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
    }
};

export default Register;
