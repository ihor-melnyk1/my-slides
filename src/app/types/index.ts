import type fonts from '@/styles/fonts';

export interface SlideData {
  textFields: TextFieldData[]
  images: ImageData[]
  backgroundColor: string
  backgroundImage: string | null
}

export const borderStyleValues =
['hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'] as const;

export const presentationTopicValues =
['Business', 'Geography', 'Politics', 'Science', 'Other'] as const;

export interface TextFieldData {
  id: string
  value: string
  percentX: number
  percentY: number
  percentWidth: number
  percentHeight: number
  fontFamily: keyof typeof fonts
  fontSize: number
  percentFontSize: number | null
  fontWeight: 'normal' | 'bold'
  fontStyle: 'normal' | 'italic'
  backgroundColor: string
  color: string
  borderWidth: number
  borderColor: string
  borderStyle: typeof borderStyleValues[number]
}

export interface ImageData {
  id: string
  src: string
  name: string
  percentX: number
  percentY: number
  percentWidth: number | null
  percentHeight: number | null
  defaultWidth: number
  defaultHeight: number
}

export interface Dimensions {
  width: number
  height: number
}

export interface PublicPresentation {
  id: string
  author: {
    id: string
    name: string
    email: string
  }
  slides: SlideData[]
  name: string
  topic: typeof presentationTopicValues[number]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  likedUsers: string[]
}

export interface UserPresentation extends Omit<PublicPresentation, 'author'> {
  author: string
}
