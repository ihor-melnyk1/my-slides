import { SlideData } from '@/app/types'
import { FC, useState } from 'react'
import TextField from '../TextField'
import styles from './index.module.css'
import { BaseEditor, createEditor, Descendant } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
    interface CustomTypes {
      Editor: BaseEditor & ReactEditor
      Element: CustomElement
      Text: CustomText
    }
}

type SlideProps = {
    slideData: SlideData
}
const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
]

const Slide:FC<SlideProps> = ({slideData}) =>{
    const [editor] = useState(() => withReact(createEditor()))
  return (
    <div className={styles.wrapper} >
        {slideData.textFields?.map((field,index) => <TextField data={field} key={index}/>)}
        <Slate editor={editor} value={initialValue} >
            <Editable
                onKeyDown={event => {
                    console.log(event.key)
                  }}
            />
        </Slate>
    </div>
  )
}

export default Slide;