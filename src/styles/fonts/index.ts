import localFont from 'next/font/local';

export const times = localFont({ src: './times.ttf' });
export const arial = localFont({ src: './arial.ttf' });
export const amatic = localFont({ src: './amatic.ttf' });

const fonts = {
  'Times New Roman': times,
  Arial: arial,
  Amatic: amatic,
};

export default fonts;
