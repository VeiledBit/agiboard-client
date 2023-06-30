import React, { useState } from "react";
import { useNavigate } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Input from '@mui/material/Input';
import Button from "@mui/material/Button";
import UserService from "../../service/UserService";
import { useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [isPasswordShowed, setIsPasswordShowed] = useState(false);
    const [isPasswordRepeatShowed, setIsPasswordRepeatShowed] = useState(false);
    const [isSnackbarRegistrationSuccessfulShowed, setIsSnackbarRegistrationSuccessfulShowed] = useState(false);
    const [isSnackbarUsernameTakenShowed, setIsSnackbarUsernameTakenShowed] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const registerUser = (formData) => {
        UserService.saveUser({
            username: formData.username,
            password: formData.password,
            name: formData.name
        }).then(response => {
            if (response.status === 200) {
                setIsSnackbarRegistrationSuccessfulShowed(true);
                setTimeout(() => {
                    localStorage.clear(); // Prevent infinite loop
                    navigate("/");
                }, 2000);
            }
        }).catch(error => {
            if (error.response !== undefined) {
                if (error.response.status === 302) {
                    setIsSnackbarUsernameTakenShowed(true);
                }
            }
        });
    };

    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className="title">
                        Agiboard
                    </Typography>
                    <div className="dropdownMaterial">
                        <Button className="btnMaterial btnCreate" onClick={() => navigate("/")}>
                            LOGIN
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm">
                <Typography variant="h4" style={styles.center}>Register</Typography>
                <form className="form" onSubmit={handleSubmit(registerUser)}>
                    <Input
                        type="text"
                        name="username"
                        placeholder="Username"
                        maxLength="30"
                        margin="normal"
                        {...register("username", { required: true, maxLength: 30 })}
                    />
                    <Input
                        type={isPasswordShowed ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        maxLength="30"
                        margin="normal"
                        {...register("password", { required: true, maxLength: 30 })}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setIsPasswordShowed(!isPasswordShowed)}
                                    edge="end"
                                >
                                    {isPasswordShowed ?
                                        <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <Input
                        type={isPasswordRepeatShowed ? "text" : "password"}
                        name="passwordRepeat"
                        placeholder="Repeat Password"
                        maxLength="30"
                        margin="normal"
                        {...register("passwordRepeat", { required: true, maxLength: 30 })}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setIsPasswordRepeatShowed(!isPasswordRepeatShowed)}
                                    edge="end"
                                >
                                    {isPasswordRepeatShowed ?
                                        <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <Input
                        type="text"
                        name="name"
                        placeholder="Name"
                        maxLength="30"
                        margin="normal"
                        {...register("name", { required: true, maxLength: 30 })}
                    />
                    {errors.username?.type === "required" && (
                        <span className="error">Username is required</span>
                    )}
                    {errors.username?.type === "maxLength" && (
                        <span className="error">Maximum length is 30</span>
                    )}
                    {errors.password?.type === "required" && (
                        <span className="error">Password is required</span>
                    )}
                    {errors.password?.type === "maxLength" && (
                        <span className="error">Maximum length is 30</span>
                    )}
                    {errors.passwordRepeat?.type === "required" && (
                        <span className="error">Password is required</span>
                    )}
                    {errors.passwordRepeat?.type === "maxLength" && (
                        <span className="error">Maximum length is 30</span>
                    )}
                    {errors.name?.type === "required" && (
                        <span className="error">Name is required</span>
                    )}
                    {errors.name?.type === "maxLength" && (
                        <span className="error">Maximum length is 30</span>
                    )}
                    <Button variant="contained" color="secondary" type="submit">Register</Button>
                </form>
            </Container>
            <Snackbar
                open={isSnackbarRegistrationSuccessfulShowed}
                autoHideDuration={2000}
                onClose={() => null}
                message="Registration successful. Redirecting..." />
            <Snackbar
                open={isSnackbarUsernameTakenShowed}
                autoHideDuration={4000}
                onClose={() => this.handleVisualChange("isSnackbarUsernameTakenShowed")}
                message="Username is already taken." />
        </React.Fragment>
    );
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
