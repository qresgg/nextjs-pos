'use client'
import {useUserStore} from "@/store/user/useUserStore";
import styles from "./page.module.scss"
import clsx from "clsx";
import {useEffect, useState} from "react";
import {userData} from "@/services/data/userData.service";
import {clockTimeService} from "@/services/data/clockTime.service";

export default function Timesheet () {
    const { user } = useUserStore();
    const [clockTime, setClockTime] = useState<any[]>([]);


    useEffect(() => {
        async function fetchClockTimes(){
            try{
                const result = await userData.getClockTime(user?.id);
                setClockTime(result);
                console.log(result);
            } catch (error){
                console.log(error);
            }
        }
        fetchClockTimes();
    }, []);

    function formatTo12HourTime(isoDate: string): string {
        const date = new Date(isoDate);
        if (isNaN(date.getHours())) return "";

        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours ? hours : 12;

        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${hours}:${formattedMinutes} ${ampm}`;
    }

    function getHours(date1: string, date2: string){
        const first = new Date(date1);
        const second = new Date(date2);

        if (isNaN(first.getHours()) || isNaN(second.getHours())) return "";

        return second.getHours() - first.getHours();
    }

    function getTotalHours(clockTime: { clockIn: { time: string}; clockOut: { time: string} }[]): number {
        let total = 0;

        for (const entry of clockTime) {
            if (!entry.clockIn || !entry.clockOut) continue;

            const start = new Date(entry.clockIn.time).getTime();
            const end = new Date(entry.clockOut.time).getTime();

            total += (end - start) / (1000 * 60 * 60);
        }

        return parseFloat(total.toFixed(2));
    }




    return (
    <div className={styles.clockPage}>
        <div className={styles.leftPanel}>
            <div className={styles.header}>Timesheet</div>
            <div className={styles.logo}>
                <div className={styles.logoImg}>
                    LOGO
                </div>
            </div>
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div className={styles.fullName}>{user?.firstName} {user?.lastName}</div>
                    <div className={styles.role}>{user?.role}</div>
                </div>
            </div>
        </div>
        <div className={styles.rightPanel}>
            <div className={styles.table}>
                <div className={clsx(styles["row"], styles['head'])}>
                    <div className={styles.col}>Date</div>
                    <div className={styles.col}>Job</div>
                    <div className={styles.col}>In</div>
                    <div className={styles.col}>Out</div>
                    <div className={styles.col}>Hours</div>
                </div>
                {clockTime.map((el, i) => (
                    <div className={clsx(styles["row"])}>
                        <div className={styles.col}>{i + 1}</div>
                        <div className={styles.col}>
                            <div className={styles.role}>{user?.role}</div>
                            <div className={styles.tips}>Tips: $0.00</div>
                        </div>
                        <div className={styles.col}>{formatTo12HourTime(el.clockIn.time)}</div>
                        <div className={styles.col}>{formatTo12HourTime(el?.clockOut?.time)}</div>
                        <div className={styles.col}>{getHours(el.clockIn.time, el.clockOut?.time)}</div>
                    </div>
                ))}
            </div>
            <div className={styles.actionPanel}>
                <div className={styles['actionPanel-header']}>
                    Total Hours: {getTotalHours(clockTime)}
                </div>
                <div className={styles['actionPanel-buttons']}>
                    <div className={clsx(styles['button'])} onClick={() => clockTimeService.clockIn(user?.id)}>Clock In</div>
                        <div className={clsx(styles['button'])} onClick={() => clockTimeService.clockOut(user?.id)}>Clock Out</div>
                    <div className={clsx(styles['button'])}>Done</div>
                </div>
            </div>
        </div>
    </div>
  );
};