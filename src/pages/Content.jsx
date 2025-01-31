import React, {useEffect, useState} from 'react'
import {Button, Menu, Pagination, Paper, PinInput, Table, useMantineColorScheme} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import { Toaster, toast } from 'sonner';
import {AiOutlineEye, AiOutlineSetting} from "react-icons/ai";
import {MdMessage, MdOutlineDeleteOutline} from "react-icons/md";
import {BiDotsVerticalRounded} from "react-icons/bi";
import ConfirmDialog from '../components/ConfirmDialog';
import useStore from '../store';
import clsx from 'clsx';
import { useResend, useVerification } from '../hooks/auth-hook';
import Loading from '../components/Loading';
import { useAction, useContent, useDeletePost } from '../hooks/post-hook';
import { formatNumber, updateURL } from '../utils';
import moment from 'moment';
import useCommentStore from '../store/commentStore';
import Comments from '../components/Comments';

const Content = () => {

  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const location = useLocation();
  // const theme = colorScheme === "light";
  const [visible, { toggle }] = useDisclosure(false);
  const [opened, {open, close}] = useDisclosure(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useStore()
  const { data, isPending, mutate} = useContent(toast, toggle, user?.token)
  const useDelete = useDeletePost(toast, user?.token)
  const useActions = useAction(toast, user?.token)
  const {commentId, setCommentId, setOpen} = useCommentStore();
  

  const [selected, setSelected] = useState("");
  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const theme = colorScheme === "dark";

  const fetchContent = async () => {
    updateURL({page, navigate, location});
    mutate(page)
  }

  const handleComment = async (id, size) => {
    if (size > 0) {
      setCommentId(id)
      setOpen(true)
    }

  }

  const handlePerformAction = async (val, id, status) => {
    setSelected(id);
    setType(val);
    setStatus(status);

    open()

  }

  const handleActions = async () => {
    switch (type) {
      case 'delete':
        useDelete.mutate(selected)
        break;
      case 'status':
        useActions.mutate({ id: selected, status })
        break;

    }

    fetchContent()
    close()

  }

  useEffect(() => {
    fetchContent()
  },[page])

  return (
    <>
      <div className='w-full h-full flex flex-col'>
        <p className={clsx("text-lg pb-1 font-semibold", theme ? "text-white" : "text-black")}>
          Contents ({" "}
          <span>
            {data?.data?.length * data?.page + " of " + data?.totalPost + " records"}
          </span>)
        </p>

        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Post Title</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Views</Table.Th>
              <Table.Th>Comments</Table.Th>
              <Table.Th>Post Date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {
              data?.data?.length > 0 && data.data.map((el) => (
                <Table.Tr key={el._id} className={theme ? "to-gray-400" : "to-slate-600"}>
                  <Table.Td className='flex gap-2 items-center'>
                    <img src={el?.img} alt={el?.title} className='w-10 h-10 rounded-full object-cover'/>              
                    <p className='text-base'>{el?.title}</p>
                  </Table.Td>
                  <Table.Td>{el?.cat}</Table.Td>

                  <Table.Td>
                    <div className='flex gap-1 items-center'>
                      <AiOutlineEye size={18}/>
                      {formatNumber(el?.views?.length)}
                    </div>
                  </Table.Td>

                  <Table.Td onClick={() => handleComment(el?._id, el?.comments?.length)}>
                    <div className='flex gap-1 items-center cursor-pointer'>
                      <MdMessage size={18} className='text-slate-500'/>
                      {formatNumber(el?.comments?.length)}
                    </div>
                  </Table.Td>

                  <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>

                  <Table.Td>
                    <span className={`${el?.status ? "bg-green-700 text-white" : "bg-red-700 text-white"} ${colorScheme === "dark" ? "bg-opacity-30" : "bg-opacity-70"} rounded-full font-semibold px-4 py-1.5`}>
                      {el?.status === true ? "Active" : "Disabled"}
                    </span>
                  </Table.Td>

                  <Table.Td width={5}>
                    <Menu transitionProps={{ transition: "rotate-right", duration: 150}} shadow='lg' width={200}>
                      <Menu.Target>
                        <Button>
                          <BiDotsVerticalRounded className={colorScheme === "dark" ? "text-white text-lg" : "text-slate-900 text-lg"}/>
                        </Button>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item leftSection={<AiOutlineSetting/>} onClick={() => handlePerformAction("status", el?._id, !el?.status)}>
                          {el?.status ? "Disable" : "Enable"}
                        </Menu.Item>
                        <Menu.Divider/>
                        <Menu.Label>Danger Zone</Menu.Label>

                        <Menu.Item color='red' leftSection={<MdOutlineDeleteOutline/>} onClick={() => handlePerformAction("delete", el?._id)}>
                          Delete Post
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))
            }
          </Table.Tbody>
        </Table>

        <div className='w-full mt-5 flex items-center justify-center'>
          <Pagination total={data?.numOfPage} siblings={1} defaultChecked={data?.page} withEdges onChange={(value) => setPage(value)}/>
        </div>

        <Loading visible={isPending}/>
        <Toaster richColors/>
      </div>

      <ConfirmDialog message='Are You Sure Want To Perform This Action ?' opened={opened} close={close} handleClick={handleActions}/>

      {/* <Comments/> */}

      {commentId && <Comments/>}
    
    
    </>

  )

}

export default Content