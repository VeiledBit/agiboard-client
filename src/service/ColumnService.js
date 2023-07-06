import axios from "axios";
import AuthService from "./AuthService";
import baseUrl from "../config/url";

const COLUMNS_URL = `${baseUrl}/api/columns/`;

class ColumnService {
    getColumnById(id) {
        return axios.get(COLUMNS_URL + id, AuthService.getAuthHeader());
    }

    saveColumn(data) {
        return axios.post(`${COLUMNS_URL}saveColumn`, data, AuthService.getAuthHeaderEdit());
    }

    saveColumnOrder(columnOrder) {
        return axios.put(`${COLUMNS_URL}saveOrder`, columnOrder, AuthService.getAuthHeaderEdit());
    }

    saveCardToColumn(columns) {
        return axios.put(`${COLUMNS_URL}saveCardToColumn`, columns, AuthService.getAuthHeaderEdit());
    }

    updateColumn(data) {
        return axios.put(`${COLUMNS_URL}updateColumn`, data, AuthService.getAuthHeaderEdit());
    }

    deleteColumn(data) {
        return axios.delete(`${COLUMNS_URL}deleteColumn`, { data, headers: AuthService.getAuthHeaderDelete() });
    }
}

export default new ColumnService();
