"use client";

import React from 'react';
import { FormComponentProps } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

const InfoTooltip: React.FC<{ info: string }> = ({ info }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 ml-2 cursor-help" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{info}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const TextInput: React.FC<FormComponentProps> = ({ id, label, value, onChange, error, info }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={error ? 'border-red-500' : ''}
    />
    {/* {info && <InfoTooltip info={info} />} */}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export const TextareaInput: React.FC<FormComponentProps> = ({ id, label, value, onChange, error, info }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={error ? 'border-red-500' : ''}
    />
    {/* {info && <InfoTooltip info={info} />} */}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export const SelectInput: React.FC<FormComponentProps & { options: { label: string; value: string }[] }> = ({ id, label, value, onChange, error, info, options }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn(error ? 'border-red-500' : '')}>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {/* {info && <InfoTooltip info={info} />} */}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export const CheckboxInput: React.FC<FormComponentProps> = ({ id, label, value, onChange, error, info }) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={id}
      checked={value}
      onCheckedChange={onChange}
    />
    <Label htmlFor={id}>{label}</Label>
    {/* {info && <InfoTooltip info={info} />} */}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export const RadioInput: React.FC<FormComponentProps & { options: { label: string; value: string }[] }> = ({ id, label, value, onChange, error, info, options }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <RadioGroup value={value} onValueChange={onChange}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
          <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
    {/* {info && <InfoTooltip info={info} />} */}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export const DateInput: React.FC<FormComponentProps> = ({ id, label, value, onChange, error, info }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            error && "border-red-500"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    {/* {info && <InfoTooltip info={info} />} */}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export const ImageUpload: React.FC<FormComponentProps> = ({ id, label, value, onChange, error, info }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          onChange(file);
        }
      }}
      className={error ? 'border-red-500' : ''}
    />
    {/* {info && <InfoTooltip info={info} />} */}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);