'use client'
import Image from "next/image";
import Auth from "@/app/auth/page";
import {useUserStore} from "@/store/useUserStore";
import Timesheet from "@/app/timesheet/page";
import {useEffect} from "react";

export default function Home() {
    const { user } = useUserStore();
    useEffect(() => {
        console.log(user);
    }, [user])
    return (
        <>
            {
                user ? ( <Timesheet /> ) : ( <Auth />)
            }
        </>
  );
}