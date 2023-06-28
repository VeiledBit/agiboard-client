import axios from "axios";
import AuthService from "./AuthService";
import {baseUrl} from "../config/url";

const BOARDS_URL = baseUrl + "/api/boards/";

class BoardService {
    fetchBoards(username) {
        return axios.get(BOARDS_URL + `?username=${username}`, AuthService.getAuthHeader())
    }

    saveBoard(data) {
        return axios.post(BOARDS_URL + "saveBoard", data, AuthService.getAuthHeaderEdit())
    }

    updateBoard(data) {
        return axios.put(BOARDS_URL + "updateBoard", data, AuthService.getAuthHeaderEdit())
    }

    addUserToBoard(data) {
        return axios.put(BOARDS_URL + "addUserToBoard", data, AuthService.getAuthHeaderEdit())
    }

    removeUserFromBoard(data) {
        return axios.put(BOARDS_URL + "removeUserFromBoard", data, AuthService.getAuthHeaderEdit())
    }

    deleteBoard(data) {
        return axios.delete(BOARDS_URL + "deleteBoard", {data: data, headers: AuthService.getAuthHeaderDelete()})
    }
}

export default new BoardService();