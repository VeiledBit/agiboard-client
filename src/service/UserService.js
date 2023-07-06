import axios from "axios";
import AuthService from "./AuthService";
import baseUrl from "../config/url";

const USER_URL = `${baseUrl}/api/users/`;

class UserService {
    saveUser(data) {
        return axios.post(`${USER_URL}saveUser`, data, AuthService.getAuthHeaderEditNoToken());
    }

    deleteUser(data) {
        return axios.delete(`${USER_URL}deleteUser`, { data, headers: AuthService.getAuthHeaderDelete() });
    }
}

export default new UserService();
