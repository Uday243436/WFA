import dayjs from 'dayjs';

export const getCurrentDate = () => dayjs();

export const getTodayInputValue = () => getCurrentDate().format('YYYY-MM-DD');
