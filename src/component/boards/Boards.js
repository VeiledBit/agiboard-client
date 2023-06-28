import React from "react"
import styled from "styled-components"
import BoardService from "../../service/BoardService";
import AuthService from "../../service/AuthService";
import NavBar from "../navBar/NavBar";
import ConfirmDialog from "../confirmDialog/ConfirmDialog";
import UserService from "../../service/UserService";
import "react-bootstrap";
import {Link} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Icon, Input} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";

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

class Boards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boards: [],
            newBoardName: "",
            editBoardName: "",
            editBoardUsername: "",
            editBoardId: null,
            deleteBoardId: null,
            isModalCreateShowed: false,
            isModalUpdateShowed: false,
            isModalConfirmBoardDeletionShowed: false,
            isModalConfirmAccountDeletionShowed: false,
            isSnackbarUserNotFoundShowed: false,
            isSnackbarUserAddingSuccessful: false,
            isSnackbarUserRemovingSuccessful: false
        };
    }

    componentDidMount() {
        BoardService.fetchBoards(AuthService.getUsername()).then(response => {
            if (response.status === 200) {
                this.setState({
                    boards: response.data,
                });
            }
        }).catch(error => {
            if (error.response.status === 401) {
                localStorage.clear(); // Prevent infinite loop
                this.props.history.push("");
            }
        });
    }

    updateState = (newBoardName, editBoardName, editBoardUsername, editBoardId, deleteBoardId,
                   isModalCreateShowed, isModalUpdateShowed,
                   isModalConfirmBoardDeletionShowed, isModalConfirmAccountDeletionShowed,
                   isSnackbarUserNotFoundShowed, isSnackbarUserAddingSuccessful,
                   isSnackbarUserRemovingSuccessful, response) => {
        this.setState(prevState => {
            return {
                boards: response ? response : prevState.boards,
                newBoardName: newBoardName,
                editBoardName: editBoardName,
                editBoardUsername: editBoardUsername,
                editBoardId: editBoardId,
                deleteBoardId: deleteBoardId,
                isModalCreateShowed: isModalCreateShowed,
                isModalUpdateShowed: isModalUpdateShowed,
                isModalConfirmBoardDeletionShowed: isModalConfirmBoardDeletionShowed,
                isModalConfirmAccountDeletionShowed: isModalConfirmAccountDeletionShowed,
                isSnackbarUserNotFoundShowed: isSnackbarUserNotFoundShowed,
                isSnackbarUserAddingSuccessful: isSnackbarUserAddingSuccessful,
                isSnackbarUserRemovingSuccessful: isSnackbarUserRemovingSuccessful
            }
        });
    }

    updateStateAfterWriting = (response) => {
        this.updateState("", "", "", null, null,
            false, false, false,
            false, false, false,
            false, response)
    }

    changeModalStateCreate = (isModalCreateShowed) => {
        this.updateState("", "", "", null, null,
            isModalCreateShowed, false, false,
            false, false, false,
            false, false)
    };

    changeModalStateUpdate = (isModalUpdateShowed, editBoardId, editBoardName) => {
        this.updateState("", editBoardName, "", editBoardId, null,
            false, isModalUpdateShowed, false,
            false, false, false,
            false, false)
    };

    showModalCreate = () => {
        this.changeModalStateCreate(true)
    };

    hideModalCreate = () => {
        this.changeModalStateCreate(false)
    };

    showModalUpdate = (editBoardId, editBoardName) => {
        this.changeModalStateUpdate(true, editBoardId, editBoardName);
    };

    hideModalUpdate = () => {
        this.changeModalStateUpdate(false)
    };

    changeModalStateConfirmBoardDeletion = (isModalConfirmBoardDeletionShowed, deleteBoardId) => {
        this.updateState("", "", "", null, deleteBoardId,
            false, false,
            isModalConfirmBoardDeletionShowed, false, false,
            false, false, false)
    };

    changeModalStateConfirmAccountDeletion = (isModalConfirmAccountDeletionShowed) => {
        this.updateState("", "", "", null, null,
            false, false, false,
            isModalConfirmAccountDeletionShowed, false, false,
            false, false)
    };

    showModalConfirmBoardDeletion = (boardId) => {
        this.changeModalStateConfirmBoardDeletion(true, boardId)
    };

    hideModalConfirmBoardDeletion = () => {
        this.changeModalStateConfirmBoardDeletion(false, null)
    };

    showModalConfirmAccountDeletion = () => {
        this.changeModalStateConfirmAccountDeletion(true);
    };

    hideModalConfirmAccountDeletion = () => {
        this.changeModalStateConfirmAccountDeletion(false)
    };

    setStateSnackbarUserAddingSuccessful = (snackbarState) => {
        this.setState(prevState => {
            return {
                ...prevState,
                isSnackbarUserAddingSuccessful: snackbarState
            }
        })
    }

    setStateSnackbarUserRemovingSuccessful(snackbarState) {
        this.setState(prevState => {
            return {
                ...prevState,
                isSnackbarUserRemovingSuccessful: snackbarState
            }
        })
    }

    setStateSnackbarUserNotFound = (snackbarState) => {
        this.setState(prevState => {
            return {
                ...prevState,
                isSnackbarUserNotFoundShowed: snackbarState
            }
        });
    };

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    saveBoard = () => {
        if (!this.state.newBoardName || this.state.newBoardName.length === 0) {
            alert("Please enter board name.");
            return
        }
        BoardService.saveBoard({
            boardName: this.state.newBoardName,
            username: AuthService.getUsername()
        }).then(response => {
            if (response.status === 201) {
                this.updateStateAfterWriting(response.data)
            }
        }).catch(error => {
            if (error.response.status === 401) {
                localStorage.clear(); // Prevent infinite loop
                this.props.history.push("");
            }
        });
    }

    updateBoard = () => {
        if (!this.state.editBoardName || this.state.editBoardName.length === 0) {
            alert("Please enter board name.");
            return
        }
        BoardService.updateBoard({
            boardId: this.state.editBoardId,
            boardName: this.state.editBoardName,
            username: AuthService.getUsername()
        }).then(response => {
            if (response.status === 200) {
                this.updateStateAfterWriting(response.data)
            }
        }).catch(error => {
            if (error.response.status === 401) {
                localStorage.clear(); // Prevent infinite loop
                this.props.history.push("");
            }
        });
    }

    addUserToBoard = () => {
        if (!this.state.editBoardUsername || this.state.editBoardUsername.length === 0) {
            alert("Please enter username.");
            return
        }
        BoardService.addUserToBoard({
            boardId: this.state.editBoardId,
            username: this.state.editBoardUsername
        }).then(response => {
            if (response.status === 200) {
                this.setStateSnackbarUserAddingSuccessful(true);
            }
        }).catch(error => {
            if (error.response.status === 401) {
                localStorage.clear(); // Prevent infinite loop
                this.props.history.push("");
            } else if (error.response.status === 404) {
                this.setStateSnackbarUserNotFound(true);
            }
        });
    };

    removeUserFromBoard = () => {
        if (!this.state.editBoardUsername || this.state.editBoardUsername.length === 0) {
            alert("Please enter username.");
            return
        }
        BoardService.removeUserFromBoard({
            boardId: this.state.editBoardId,
            username: this.state.editBoardUsername
        }).then(response => {
            if (response.status === 200) {
                this.setStateSnackbarUserRemovingSuccessful(true);
            }
        }).catch(error => {
            if (error.response.status === 401) {
                localStorage.clear(); // Prevent infinite loop
                this.props.history.push("");
            } else if (error.response.status === 404) {
                this.setStateSnackbarUserNotFound(true);
            }
        });
    };

    deleteBoard = (boardId) => {
        BoardService.deleteBoard({
            boardId: boardId,
            username: AuthService.getUsername()
        }).then(response => {
            if (response.status === 200) {
                this.updateStateAfterWriting(response.data)
            }
        }).catch(error => {
            if (error.response.status === 401) {
                localStorage.clear(); // Prevent infinite loop
                this.props.history.push("");
            }
        });
    };

    deleteAccount = () => {
        UserService.deleteUser({
            username: AuthService.getUsername()
        }).then(() => {
            localStorage.clear(); // Prevent infinite loop
            this.props.history.push("");
        });
    };

    logout = () => {
        localStorage.removeItem("userInfo");
        this.props.history.push("");
    };

    render() {
        if (typeof this.state.boards[0] == "undefined") {
            return (
                <React.Fragment>
                    <NavBar create={this.showModalCreate} logout={this.logout}
                            deleteAccount={this.showModalConfirmAccountDeletion}/>
                    <Modal onHide={this.hideModalCreate} show={this.state.isModalCreateShowed} size="sm"
                           aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Body>
                            <Input placeholder="Enter board name..."
                                   value={this.state.newBoardName}
                                   name="newBoardName"
                                   inputProps={{"aria-label": "description"}}
                                   onChange={this.handleChange}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.saveBoard}>Submit</Button>
                            <Button variant="secondary" onClick={this.hideModalCreate}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                    <ConfirmDialog open={this.state.isModalConfirmAccountDeletionShowed}
                                   onClose={this.hideModalConfirmAccountDeletion}
                                   DialogTitle={"Account deletion"}
                                   DialogContent={`This account, and all of the data associated with it, will be deleted. 
                               This action is irreversible. Are you sure you want to proceed?`}
                                   onClickCancel={this.hideModalConfirmAccountDeletion}
                                   onClickConfirm={this.deleteAccount}/>
                </React.Fragment>
            )
        }
        return (
            <main>
                <NavBar create={this.showModalCreate} logout={this.logout}
                        deleteAccount={this.showModalConfirmAccountDeletion}/>
                <Container>
                    {
                        this.state.boards.map((board) => {
                            const {id, name} = board
                            const toProps = {
                                pathname: "/board/" + id
                            };
                            return (
                                <Board key={id}>
                                    <Link to={toProps}>
                                        {name}
                                    </Link>
                                    <Icon style={{marginLeft: 8, cursor: "pointer"}}
                                          onClick={() => this.showModalUpdate(id, name)}>edit</Icon>
                                    <Icon style={{marginLeft: 8, cursor: "pointer"}}
                                          onClick={() => this.showModalConfirmBoardDeletion(id)}>delete</Icon>
                                </Board>
                            )
                        })
                    }
                </Container>
                <Modal onHide={this.hideModalCreate} show={this.state.isModalCreateShowed} size="sm"
                       aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Body>
                        <Input placeholder="Enter board name..."
                               value={this.state.newBoardName}
                               name="newBoardName"
                               inputProps={{"aria-label": "description", maxLength: 40}}
                               onChange={this.handleChange}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.saveBoard}>Submit</Button>
                        <Button variant="secondary" onClick={this.hideModalCreate}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal onHide={this.hideModalUpdate} show={this.state.isModalUpdateShowed}
                       aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Body style={{width: "600px"}}>
                        <Input placeholder="Enter board name..."
                               name="editBoardName"
                               value={this.state.editBoardName || ""} // Use || to handle change from controlled to uncontrolled input
                               style={{width: "18.750em"}}
                               inputProps={{"aria-label": "description", maxLength: 40}}
                               onChange={this.handleChange}/>
                        <br/>
                        <Input placeholder="Enter username to add to the board..."
                               name="editBoardUsername"
                               value={this.state.editBoardUsername || ""} // Use || to handle change from controlled to uncontrolled input
                               style={{width: "18.750em"}}
                               inputProps={{"aria-label": "description", maxLength: 30}}
                               onChange={this.handleChange}/>
                        <Button style={{marginLeft: "10px", marginRight: "10px", verticalAlign: "inherit"}}
                                variant="success" onClick={this.addUserToBoard}>ADD</Button>
                        <Button style={{marginRight: "10px", verticalAlign: "inherit"}} variant="danger"
                                onClick={this.removeUserFromBoard}>REMOVE</Button>
                        <br/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.updateBoard}>Submit</Button>
                        <Button variant="secondary" onClick={this.hideModalUpdate}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Snackbar
                    open={this.state.isSnackbarUserAddingSuccessful}
                    autoHideDuration={4000}
                    onClose={() => this.setStateSnackbarUserAddingSuccessful(false)}
                    message="Adding successful."/>
                <Snackbar
                    open={this.state.isSnackbarUserRemovingSuccessful}
                    autoHideDuration={4000}
                    onClose={() => this.setStateSnackbarUserRemovingSuccessful(false)}
                    message="Removing successful."/>
                <Snackbar
                    open={this.state.isSnackbarUserNotFoundShowed}
                    autoHideDuration={4000}
                    onClose={() => this.setStateSnackbarUserNotFound(false)}
                    message="User not found."/>
                <ConfirmDialog open={this.state.isModalConfirmBoardDeletionShowed}
                               onClose={this.hideModalConfirmBoardDeletion}
                               DialogTitle={"Board deletion"}
                               DialogContent={"Are you sure you want to delete this board?"}
                               onClickCancel={this.hideModalConfirmBoardDeletion}
                               onClickConfirm={() => this.deleteBoard(this.state.deleteBoardId)}/>
                <ConfirmDialog open={this.state.isModalConfirmAccountDeletionShowed}
                               onClose={this.hideModalConfirmAccountDeletion}
                               DialogTitle={"Account deletion"}
                               DialogContent={`This account, and all of the data associated with it, will be deleted. 
                               This action is irreversible. Are you sure you want to proceed?`}
                               onClickCancel={this.hideModalConfirmAccountDeletion}
                               onClickConfirm={this.deleteAccount}/>
            </main>
        )
    }
}

export default Boards;
