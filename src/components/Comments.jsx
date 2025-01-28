import React, {useEffect, useState} from 'react'
import {Button, Menu, Modal, Pagination, Paper, PinInput, Table, useMantineColorScheme} from "@mantine/core";
import useStore from '../store';
import useCommentStore from '../store/commentStore';
import { useComments, useDeleteComments } from '../hooks/post-hook';
import NoProfile from "../assets/profile.png";
import { toast } from 'sonner';

const Comments = () => {
    const { openComment, commentId, setOpen} = useCommentStore();
  
    const { user } = useStore()
    const { data, mutate} = useComments()
    const useDelete = useDeleteComments(user?.token)
    

    const handleClose = () => {
        setOpen(false);
    }

    const handleDelete = (id) => {
        useDelete.mutate({id, postId: commentId})
    }

    useEffect(() => {
        mutate(commentId);
    }, [commentId])

    return (
        <>
            <Modal opened={openComment} onClose={handleClose} title={`Comments (${data?.data?.length})`} centered>
                <div className='w-full h-full pb-6 '>
                    <div className='w-full h-full flex flex-col gap-6 px-2'>
                        {data?.data?.map(({ _id, user, desc, post, createdAt}) => {
                            <div key={_id} className='w-full flex gap-4'>
                                <img src={user?.image || NoProfile} alt='Profile' className='w-18 h-18 rounded-full object-cover'/>
                                <div className='w-full'>
                                    <div className='w-full'>
                                        <div className='w-full justify-between'>
                                            <div className='w-full flex items-center gap-2'>
                                                <p className='text-slate-600 dark:text-gray-400 font-medium'>
                                                    {user.name} 
                                                </p>

                                                <span className='text-slate-700 dark:text-gray-500 text-xs italic'>
                                                    {new Date(createdAt).toDateString()}
                                                </span>
                                            </div>
                                            <span className='text-sm text-red-600 cursor-pointer' onClick={() => handleDelete(_id)}>
                                                Delete
                                            </span>
                                        </div>
                                    </div>
                                    <span className='text-sm to-gray-700 dark:text-gray-500'>{desc}</span>
                                </div>

                            </div>
                        })}

                    </div>

                </div>
            </Modal>
        
        </>
    )
}

export default Comments;