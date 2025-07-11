'use client';

import { Txt } from '@/components/atoms';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState } from 'react';

type Props = {
  options: Record<string, string>;
  onSelectChange?: (selected: Record<string, string>) => void;
};

export default function StoreOption({ options, onSelectChange }: Props) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const updateSelected = (key: string, item: string) => {
    const newSelected = { ...selected, [key]: item };
    setSelected(newSelected);
    onSelectChange?.(newSelected);
  };

  const renderOptionItem = (
    label: string,
    values: string[] | null,
    valueKey: string
  ) => {
    if (!values) return null;

    return (
      <AccordionItem
        key={valueKey}
        value={valueKey}
        className='w-full rounded-[10px] border last:border-b-[1px]'
      >
        <AccordionTrigger className='w-full px-[10px]'>
          <div className='flex w-full justify-between'>
            <Txt size='text-[15px]'>{label}</Txt>
            {selected[valueKey] && (
              <span className='text-textgray text-[13px]'>
                {selected[valueKey]}
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className='pb-0'>
          {values.map((item, idx) => (
            <p
              key={idx}
              className='cursor-pointer border-t px-[15px] py-[12px]'
              onClick={() => {
                updateSelected(valueKey, item);
                setOpenItems((prev) => prev.filter((v) => v !== valueKey));
              }}
            >
              {item}
            </p>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <>
      {Object.keys(options).length > 0 && (
        <Txt size='text-[15px]' weight='font-[500]' className='flex px-[20px]'>
          옵션
        </Txt>
      )}

      <div className='flex w-full flex-col gap-[10px] px-[20px] py-[15px]'>
        <Accordion
          type='multiple'
          value={openItems}
          onValueChange={setOpenItems}
          className='flex flex-col gap-[15px]'
        >
          {Object.entries(options).map(([key, jsonStr]) => {
            let parsed: string[] | null = null;
            try {
              parsed = JSON.parse(jsonStr);
              if (!Array.isArray(parsed)) parsed = null;
            } catch {
              parsed = null;
            }

            return renderOptionItem(key, parsed, key);
          })}
        </Accordion>
      </div>
    </>
  );
}
