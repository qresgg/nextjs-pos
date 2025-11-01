'use client'
import {useUserStore} from "@/store/useUserStore";
import styles from "./page.module.scss"

export default function Timesheet () {
    const { user } = useUserStore();
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
            1
        </div>
    </div>
  );
};