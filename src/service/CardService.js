import axios from "axios";
import AuthService from "./AuthService";
import {baseUrl} from "../config/url";

const CARDS_URL = baseUrl + "/api/cards/";

class CardService {
    saveCard(data) {
        return axios.post(CARDS_URL + "saveCard", data, AuthService.getAuthHeaderEdit())
    }

    updateCard(data) {
        return axios.put(CARDS_URL + "updateCard", data, AuthService.getAuthHeaderEdit())
    }

    deleteCard(data) {
        return axios.delete(CARDS_URL + "deleteCard", {data: data, headers: AuthService.getAuthHeaderDelete()})
    }
}

export default new CardService();