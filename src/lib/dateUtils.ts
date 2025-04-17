import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export const HONG_KONG_TIMEZONE = 'Asia/Hong_Kong';

export const formatDateWithHKTime = (date: string | Date | null) => {
  if (!date) return { date: '-', time: '-' };
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return {
    date: formatInTimeZone(dateObj, HONG_KONG_TIMEZONE, 'yyyy-MM-dd'),
    time: formatInTimeZone(dateObj, HONG_KONG_TIMEZONE, 'HH:mm:ss') + ' (HK)'
  };
};

export const formatDateOnly = (date: string | Date | null) => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, HONG_KONG_TIMEZONE, 'yyyy-MM-dd');
};

export const formatTimeOnly = (date: string | Date | null) => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, HONG_KONG_TIMEZONE, 'HH:mm:ss') + ' (HK)';
};

export const formatMonthYear = (date: string | Date | null) => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, HONG_KONG_TIMEZONE, 'MMMM yyyy');
};

export const formatDateTimeWithHK = (date: string | Date | null) => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, HONG_KONG_TIMEZONE, 'yyyy-MM-dd HH:mm:ss') + ' (HK)';
};