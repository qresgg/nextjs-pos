import { create } from "zustand";
import {UserStore} from "@/store/user/types";
import {userData} from "@/services/data/userData.service";

function getAccessToken() {
    return localStorage.getItem("access_token");
}
function getUserData(){
    return userData.getByToken();
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    isLoading: false,

    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),

    fetchUser: async () => {
        set({ isLoading: true });
        const user = await userData.getByToken();
        set({ user, isLoading: false });
    },
}))