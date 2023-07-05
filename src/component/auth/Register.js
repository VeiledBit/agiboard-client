import React, { useState } from "react";
import { useNavigate } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import UserService from "../../service/UserService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import styles from "./Register.module.css";
import stylesNavBar from "./../navBar/NavBar.module.css";

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [isPasswordShowed, setIsPasswordShowed] = useState(false);
    const [isPasswordConfirmShowed, setIsPasswordConfirmShowed] = useState(false);
    const [isSnackbarRegistrationSuccessfulShowed, setIsSnackbarRegistrationSuccessfulShowed] = useState(false);
    const [isSnackbarUsernameTakenShowed, setIsSnackbarUsernameTakenShowed] = useState(false);

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required("Username is required")
            .max(30, "Maximum length is 30 characters"),
        password: Yup.string()
            .required("Password is required")
            .max(30, "Maximum length is 30 characters"),
        passwordConfirm: Yup.string()
            .required("Confirm password is required")
            .oneOf([Yup.ref("password"), null], "Confirm password does not match"),
        name: Yup.string()
            .required("Username is required")
            .max(30, "Maximum length is 30 characters")
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

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
                    <Typography variant="h6" className={styles.title}>
                        AGIBOARD
                    </Typography>
                    <div>
                        <Button className={`${stylesNavBar.btnMaterial} ${stylesNavBar.btnCreate}`} onClick={() => navigate("/")}>
                            LOGIN
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <div className={styles.container}>
                <h2 className={styles.title}>REGISTER</h2>
                <form className={`${styles.container} ${styles.containerForm}`} onSubmit={handleSubmit(registerUser)}>
                    <TextField
                        className={styles.username}
                        type="text"
                        variant="standard"
                        name="username"
                        placeholder="Username"
                        inputProps={{ maxLength: 30 }}
                        margin="normal"
                        {...register("username")}
                        error={errors.username ? true : false}
                        helperText={errors.username?.message}
                    />
                    <TextField
                        className={styles.password}
                        type={isPasswordShowed ? "text" : "password"}
                        variant="standard"
                        name="password"
                        placeholder="Password"
                        inputProps={{ maxLength: 30 }}
                        margin="normal"
                        {...register("password")}
                        error={errors.password ? true : false}
                        helperText={errors.password?.message}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setIsPasswordShowed(!isPasswordShowed)}
                                        edge="end" >
                                        {isPasswordShowed ?
                                            <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                    <TextField
                        className={styles.password}
                        type={isPasswordConfirmShowed ? "text" : "password"}
                        variant="standard"
                        name="passwordConfirm"
                        placeholder="Confirm Password"
                        inputProps={{ maxLength: 30 }}
                        margin="normal"
                        {...register("passwordConfirm")}
                        error={errors.passwordConfirm ? true : false}
                        helperText={errors.passwordConfirm?.message}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setIsPasswordConfirmShowed(!isPasswordConfirmShowed)}
                                        edge="end" >
                                        {isPasswordConfirmShowed ?
                                            <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                    <TextField
                        className={styles.name}
                        type="text"
                        variant="standard"
                        name="name"
                        placeholder="Name"
                        inputProps={{ maxLength: 30 }}
                        margin="normal"
                        {...register("name")}
                        error={errors.name ? true : false}
                        helperText={errors.name?.message}
                    />
                    <Button className={`${styles.btnRegister}`} variant="contained" type="submit">Register</Button>
                </form>
            </div>
            <Snackbar
                open={isSnackbarRegistrationSuccessfulShowed}
                autoHideDuration={2000}
                onClose={() => setIsSnackbarRegistrationSuccessfulShowed(false)}>
                <Alert variant="filled" severity="success" sx={{ width: '100%' }}>
                    Registration successful. Redirecting...
                </Alert>
            </Snackbar>
            <Snackbar
                open={isSnackbarUsernameTakenShowed}
                autoHideDuration={3500}
                onClose={() => setIsSnackbarUsernameTakenShowed(false)}>
                <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
                    Username is already taken.
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}
