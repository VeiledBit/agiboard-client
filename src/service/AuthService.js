import axios from "axios";
import baseUrl from "../config/url";

const AUTH_URL = `${baseUrl}/api/token/`;

class AuthService {
    login(credentials) {
        return axios.post(`${AUTH_URL}generate-token`, credentials, { timeout: 4 * 1000 });
    }

    getUserInfo() {
        return JSON.parse(localStorage.getItem("userInfo"));
    }

    getUsername() {
        return this.getUserInfo().username;
    }

    getAuthHeader() {
        return { headers: { Authorization: `Bearer ${this.getUserInfo().token}` } };
    }

    getAuthHeaderEditNoToken() {
        return {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            timeout: 4 * 1000
        };
    }

    getAuthHeaderDelete() {
        return {
            Authorization: `Bearer ${this.getUserInfo().token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
        };
    }

    getAuthHeaderEdit() {
        return {
            headers: {
                Authorization: `Bearer ${this.getUserInfo().token}`,
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        };
    }
}

export default new AuthService();
