import React, { useEffect, useState } from 'react'
import useStore from '../store';
import { useForm } from "@mantine/form"
import { Button, Group, TextInput, useMantineColorScheme } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { PasswordStrength } from './PasswordStrength';
import clsx from 'clsx';
import { BiImages } from 'react-icons/bi';
import { useSignUp } from '../hooks/auth-hook';
import { uploadFile } from '../utils';

const SignUpForm = ({ toast, isSignin, setIsSignin, toggle, setFormClose }) => {
    const { colorScheme } = useMantineColorScheme();
    // const theme = colorScheme === "light";
    const theme = colorScheme === "dark";
    const { signIn } = useStore();
    const [file, setFile] = useState("");
    const { mutate } = useSignUp(toast, toggle);


    const [strength, setStrength] = useState(0);
    const [fileURL, setFileURL] = useState("")
    const [passValue, setPassValue] = useInputState("")
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            email: "",
            firstName: "",
            lastName: "",
        },
        validate: {
            firstName: (value) => value.length < 3 ? "First Name is too short" : null,
            lastName: (value) => value.length < 2 ? "Last Name is too short" : null,
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "invalid email"),
        }
    })

    useEffect(() => {
        file && uploadFile(setFileURL, file)
    }, [file]);

    const handleSubmit = async (values) => {
        if (!isSignin && strength < 90) return;
        setFormClose(true);
        console.log(values);

        const res = mutate({
            ...values,
            password: passValue,
            image: fileURL,
            accountType: "Writer"
        })

    }


    return (
        <form onSubmit={form.onSubmit(handleSubmit)} className='flex flex-col gap-3'>
            <div className='w-full flex gap-2'>
                <TextInput className='w-full' withAsterisk label="first Name" placeholder='First Name' {...form.getInputProps("firstName")}/>
                <TextInput className='w-full' withAsterisk label="last Name" placeholder='Last Name' {...form.getInputProps("lastName")}/>
            </div>

            <TextInput withAsterisk label="Email Address" placeholder='youremail@email.com' {...form.getInputProps("email")}/>
            <PasswordStrength value={passValue} setValue={setPassValue} setStrength={setStrength} isSignin={false}/>

            <Group className='w-full flex justify-between  ' mt="md">
                <div className='flex flex-col items-center justify-between'>
                    <label htmlFor='imgUpload' className={clsx("flex items-center gap-1 text-base cursor-pointer", theme ? "text-gray-500" : "text-gray-700")}>
                        <input type='file' onChange={(e) => setFile(e.target.files[0])} className='hidden' id='imgUpload' data-max-size='5120' accept='.jpg, .png, .jpeg'/>
                        <BiImages/>
                        <span>Picture</span>
                    </label>
                </div>

                <Button type='submit' className={clsx(theme ? "bg-blue-600" : "bg-black")}>
                    Submit
                </Button>
            </Group>

            <p className='text-sm'>
                {isSignin ? "Dont't have an account?" : "Already has an account?"}
                <span className='underline text-blue-600 ml-1 cursor-pointer' onClick={() => setIsSignin((prev) => !prev)}>
                    {isSignin ? "Sign up" : "Sign in"}
                </span>
            </p>
        </form>
    )


}

export default SignUpForm