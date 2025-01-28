import React, { useEffect, useState } from 'react'
import useStore from '../store';
import { useForm } from "@mantine/form"
import { Button, Group, Select, TextInput, useMantineColorScheme } from '@mantine/core';
import { useDisclosure, useInputState } from '@mantine/hooks';
import clsx from 'clsx';
import { createSlug, uploadFile } from '../utils';
import { BiImages } from 'react-icons/bi';
import {Link, RichTextEditor} from "@mantine/tiptap"

import {IconColorPicker} from "@tabler/icons-react";
import {Color} from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import {BubbleMenu, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Loading from '../components/Loading';
import { Toaster, toast } from 'sonner';
import { useCreatePost } from '../hooks/post-hook';

const WritePost = () => {


  const { colorScheme } = useMantineColorScheme();
    // const theme = colorScheme === "light";
  const theme = colorScheme === "dark";
  const [category, setCategory] = useState("NEWS");
  const [visible, {toggle}] = useDisclosure(false);
  const { user } = useStore();
  const [file, setFile] = useState("");
  const { isPending, mutate } = useCreatePost(toast, toggle, user?.token);


  const [fileURL, setFileURL] = useState(null)
  const [title, setTitle] = useState(null)

  let editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "Write Post Here.... "}),
      Link,
      Superscript,
      Subscript,
      Highlight,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"]})
    ],

    content: ""

  });

  const handleSubmit = async () => {
    if (!fileURL || !category || !title) {
      toast.error("All fields are required")
      return;
    }

    const slug = createSlug(title);

    mutate ({
      title, slug, cat: category, img: fileURL, desc: editor.getHTML()
    })

  }

  useEffect(() => {
    file && uploadFile(setFileURL, file)
  }, [file])
  
  return (
    <>
    <RichTextEditor editor={editor}>
      <div className='w-full flex flex-col md:flex-row flex-wrap gap-5 mb-8'>
        <TextInput withAsterisk label='Post Title' className='w-full flex-1' placeholder='Post Title' defaultValue={title} onChange={(e) => setTitle(e.target.value)}/>
        <Select label="Category" defaultValue="News" placeholder='Pick Category' data={["NEWS", "SPORTS", "CODING", "EDUCATION", "FASHION"]} onChange={(val) => setCategory(val)}/>
        <label>
          <input className='hidden' type='file' id='imgUpload' data-max-size='5120' accept='.jpg, .png, .jpeg' onChange={(e) => setFile(e.target.files[0])}/>
            <BiImages/>
            <span>Post Image</span>
        </label>
      </div>

      {editor && (
        <BubbleMenu editor={editor}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Link/>
          </RichTextEditor.ControlsGroup>
        </BubbleMenu>
      )}

      
      <RichTextEditor.Toolbar sticky stickyOffset={20}>
        <RichTextEditor.ColorPicker colors={["#25262b","#868e96","#fa5252","#e64980","#be4bdb","#7950f2","#4c6ef5","#228be6","#15aabf","#12b886","#40c057","#82c91e","#fab005","#fd7e14"]}/>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control interactive={true}>
            <IconColorPicker size='1rem' stroke={1.5}/>
          </RichTextEditor.Control>
          <RichTextEditor.Color color='#F03E3E'/>
          <RichTextEditor.Color color='#704838'/>
          <RichTextEditor.Color color='#1098AD'/>
          <RichTextEditor.Color color='#37B24D'/>
          <RichTextEditor.Color color='#F59F00'/>
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.UnsetColor/>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline/>
          <RichTextEditor.Strikethrough/>
          <RichTextEditor.ClearFormatting/>
          <RichTextEditor.Highlight/>
          <RichTextEditor.Code/>
          <RichTextEditor.CodeBlock/>
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1/>
          <RichTextEditor.H2/>
          <RichTextEditor.H3/>
          <RichTextEditor.H4/>
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote/>
          <RichTextEditor.Hr/>
          <RichTextEditor.BulletList/>
          <RichTextEditor.OrderedList/>
          <RichTextEditor.Subscript/>
          <RichTextEditor.Superscript/>
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link/>
          <RichTextEditor.Unlink/>
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft/>
          <RichTextEditor.AlignCenter/>
          <RichTextEditor.AlignJustify/>
          <RichTextEditor.AlignRight/>
        </RichTextEditor.ControlsGroup>


      </RichTextEditor.Toolbar>

      <RichTextEditor.Content className='py-8'/>
    </RichTextEditor>

    <div className='w-full flex items-center justify-end mt-6'>
      <Button className={theme ? "bg-blue-600" : "bg-black"} onClick={() => handleSubmit()}>
        Submit Post
      </Button>

    </div>
    <Loading visible={isPending}/>
    <Toaster richColors/>
    </>

    

  )
}

export default WritePost