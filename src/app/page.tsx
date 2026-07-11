'use client'
import Image from "next/image";
import Page from "@/app/auth/page";
import {useUserStore} from "@/store/user/useUserStore";
import Timesheet from "@/app/timesheet/page";
import {useEffect} from "react";

export default function Home() {
    const { user, fetchUser } = useUserStore();
    useEffect(() => {
        fetchUser();
    }, []);
    return (
        <>
            {
                user ? ( <Timesheet /> ) : ( <Page />)
            }
        </>
  );
}