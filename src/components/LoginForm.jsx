import React, { useState } from 'react'
import useStore from '../store';
import { useForm } from "@mantine/form"
import { Button, Group, TextInput, useMantineColorScheme } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { PasswordStrength } from './PasswordStrength';
import clsx from 'clsx';
import { useSignin } from '../hooks/auth-hook';



const LoginForm = ({ toast, isSignin, setIsSignin, toggle, setFormClose }) => {
    const { colorScheme } = useMantineColorScheme();
    // const theme = colorScheme === "light";
    const theme = colorScheme === "dark";
    // const [visible, { toggle }] = useDisclosure(false);
    const { signIn } = useStore();
    const {data, isPending, isSuccess, mutate} = useSignin(toast, toggle)

    const [strength, setStrength] = useState(0);
    const [passValue, setPassValue] = useInputState("")
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            email: ""
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "invalid email"),
        }
    })

    const handleSubmit = async (values) => {
        setFormClose(true)

        mutate({
            ...values,
            password: passValue
        });

        if(isSuccess){
            setFormClose(false)
            setTimeout(() => {
                signIn(data)
                navigate("/dashboard")

            }, 2000)
        }

    }

    return (
    <form onSubmit={form.onSubmit(handleSubmit)} className='flex flex-col gap-4'>
        <TextInput withAsterisk label='Email Address' placeholder='youremail@email.com' {...form.getInputProps("email")}/>
        <PasswordStrength value={passValue} setValue={setPassValue} setStrength={setStrength} isSignin={isSignin}/>
        {/* <PasswordStrength value={passValue} setvalue={setPassValue} setStrength={setStrength} isSignin={isSignin}/> */}
        <Group className={clsx("w-full flex", isSignin ? "justify-end" : "justify-between")} mt='md'>
            <Button className={clsx(theme ? "bg-blue-600" : "bg-black")} type='submit'>
                Submit
            </Button>
        </Group>

        <p className='text-sm'>
            {isSignin ? "Don't have an account?" : "Already has an account"}
            <span className='underline text-blue-600 ml-1 cursor-pointer' onClick={() => setIsSignin((prev) => !prev)}>
                {isSignin ? "Sign up" : "Sign in"}
            </span>

        </p>
    </form>
    )


    // return (
    //     <div>

    //     </div>
    // )

}

export default LoginForm