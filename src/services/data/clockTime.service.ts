import api from "@/utils/api.util";

export const clockTimeService = {
    async clockIn(id: string){
        try{
            const response = await api.post(`staff/clockIn/${id}`);
            return response.data;
        } catch(error){
            console.error(error);
        }
    },

    async clockOut(id: string){
        try{
            const response = await api.put(`staff/clockOut/${id}`);
            return response.data;
        } catch(error){
            console.error(error);
        }
    }
}