import React from 'react';
import { LocalizationProvider, DateTimePicker, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/ru'

interface ReusableDateTimePickerProps {
  label: string;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  noTime?: boolean;
}

const CustomDateTimePicker: React.FC<ReusableDateTimePickerProps> = ({ label, value, onChange, noTime = false }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
      {noTime ? (
      <DatePicker label={label} value={value} onChange={onChange} />
      ) : (
      <DateTimePicker label={label} value={value} onChange={onChange} />
      )}
    </LocalizationProvider>
  );
};

export default CustomDateTimePicker;