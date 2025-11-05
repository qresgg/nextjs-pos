import api from "@/utils/api.util";

export const login = async (code: number) => {
    try{
        const res = await api.post("/auth/signin", { code });
        if (res.data.accessToken) {
            localStorage.setItem("accessToken", res.data.accessToken);
        }
        return res.data;
    } catch(error){
        console.log(error);
        throw error;
    }
}