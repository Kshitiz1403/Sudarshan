import { useDispatch, useSelector } from "react-redux"
import { getAuthenticatedAxios } from "./baseConfig";

const useDustbinService = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);

    const scan = async (data) => {
        try {
            const authenticatedAxios = getAuthenticatedAxios('/dustbins', token)
            const response = await authenticatedAxios.post('/scan', data);
            return response;
        } catch (error) {

        }
    }
    return { scan }
}

export default useDustbinService;