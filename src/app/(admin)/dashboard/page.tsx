import React from 'react'
import styles from './page.module.scss'
import clsx from 'clsx'
import General from "./components/general/page";
import {getEmployees} from "@/services/admin/getEmployees";

export default async function Dashboard(){
    const employees = await getEmployees();

  return (
    <div> 
      <header className={clsx(styles.header)}>
        <h1>General</h1>
        <h1>Staff</h1>
        <h1>On duty</h1>
      </header>
      <main>
          {employees.map((employee: any, i: number) => <p key={i}>{employee.firstName} {employee.lastName}</p>)}
        <General/>
      </main>
    </div>
  )
}
