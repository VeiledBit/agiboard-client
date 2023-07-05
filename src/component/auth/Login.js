import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import AuthService from "../../service/AuthService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';
import { CircularProgress } from "@mui/material";
import styles from "./Login.module.css";
import stylesNavBar from "./../navBar/NavBar.module.css";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordShowed, setIsPasswordShowed] = useState(false);
    const [isSnackbarWrongCredentialsShowed, setIsSnackbarWrongCredentialsShowed] =
        useState(false);
    const [isSpinnerShowed, setIsSpinnerShowed] = useState(false);

    useEffect(() => {
        localStorage.clear();
    }, []);

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required("Username is required")
            .max(30, "Maximum length is 30 characters"),
        password: Yup.string()
            .required("Password is required")
            .max(30, "Maximum length is 30 characters")
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const login = (formData) => {
        setIsSpinnerShowed(true);
        AuthService.login({
            username: formData.username,
            password: formData.password
        }).then(response => {
            setIsSpinnerShowed(false);
            if (response.status === 200) {
                localStorage.setItem("userInfo", JSON.stringify(response.data));
                navigate("/boards");
            }
        }).catch(error => {
            setIsSpinnerShowed(false);
        });
    }

    const onClickRegister = () => {
        navigate("/register");
    };

    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={styles.title}>
                        AGIBOARD
                    </Typography>
                    <div>
                        <Button className={`${stylesNavBar.btnMaterial} ${stylesNavBar.btnCreate}`} onClick={onClickRegister}>
                            REGISTER
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <div className={styles.container}>
                <h2 className={styles.title}>LOGIN</h2>
                <form className={`${styles.container} ${styles.containerForm}`} onSubmit={handleSubmit(login)}>
                    <TextField
                        className={styles.username}
                        type="text"
                        variant="standard"
                        name="username"
                        placeholder="Username"
                        inputProps={{ maxLength: 30 }}
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
                    <Button className={`${styles.btnLogin}`} type="submit" variant="contained">
                        Login
                    </Button>
                </form>
            </div>
            <Snackbar
                open={isSnackbarWrongCredentialsShowed}
                autoHideDuration={4000}
                onClose={() => setIsSnackbarWrongCredentialsShowed(false)} >
                <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
                    Wrong username and/or password.
                </Alert>
            </Snackbar>
            {isSpinnerShowed && <CircularProgress className={styles.spinner} />}
        </React.Fragment>
    )
}
