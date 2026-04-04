import { Input } from '@/components/ui/input';
import React from 'react';

export const TimeInput = ({ ...props }: React.ComponentProps<'input'>) => (
  <Input
    type="time"
    step="1"
    {...props}
    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none h-9!"
  />
);
