import React, { useEffect } from 'react';
import { useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import { useAnalytics } from '../hooks/post-hook';
import {toast, Toaster} from "sonner";
import Stats from '../components/Stats';
import Graph from '../components/Graph';
import clsx from 'clsx';
import Loading from "../components/Loading"
import { RecentFollowerTable, RecentPostTable } from '../components/Table';

const Dashboard = () => {

  const { colorScheme } = useMantineColorScheme();
  
  const theme = colorScheme === "dark";
  const [visible, { toggle }] = useDisclosure(false);
  const { user } = useStore();

  const navigate = useNavigate();

  const { data, isPending, mutate} = useAnalytics(toast, toggle, user?.token)

  console.log(data)

  useEffect(() => {
    mutate()
  }, [])

  return (
    <div className='w-full'>
      <Stats dt={data}/>

      <div className='w-full py-8'>
        <p className='py-5 text-base font-medium'>
          View Stats for last 28 days
        </p>

        <Graph dt={data?.viewStats}/>
      </div>

      <div className='flex gap-6 flex-col md:flex-row py-6'>
        <div className='w-full md:w-1/3 flex flex-col'>
          <span className={clsx("py-5 text-base font-medium", theme ? "text-white" : "text-slate-600")}>
            Recent Followers
          </span>

          <RecentFollowerTable data={data?.last5Followers} theme={theme}/>
        </div>

        {/* Top Content */}
        <div className='w-full md:w-2/3 flex flex-col'>
          <span className={clsx("py-5 text-base font-medium", theme ? "text-white" : "text-slate-600")}>
            Recent 5 Content
          </span>

          <RecentPostTable data={data?.last5Posts} theme={theme}/>
        </div>
      </div>

      <Loading visible={isPending}/>

      <Toaster richColors/>

      

    </div>

  )

}

export default Dashboard