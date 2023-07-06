import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Icon, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import UserService from "../../service/UserService";
import ConfirmDialog from "../confirmDialog/ConfirmDialog";
import NavBar from "../navBar/NavBar";
import AuthService from "../../service/AuthService";
import BoardService from "../../service/BoardService";
import styles from "./Boards.module.css";

export default function Boards() {
    const navigate = useNavigate();
    const [boards, setBoards] = useState([]);
    const [editBoardId, setEditBoardId] = useState(null);
    const [deleteBoardId, setDeleteBoardId] = useState(null);
    const [isModalCreateShowed, setIsModalCreateShowed] = useState(false);
    const [isModalUpdateShowed, setIsModalUpdateShowed] = useState(false);
    const [isModalConfirmBoardDeletionShowed, setIsModalConfirmBoardDeletionShowed] = useState(false);
    const [isModalConfirmAccountDeletionShowed, setIsModalConfirmAccountDeletionShowed] = useState(false);
    const [isSnackbarUserNotFoundShowed, setIsSnackbarUserNotFoundShowed] = useState(false);
    const [isSnackbarUserAddingSuccessful, setIsSnackbarUserAddingSuccessful] = useState(false);
    const [isSnackbarUserRemovingSuccessful, setIsSnackbarUserRemovingSuccessful] = useState(false);

    const validationSchemaNewBoard = Yup.object().shape({
        newBoardName: Yup.string().required("Board name is required")
    });

    const validationSchemaEditBoard = Yup.object().shape({
        editBoardName: Yup.string().required("Board name is required"),
        editBoardUsername: Yup.string().max(30, "Maximum length is 30 characters")
    });

    const {
        register: registerSave,
        handleSubmit: handleSubmitSave,
        formState: { errors: errorsSave }
    } = useForm({
        resolver: yupResolver(validationSchemaNewBoard)
    });

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        setValue,
        formState: { errors: errorsEdit }
    } = useForm({
        resolver: yupResolver(validationSchemaEditBoard)
    });

    useEffect(() => {
        BoardService.fetchBoards(AuthService.getUsername())
            .then((response) => {
                if (response.status === 200) {
                    setBoards(response.data);
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    localStorage.clear(); // Prevent infinite loop
                    navigate("/");
                }
            });
    }, [navigate]);

    const updateStateAfterWriting = (response) => {
        setBoards(response || boards);
        setIsModalCreateShowed(false);
        setIsModalUpdateShowed(false);
        setIsModalConfirmBoardDeletionShowed(false);
    };

    const showModalCreate = () => {
        setIsModalCreateShowed(true);
        setValue("newBoardName", "");
    };

    const hideModalCreate = () => {
        setIsModalCreateShowed(false);
    };

    const showModalUpdate = (editBoardIdParam, editBoardName) => {
        setIsModalUpdateShowed(true);
        setEditBoardId(editBoardIdParam);
        setValue("editBoardName", editBoardName);
        setValue("editBoardUsername", "");
    };

    const hideModalUpdate = () => {
        setIsModalUpdateShowed(false);
    };

    const showModalConfirmBoardDeletion = (boardId) => {
        setIsModalConfirmBoardDeletionShowed(true);
        setDeleteBoardId(boardId);
    };

    const hideModalConfirmBoardDeletion = () => {
        setIsModalConfirmBoardDeletionShowed(false);
        setDeleteBoardId(null);
    };

    const showModalConfirmAccountDeletion = () => {
        setIsModalConfirmAccountDeletionShowed(true);
    };

    const hideModalConfirmAccountDeletion = () => {
        setIsModalConfirmAccountDeletionShowed(false);
    };

    const saveBoard = (formData) => {
        BoardService.saveBoard({
            boardName: formData.newBoardName,
            username: AuthService.getUsername()
        })
            .then((response) => {
                if (response.status === 201) {
                    updateStateAfterWriting(response.data);
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    localStorage.clear(); // Prevent infinite loop
                    navigate("/");
                }
            });
    };

    const updateBoard = (formData) => {
        BoardService.updateBoard({
            boardId: editBoardId,
            boardName: formData.editBoardName,
            username: AuthService.getUsername()
        })
            .then((response) => {
                if (response.status === 200) {
                    updateStateAfterWriting(response.data);
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    localStorage.clear(); // Prevent infinite loop
                    navigate("/");
                }
            });
    };

    const addUserToBoard = (formData) => {
        if (!formData.editBoardUsername || formData.editBoardUsername.length === 0) {
            return;
        }
        BoardService.addUserToBoard({
            boardId: editBoardId,
            username: formData.editBoardUsername
        })
            .then((response) => {
                if (response.status === 200) {
                    setIsSnackbarUserAddingSuccessful(true);
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    localStorage.clear(); // Prevent infinite loop
                    navigate("/");
                } else if (error.response.status === 404) {
                    setIsSnackbarUserNotFoundShowed(true);
                }
            });
    };

    const removeUserFromBoard = (formData) => {
        if (!formData.editBoardUsername || formData.editBoardUsername.length === 0) {
            return;
        }
        BoardService.removeUserFromBoard({
            boardId: editBoardId,
            username: formData.editBoardUsername
        })
            .then((response) => {
                if (response.status === 200) {
                    setIsSnackbarUserRemovingSuccessful(true);
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    localStorage.clear(); // Prevent infinite loop
                    navigate("/");
                } else if (error.response.status === 404) {
                    setIsSnackbarUserNotFoundShowed(true);
                }
            });
    };

    const deleteBoard = (boardId) => {
        BoardService.deleteBoard({
            boardId,
            username: AuthService.getUsername()
        })
            .then((response) => {
                if (response.status === 200) {
                    updateStateAfterWriting(response.data);
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    localStorage.clear(); // Prevent infinite loop
                    navigate("/");
                }
            });
    };

    const deleteAccount = () => {
        UserService.deleteUser({
            username: AuthService.getUsername()
        }).then(() => {
            localStorage.clear(); // Prevent infinite loop
            navigate("/");
        });
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    if (typeof boards[0] === "undefined") {
        return (
            <>
                <NavBar create={showModalCreate} logout={logout} deleteAccount={showModalConfirmAccountDeletion} />
                <Dialog open={isModalCreateShowed} onClose={hideModalCreate}>
                    <DialogContent style={{ width: "300px" }}>
                        <form id="formNewBoard" onSubmit={handleSubmitSave(saveBoard)}>
                            <TextField
                                type="text"
                                variant="standard"
                                name="newBoardName"
                                placeholder="Enter board name..."
                                autoFocus
                                {...registerSave("newBoardName")}
                                error={!!errorsSave.newBoardName}
                                helperText={errorsSave.newBoardName?.message}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button form="formNewBoard" variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
                <ConfirmDialog
                    open={isModalConfirmAccountDeletionShowed}
                    onClose={hideModalConfirmAccountDeletion}
                    DialogTitleProp="Account deletion"
                    DialogContentProp={`This account, and all of the data associated with it, will be deleted. 
                               This action is irreversible. Are you sure you want to proceed?`}
                    onClickConfirm={deleteAccount}
                />
            </>
        );
    }
    return (
        <main>
            <NavBar create={showModalCreate} logout={logout} deleteAccount={showModalConfirmAccountDeletion} />
            <div className={styles.container}>
                {boards.map((board) => {
                    const { id, name } = board;
                    const toProps = {
                        pathname: `/board/${id}`
                    };
                    return (
                        <div className={styles.board} key={id}>
                            <Link to={toProps}>{name}</Link>
                            <Icon
                                style={{ marginLeft: 8, cursor: "pointer" }}
                                onClick={() => showModalUpdate(id, name)}
                            >
                                edit
                            </Icon>
                            <Icon
                                style={{ marginLeft: 8, cursor: "pointer" }}
                                onClick={() => showModalConfirmBoardDeletion(id)}
                            >
                                delete
                            </Icon>
                        </div>
                    );
                })}
            </div>
            <Dialog open={isModalCreateShowed} onClose={hideModalCreate}>
                <DialogContent style={{ width: "300px" }}>
                    <form id="formNewBoard" onSubmit={handleSubmitSave(saveBoard)}>
                        <TextField
                            type="text"
                            variant="standard"
                            name="newBoardName"
                            placeholder="Enter board name..."
                            autoFocus
                            {...registerSave("newBoardName")}
                            error={!!errorsSave.newBoardName}
                            helperText={errorsSave.newBoardName?.message}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button form="formNewBoard" variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isModalUpdateShowed} onClose={hideModalUpdate}>
                <DialogContent style={{ width: "524px", padding: "20px 8px 20px 24px" }}>
                    <form id="formEditBoard" onSubmit={handleSubmitEdit(updateBoard)}>
                        <TextField
                            type="text"
                            variant="standard"
                            name="editBoardName"
                            placeholder="Enter board name..."
                            {...registerEdit("editBoardName")}
                            error={!!errorsEdit.editBoardName}
                            helperText={errorsEdit.editBoardName?.message}
                        />
                        <br />
                        <TextField
                            type="text"
                            variant="standard"
                            name="editBoardUsername"
                            placeholder="Enter username to add to the board..."
                            inputProps={{ maxLength: 30 }}
                            style={{ width: "18.750em" }}
                            {...registerEdit("editBoardUsername")}
                            error={!!errorsEdit.editBoardUsername}
                            helperText={errorsEdit.editBoardUsername?.message}
                        />
                        <Button
                            style={{ marginLeft: "24px", marginRight: "8px", verticalAlign: "inherit" }}
                            variant="contained"
                            color="success"
                            onClick={handleSubmitEdit(addUserToBoard)}
                        >
                            ADD
                        </Button>
                        <Button
                            style={{ verticalAlign: "inherit", float: "right" }}
                            variant="contained"
                            color="error"
                            onClick={handleSubmitEdit(removeUserFromBoard)}
                        >
                            REMOVE
                        </Button>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button form="formEditBoard" variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={isSnackbarUserAddingSuccessful}
                autoHideDuration={4000}
                onClose={() => setIsSnackbarUserAddingSuccessful(false)}
                message="Adding successful."
            >
                <Alert variant="filled" severity="success" sx={{ width: "100%" }}>
                    Adding successful.
                </Alert>
            </Snackbar>
            <Snackbar
                open={isSnackbarUserRemovingSuccessful}
                autoHideDuration={4000}
                onClose={() => setIsSnackbarUserRemovingSuccessful(false)}
                message="Removing successful."
            >
                <Alert variant="filled" severity="success" sx={{ width: "100%" }}>
                    Removing successful.
                </Alert>
            </Snackbar>
            <Snackbar
                open={isSnackbarUserNotFoundShowed}
                autoHideDuration={4000}
                onClose={() => setIsSnackbarUserNotFoundShowed(false)}
                message="User not found."
            >
                <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
                    User not found.
                </Alert>
            </Snackbar>
            <ConfirmDialog
                open={isModalConfirmBoardDeletionShowed}
                onClose={hideModalConfirmBoardDeletion}
                DialogTitleProp="Board deletion"
                DialogContentProp="Are you sure you want to delete this board?"
                onClickConfirm={() => deleteBoard(deleteBoardId)}
            />
            <ConfirmDialog
                open={isModalConfirmAccountDeletionShowed}
                onClose={hideModalConfirmAccountDeletion}
                DialogTitleProp="Account deletion"
                DialogContentProp={`This account, and all of the data associated with it, will be deleted. 
                               This action is irreversible. Are you sure you want to proceed?`}
                onClickConfirm={deleteAccount}
            />
        </main>
    );
}
