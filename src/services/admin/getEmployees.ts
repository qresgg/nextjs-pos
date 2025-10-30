import api from "@/utils/api.util";

export async function getEmployees() {
    const res = await api.get("/staff");
    return res.data;
}