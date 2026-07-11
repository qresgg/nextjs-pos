"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

import { useUserStore } from "@/store/user/useUserStore";
import { userData } from "@/services/data/userData.service";
import { clockTimeService } from "@/services/data/clockTime.service";
import { FormatDate } from "@/utils/formatDate.util";

import styles from "./page.module.scss";
import {logout} from "@/services/auth/auth.service";

interface ClockTimeEntry {
    id?: string | number;
    date: string;
    clockIn?: {
        time: string;
    } | null;
    clockOut?: {
        time: string;
    } | null;
}

export default function Timesheet() {
    const { user } = useUserStore();

    const [clockTime, setClockTime] = useState<ClockTimeEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        async function fetchClockTimes() {
            try {
                setIsLoading(true);

                const result = await userData.getClockTime(user!.id);

                setClockTime(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error("Failed to fetch clock times:", error);
                setClockTime([]);
            } finally {
                setIsLoading(false);
            }
        }

        void fetchClockTimes();
    }, [user?.id]);

    function getTotalHours(entries: ClockTimeEntry[]): number {
        const total = entries.reduce((sum, entry) => {
            return (
                sum +
                FormatDate.differenceInHours(
                    entry.clockIn?.time,
                    entry.clockOut?.time,
                )
            );
        }, 0);

        return Number(total.toFixed(2));
    }

    async function refreshClockTimes() {
        if (!user?.id) {
            return;
        }

        const result = await userData.getClockTime(user.id);

        setClockTime(Array.isArray(result) ? result : []);
    }

    async function handleClockIn() {
        if (!user?.id) {
            return;
        }

        try {
            await clockTimeService.clockIn(user.id);
            await refreshClockTimes();
        } catch (error) {
            console.error("Clock in failed:", error);
        }
    }

    async function handleClockOut() {
        if (!user?.id) {
            return;
        }

        try {
            await clockTimeService.clockOut(user.id);
            await refreshClockTimes();
        } catch (error) {
            console.error("Clock out failed:", error);
        }
    }

    async function handleLogout() {
        if (!user?.id) return;

        try{
            console.log('result', await logout(user.id))
            localStorage.removeItem("accessToken");
        } catch (error) {
            console.error("Clock out failed:", error);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.clockPage}>
            <div className={styles.leftPanel}>
                <div className={styles.header}>
                    Timesheet
                </div>

                <div className={styles.logo}>
                    <div className={styles.logoImg}>
                        LOGO
                    </div>
                </div>

                <div className={styles.wrapper}>
                    <div className={styles.container}>
                        <div className={styles.fullName}>
                            {user?.firstName} {user?.lastName}
                        </div>

                        <div className={styles.role}>
                            {user?.role}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.table}>
                    <div className={clsx(styles.row, styles.head)}>
                        <div className={styles.col}>Date</div>
                        <div className={styles.col}>Job</div>
                        <div className={styles.col}>In</div>
                        <div className={styles.col}>Out</div>
                        <div className={styles.col}>Hours</div>
                    </div>

                    {clockTime.map((el, index) => {
                        const date = new FormatDate(el.date);
                        const clockIn = new FormatDate(
                            el.clockIn?.time,
                        );
                        const clockOut = new FormatDate(
                            el.clockOut?.time,
                        );

                        const hours =
                            FormatDate.differenceInHours(
                                el.clockIn?.time,
                                el.clockOut?.time,
                            );

                        return (
                            <div key={el.id ?? index} className={styles.row}>
                                <div className={styles.col}>
                                    {date.dayMonth}
                                </div>

                                <div className={styles.col}>
                                    <div className={styles.role}>
                                        {user?.role}
                                    </div>

                                    <div className={styles.tips}>
                                        Tips: $0.00
                                    </div>
                                </div>

                                <div className={styles.col}>
                                    {el.clockIn ? clockIn.time12 : "—"}
                                </div>

                                <div className={styles.col}>
                                    {el.clockOut ? clockOut.time12 : "—"}
                                </div>

                                <div className={styles.col}>
                                    {el.clockOut
                                        ? hours
                                        : "—"}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.actionPanel}>
                    <div className={styles["actionPanel-header"]}>
                        Total Hours: {getTotalHours(clockTime)}
                    </div>

                    <div className={styles["actionPanel-buttons"]}>
                        <button type="button" className={styles.button} onClick={handleClockIn}>
                            Clock In
                        </button>

                        <button type="button" className={styles.button} onClick={handleClockOut}>
                            Clock Out
                        </button>

                        <button type="button" className={styles.button} onClick={handleLogout}>
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}