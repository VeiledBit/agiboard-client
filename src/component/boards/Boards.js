import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components"
import { useForm } from "react-hook-form";
import BoardService from "../../service/BoardService";
import AuthService from "../../service/AuthService";
import NavBar from "../navBar/NavBar";
import ConfirmDialog from "../confirmDialog/ConfirmDialog";
import UserService from "../../service/UserService";
import "react-bootstrap";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Icon, Input } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

const Board = styled.div`
  border: 0.063em solid lightgrey;
  border-radius: 0.125em;
  padding: 0.500em;
  margin-bottom: 0.500em;
  display: flex;
  margin-left: 0.313em
`;

const Container = styled.div`
  padding: 1em;
  display: flex;
`;

export default function Boards() {
    const navigate = useNavigate();
    const [boards, setBoards] = useState([]);
    const [newBoardName, setNewBoardName] = useState("");
    const [editBoardName, setEditBoardName] = useState("");
    const [editBoardUsername, setEditBoardUsername] = useState("");
    const [editBoardId, setEditBoardId] = useState(null);
    const [deleteBoardId, setDeleteBoardId] = useState(null);
    const [isModalCreateShowed, setIsModalCreateShowed] = useState(false);
    const [isModalUpdateShowed, setIsModalUpdateShowed] = useState(false);
    const [isModalConfirmBoardDeletionShowed, setIsModalConfirmBoardDeletionShowed] = useState(false);
    const [isModalConfirmAccountDeletionShowed, setIsModalConfirmAccountDeletionShowed] = useState(false);
    const [isSnackbarUserNotFoundShowed, setIsSnackbarUserNotFoundShowed] = useState(false);
    const [isSnackbarUserAddingSuccessful, setIsSnackbarUserAddingSuccessful] = useState(false);
    const [isSnackbarUserRemovingSuccessful, setIsSnackbarUserRemovingSuccessful] = useState(false);

    const {
        register: registerSave,
        handleSubmit: handleSubmitSave,
    } = useForm();

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        setValue
    } = useForm();

    useEffect(() => {
        BoardService.fetchBoards(AuthService.getUsername()).then(response => {
            if (response.status === 200) {
                setBoards(response.data)
            }
        }).catch(error => {
            if (error.response.status === 401) {
                localStorage.clear(); // Prevent infinite loop
                navigate("/");
            }
        });
    }, [navigate])

    const updateState = (newBoardName, editBoardName, editBoardUsername, editBoardId, deleteBoardId,
        isModalCreateShowed, isModalUpdateShowed,
        isModalConfirmBoardDeletionShowed, isModalConfirmAccountDeletionShowed,
        isSnackbarUserNotFoundShowed, isSnackbarUserAddingSuccessful,
        isSnackbarUserRemovingSuccessful, response) => {
        setBoards(response ? response : boards);
        setNewBoardName(newBoardName);
        setEditBoardName(editBoardName);
        setEditBoardUsername(editBoardUsername);
        setEditBoardId(editBoardId);
        setDeleteBoardId(deleteBoardId);
        setIsModalCreateShowed(isModalCreateShowed);
        setIsModalUpdateShowed(isModalUpdateShowed);
        setIsModalConfirmBoardDeletionShowed(isModalConfirmBoardDeletionShowed);
        setIsModalConfirmAccountDeletionShowed(isModalConfirmAccountDeletionShowed);
        setIsSnackbarUserNotFoundShowed(isSnackbarUserNotFoundShowed);
        setIsSnackbarUserAddingSuccessful(isSnackbarUserAddingSuccessful);
        setIsSnackbarUserRemovingSuccessful(isSnackbarUserRemovingSuccessful);
    }

    const updateStateAfterWriting = (response) => {
        updateState("", "", "", null, null,
            false, false, false,
            false, false, false,
            false, response)
    }

    const changeModalStateCreate = (isModalCreateShowed) => {
        updateState("", "", "", null, null,
            isModalCreateShowed, false, false,
            false, false, false,
            false, false)
    };

    const changeModalStateUpdate = (isModalUpdateShowed, editBoardId, editBoardName) => {
        updateState("", editBoardName, "", editBoardId, null,
            false, isModalUpdateShowed, false,
            false, false, false,
            false, false)
    };

    const showModalCreate = () => {
        changeModalStateCreate(true)
    };

    const hideModalCreate = () => {
        changeModalStateCreate(false)
    };

    const showModalUpdate = (editBoardId, editBoardName) => {
        changeModalStateUpdate(true, editBoardId, editBoardName);
        setValue("editBoardName", editBoardName);
        setValue("editBoardUsername", "");
    };

    const hideModalUpdate = () => {
        changeModalStateUpdate(false)
    };

    const changeModalStateConfirmBoardDeletion = (isModalConfirmBoardDeletionShowed, deleteBoardId) => {
        updateState("", "", "", null, deleteBoardId,
            false, false,
            isModalConfirmBoardDeletionShowed, false, false,
            false, false, false)
    };

    const changeModalStateConfirmAccountDeletion = (isModalConfirmAccountDeletionShowed) => {
        updateState("", "", "", null, null,
            false, false, false,
            isModalConfirmAccountDeletionShowed, false, false,
            false, false)
    };

    const showModalConfirmBoardDeletion = (boardId) => {
        changeModalStateConfirmBoardDeletion(true, boardId)
    };

    const hideModalConfirmBoardDeletion = () => {
        changeModalStateConfirmBoardDeletion(false, null)
    };

    const showModalConfirmAccountDeletion = () => {
        changeModalStateConfirmAccountDeletion(true);
    };

    const hideModalConfirmAccountDeletion = () => {
        changeModalStateConfirmAccountDeletion(false)
    };

    const setStateSnackbarUserAddingSuccessful = (snackbarState) => {
        setIsSnackbarUserAddingSuccessful(snackbarState);
    }

    const setStateSnackbarUserRemovingSuccessful = (snackbarState) => {
        setIsSnackbarUserRemovingSuccessful(snackbarState)
    }

    const setStateSnackbarUserNotFound = (snackbarState) => {
        setIsSnackbarUserNotFoundShowed(snackbarState);
    };

    const saveBoard = (formData) => {
        console.log("firing");
        if (!formData.newBoardName || formData.newBoardName.length === 0) {
            alert("Please enter board name.");
            return
        }
        BoardService.saveBoard({
            boardName: formData.newBoardName,
            username: AuthService.getUsername()
        }).then(response => {
            if (response.status === 201) {
                updateStateAfterWriting(response.data)
            }
        }).catch(error => {
            if (error.response.status === 401) {
                localStorage.clear(); // Prevent infinite loop
                navigate("/");
            }
        });
    }

    const updateBoard = (formData) => {
        if (!formData.editBoardName || formData.editBoardName.length === 0) {
            alert("Please enter board name.");
            return
        }
        BoardService.updateBoard({
            boardId: editBoardId,
            boardName: formData.editBoardName,
            username: AuthService.getUsername()
        }).then(response => {
            if (response.status === 200) {
                updateStateAfterWriting(response.data)
            }
        }).catch(error => {
            if (error.response.status === 401) {
                localStorage.clear(); // Prevent infinite loop
                navigate("/");
            }
        });
    }

    const addUserToBoard = (formData) => {
        if (!formData.editBoardUsername || formData.editBoardUsername.length === 0) {
            alert("Please enter username.");
            return
        }
        BoardService.addUserToBoard({
            boardId: editBoardId,
            username: formData.editBoardUsername
        }).then(response => {
            if (response.status === 200) {
                setStateSnackbarUserAddingSuccessful(true);
            }
        }).catch(error => {
            if (error.response.status === 401) {
                localStorage.clear(); // Prevent infinite loop
                navigate("/");
            } else if (error.response.status === 404) {
                setStateSnackbarUserNotFound(true);
            }
        });
    };

    const removeUserFromBoard = (formData) => {
        if (!formData.editBoardUsername || formData.editBoardUsername.length === 0) {
            alert("Please enter username.");
            return
        }
        BoardService.removeUserFromBoard({
            boardId: editBoardId,
            username: formData.editBoardUsername
        }).then(response => {
            if (response.status === 200) {
                setStateSnackbarUserRemovingSuccessful(true);
            }
        }).catch(error => {
            if (error.response.status === 401) {
                localStorage.clear(); // Prevent infinite loop
                navigate("/");
            } else if (error.response.status === 404) {
                setStateSnackbarUserNotFound(true);
            }
        });
    };

    const deleteBoard = (boardId) => {
        BoardService.deleteBoard({
            boardId: boardId,
            username: AuthService.getUsername()
        }).then(response => {
            if (response.status === 200) {
                updateStateAfterWriting(response.data)
            }
        }).catch(error => {
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


    if (typeof boards[0] == "undefined") {
        return (
            <React.Fragment>
                <NavBar create={showModalCreate} logout={logout}
                    deleteAccount={showModalConfirmAccountDeletion} />
                <Modal onHide={hideModalCreate} show={isModalCreateShowed} size="sm"
                    aria-labelledby="contained-modal-title-vcenter" centered>
                    <form className="form" onSubmit={handleSubmitSave(saveBoard)}>
                        <Modal.Body>
                            <Input
                                type="text"
                                name="newBoardName"
                                placeholder="Enter board name..."
                                inputProps={{ "aria-label": "description" }}
                                {...registerSave("newBoardName", { required: true })}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" type="submit">Submit</Button>
                            <Button variant="secondary" onClick={hideModalCreate}>Close</Button>
                        </Modal.Footer>
                    </form>
                </Modal>
                <ConfirmDialog open={isModalConfirmAccountDeletionShowed}
                    onClose={hideModalConfirmAccountDeletion}
                    DialogTitleProp={"Account deletion"}
                    DialogContentProp={`This account, and all of the data associated with it, will be deleted. 
                               This action is irreversible. Are you sure you want to proceed?`}
                    onClickCancel={hideModalConfirmAccountDeletion}
                    onClickConfirm={deleteAccount} />
            </React.Fragment>
        )
    }
    return (
        <main>
            <NavBar create={showModalCreate} logout={logout}
                deleteAccount={showModalConfirmAccountDeletion} />
            <Container>
                {
                    boards.map((board) => {
                        const { id, name } = board
                        const toProps = {
                            pathname: "/board/" + id
                        };
                        return (
                            <Board key={id}>
                                <Link to={toProps}>
                                    {name}
                                </Link>
                                <Icon style={{ marginLeft: 8, cursor: "pointer" }}
                                    onClick={() => showModalUpdate(id, name)}>edit</Icon>
                                <Icon style={{ marginLeft: 8, cursor: "pointer" }}
                                    onClick={() => showModalConfirmBoardDeletion(id)}>delete</Icon>
                            </Board>
                        )
                    })
                }
            </Container>
            <Modal onHide={hideModalCreate} show={isModalCreateShowed} size="sm"
                aria-labelledby="contained-modal-title-vcenter" centered>
                <form className="form" onSubmit={handleSubmitSave(saveBoard)}>
                    <Modal.Body style={{ width: "600px" }}>
                        <Input
                            type="text"
                            name="newBoardName"
                            placeholder="Enter board name..."
                            inputProps={{ "aria-label": "description" }}
                            {...registerSave("newBoardName", { required: true })}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">Submit</Button>
                        <Button variant="secondary" onClick={hideModalCreate}>Close</Button>
                    </Modal.Footer>
                </form>
            </Modal>
            <Modal onHide={hideModalUpdate} show={isModalUpdateShowed}
                aria-labelledby="contained-modal-title-vcenter" centered>
                <form className="form" onSubmit={handleSubmitEdit(updateBoard)}>
                    <Modal.Body style={{ width: "600px" }}>
                        <Input
                            type="text"
                            name="editBoardName"
                            placeholder="Enter board name..."
                            inputProps={{ "aria-label": "description" }}
                            {...registerEdit("editBoardName", { required: true })}
                        />
                        <br />
                        <Input
                            type="text"
                            name="editBoardUsername"
                            placeholder="Enter username to add to the board..."
                            inputProps={{ "aria-label": "description", maxLength: 30 }}
                            style={{ width: "18.750em" }}
                            {...registerEdit("editBoardUsername")}
                        />
                        <Button style={{ marginLeft: "10px", marginRight: "10px", verticalAlign: "inherit" }}
                            variant="success" onClick={handleSubmitEdit(addUserToBoard)}>ADD</Button>
                        <Button style={{ marginRight: "10px", verticalAlign: "inherit" }} variant="danger"
                            onClick={handleSubmitEdit(removeUserFromBoard)}>REMOVE</Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">Submit</Button>
                        <Button variant="secondary" onClick={hideModalUpdate}>Close</Button>
                    </Modal.Footer>
                </form>
            </Modal>
            <Snackbar
                open={isSnackbarUserAddingSuccessful}
                autoHideDuration={4000}
                onClose={() => setStateSnackbarUserAddingSuccessful(false)}
                message="Adding successful." />
            <Snackbar
                open={isSnackbarUserRemovingSuccessful}
                autoHideDuration={4000}
                onClose={() => setStateSnackbarUserRemovingSuccessful(false)}
                message="Removing successful." />
            <Snackbar
                open={isSnackbarUserNotFoundShowed}
                autoHideDuration={4000}
                onClose={() => setStateSnackbarUserNotFound(false)}
                message="User not found." />
            <ConfirmDialog open={isModalConfirmBoardDeletionShowed}
                onClose={hideModalConfirmBoardDeletion}
                DialogTitleProp={"Board deletion"}
                DialogContentProp={"Are you sure you want to delete this board?"}
                onClickCancel={hideModalConfirmBoardDeletion}
                onClickConfirm={() => deleteBoard(deleteBoardId)} />
            <ConfirmDialog open={isModalConfirmAccountDeletionShowed}
                onClose={hideModalConfirmAccountDeletion}
                DialogTitleProp={"Account deletion"}
                DialogContentProp={`This account, and all of the data associated with it, will be deleted. 
                               This action is irreversible. Are you sure you want to proceed?`}
                onClickCancel={hideModalConfirmAccountDeletion}
                onClickConfirm={deleteAccount} />
        </main >
    )
}
