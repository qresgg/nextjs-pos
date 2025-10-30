"use client"

import React, {useEffect, useState} from "react"
import styles from "./page.module.scss"
import clsx from "clsx"
import usePinManager from "@/hooks/PinManager"
import {login} from "@/services/auth/auth.service";
import {useUserStore} from "@/store/useUserStore";

export default function Auth() {
    const [uniqueNumbers, setUniqueNumbers] = useState<number[]>([])
    const manager = usePinManager(setUniqueNumbers);
    const { setUser } = useUserStore();

    const handleLogin = async (code: number[]) => {
        if (code.length !== 6) return;
        try{
            const response = await login(Number(code.join("")));
            setUser(response.employee)
        } catch (error){
            console.error(error)
        }
    }

    return (
      <div className={styles.main}>
          <div className={clsx(styles.container, "items-center justify-center flex")}>
              <div className={styles.logo}>LOGO</div>
          </div>
          <div className={clsx(styles.container, "items-center justify-center flex")}>
              <div className={styles.panel}>
                  <input
                      type="text"
                      className={styles["uniqueNumbers"]}
                      readOnly
                      value={uniqueNumbers.join("")}
                      maxLength={6}
                  />
                  <div className={styles.keyboard}>
                      {Array.from({ length: 9 }).map((_, index) => (
                          <button
                            key={index}
                            className={styles.key}
                            onClick={() => manager.addWithIndex(index)}
                          >
                            {index + 1}
                          </button>
                      ))}
                      <button className={clsx(styles.key, styles.remove)} onClick={manager.removeLast}> ⌫ </button>
                      <button className={styles.key} onClick={manager.addZero}> 0 </button>
                      <button className={styles.key} onClick={manager.deleteAll}> del </button>
                  </div>
                  <button className={styles.confirm} onClick={() => handleLogin(uniqueNumbers)}>Confirm</button>
              </div>
          </div>
      </div>
  )
}
