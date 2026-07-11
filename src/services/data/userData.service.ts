import api from "@/utils/api.util";

export const userData = {
    async getByToken(){
        const res = await api.get(`staff`);
        console.log(res, 'userdata');
        if (res.status !== 200) throw new Error("Failed to fetch user data");
        return res.data;
    },
    // update(id: string, data){
    //
    // }

    async getClockTime(id: string){
        const res = await api.get(`staff/clockTime/${id}`);
        if(res.status !== 200) throw new Error("Failed to fetch clock time");
        return res.data;
    }
}