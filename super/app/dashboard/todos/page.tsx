'use client'
import TasksMainPage from './task';


export default function page() {
  return (
    <>
      <div className="h-full flex-1 flex-col px-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Todos</h2>
          </div>
        </div>

        <TasksMainPage />

      </div>
    </>
  );
}
