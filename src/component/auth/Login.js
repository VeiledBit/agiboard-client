import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Input from '@mui/material/Input';
import AuthService from "../../service/AuthService";
import { useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import { CircularProgress } from "@mui/material";
import "./login.css"

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordShowed, setIsPasswordShowed] = useState(false);
    const [isSnackbarWrongCredentialsShowed, setIsSnackbarWrongCredentialsShowed] =
        useState(false);
    const [isSpinnerShowed, setIsSpinnerShowed] = useState(false);
    const [isSnackBarTimeoutShowed, setIsSnackBarTimeoutShowed] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();


    useEffect(() => {
        localStorage.clear();
    }, []);

    const login = (formData) => {
        setIsSpinnerShowed(true);
        console.log(styles.spinner.display)
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
            if (error.code === "ECONNABORTED") {
                setIsSnackBarTimeoutShowed(true);
            } else {
                if (error.response !== undefined) {
                    if (error.response.status === 401) {
                        setIsSnackbarWrongCredentialsShowed(true);
                    }
                }
            }
        });
    }

    const onClickRegister = () => {
        console.log("clicking");
        navigate("/register");
    };

    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className="title">
                        Agiboard
                    </Typography>
                    <div className="dropdownMaterial">
                        <Button className="btnMaterial btnCreate" onClick={onClickRegister}>
                            REGISTER
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm">
                <Typography variant="h4" style={styles.center}>Login</Typography>
                <form className="form" onSubmit={handleSubmit(login)}>
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
                    <button className="btn btnCreate" type="submit">
                        Login
                    </button>
                </form>
            </Container>
            <Snackbar
                open={isSnackbarWrongCredentialsShowed}
                autoHideDuration={4000}
                onClose={() => setIsSnackbarWrongCredentialsShowed(false)}
                message="Wrong username and/or password." />
            <Snackbar
                open={isSnackBarTimeoutShowed}
                autoHideDuration={5000}
                onClose={() => setIsSnackBarTimeoutShowed(false)}
                message="Backend services are hibernating, please wait a bit and try again." />
            {isSpinnerShowed && <CircularProgress style={styles.spinner} />}
        </React.Fragment>
    )
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
