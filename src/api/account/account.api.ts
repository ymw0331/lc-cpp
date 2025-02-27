import resellerAxios from "../config/reseller.config";
import { API_ENDPOINTS } from "../config/endpoints";

export const accountApi = {
    getAccountData: async () => {
        const response = await resellerAxios.get(API_ENDPOINTS.RESELLER.ACCOUNT);
        return response.data;
    }
}
