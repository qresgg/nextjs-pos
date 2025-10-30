import api from "@/utils/api.util";

export const login = async (code: number) => {
    try{
        const res = await api.post("/auth/signin", { code });
        if (res.data.tokens.access_token) {
            localStorage.setItem("accessToken", res.data.tokens.access_token);
        }
        return res.data;
    } catch(error){
        console.log(error);
        throw error;
    }
}