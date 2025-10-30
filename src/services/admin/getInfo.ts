import api from "@/utils/api.util";

export async function getData(){
    const res = await api.get("/staff")
    return res.data;
}