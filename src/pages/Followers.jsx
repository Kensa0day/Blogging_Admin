import React, {useEffect, useState} from 'react'
import {Button, Flex, Menu, Pagination, Paper, PinInput, Table, useMantineColorScheme} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import { Toaster, toast } from 'sonner';
import {AiOutlineEye, AiOutlineSetting} from "react-icons/ai";
import {MdMessage, MdOutlineDeleteOutline} from "react-icons/md";
import {BiDotsVerticalRounded} from "react-icons/bi";
import ConfirmDialog from '../components/ConfirmDialog';
import useStore from '../store';
import clsx from 'clsx';
import Loading from "../components/Loading";
import { useFollowers } from '../hooks/followers-hook';
import { formatNumber, getInitials, updateURL } from '../utils';
import moment from "moment"

const Followers = () => {

  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = colorScheme === "dark";
  const [visible, { toggle }] = useDisclosure(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useStore()
  const { data, isPending, mutate} = useFollowers(toast, toggle, user?.token)
  
  const [page, setPage] = useState(searchParams.get("page") || 1);

  useEffect(() => {
    const fetchFollowers = () => {
      updateURL({page, navigate, location})
      mutate(page)
    }

    fetchFollowers()
  }, [page])
  return (
    <div className='w-full flex flex-col'>
      <p className={`${theme ? "text-white" : "text-slate-700"} text-lg p-1 font-semibold`}>
        Followers (<span className='text-sm'>{data?.data?.length * data?.page + " of " + data?.total + " records"}</span>)
      </p>

      <Table highlightOnHover withTableBorder className='flex-1'>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Account</Table.Th>
            <Table.Th>Followers</Table.Th>
            <Table.Th>Joined Data</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
        {data?.data?.map(({ _id, followerId, createdAt }) => (
  <Table.Tr key={_id} className={theme ? "text-gray-400" : "text-slate-600"}>
    <Table.Td>
      {typeof followerId === 'object' ? (
        followerId?.image ? (
          <img src={followerId.image} alt={followerId.name} className='w-10 h-10 rounded-full object-cover' />
        ) : (
          <p className='w-10 h-10 rounded-full flex items-center justify-center bg-indigo-700 text-white'>
            {getInitials(followerId?.name || "Unknown")}
          </p>
        )
      ) : (
        <p>Follower data unavailable</p>
      )}
    </Table.Td>
    <Table.Td>{followerId?.accountType || "Unknown"}</Table.Td>
    <Table.Td>{moment(createdAt).fromNow()}</Table.Td>
  </Table.Tr>
))}
          
        </Table.Tbody>

        {data?.data?.length < 1 && (
          <Table.Caption>No Data Found</Table.Caption>
        )}

      </Table>

      <div className='w-full mt-5 flex items-center justify-center'>
        <Pagination total={data?.numOfPages} siblings={1} defaultValue={data?.page} withEdges onChange={(value) => setPage(value)}/>
      </div>


      <Loading visible={isPending}/>
      <Toaster richColors/>
    </div>
  )
}

export default Followers