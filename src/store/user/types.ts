export interface User {
    firstName: string;
    lastName: string;
    role: string;
}

export interface UserStore {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}