import { TextFieldData } from '@/app/types'
import { changeTextField } from '@/store/presentationSlice'
import { useAppDispatch } from '@/store/store'
import { ChangeEvent, FC, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import styles from './index.module.css'

type TextFieldProps = {
    data: TextFieldData
}

const TextField: FC<TextFieldProps> = ({data}) => {
    const dispatch = useAppDispatch();
    const [cursor, setCursor] = useState('auto');
    const onStart = () => {
        setCursor('move');
    };
    
    const onStop = (event: DraggableEvent, eventData: DraggableData) => {
        setCursor('auto');
        dispatch(changeTextField({
            id: data.id,
            newData: {
                ...data,
                x: eventData.x,
                y: eventData.y
            }
        }))
    };
    const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTextField({
            id: data.id,
            newData: {...data, value: event.target.value}
        }))
    }
    return <Draggable
        bounds='parent'
        onStart={onStart} 
        onStop={onStop}
        defaultPosition={{
            x: data.x,
            y: data.y
        }}
    >
        <input
            style={{cursor}}
            className={styles.input}
            value={data.value}
            onChange={handleChangeInput}
        />
    </Draggable>
}

export default TextField;