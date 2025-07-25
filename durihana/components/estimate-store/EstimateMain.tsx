'use client';

import { Txt, Search, Button } from '@/components/atoms';
import { StoreCard, ProgressBarButton } from '@/components/estimate-store';
import Filtering from '@/components/filtering/Filtering';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  domesticRegions,
  foreignRegions,
  PriceOption,
} from '@/constants/filtering';
import { Store } from '@/types/Store';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getFilteringOptions } from '@/lib/utils';

type Props = {
  storeList: Store[];
  categoryId?: number;
};

export default function EstimateMain({ storeList, categoryId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortOptionList, setSortOptionList] = useState<PriceOption[]>([]);
  const [items, setItems] = useState<Store[]>(storeList || []);
  const [category, setCategory] = useState(categoryId || 1);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const updateSearchParam = useCallback(
    (keys: string[], values: string[]) => {
      const current = new URLSearchParams(window.location.search);
      keys.forEach((k, i) => current.set(k, values[i]));
      router.push(`?${current.toString()}`);
      router.refresh();
    },
    [router]
  );

  const handlePriceFilter = (price: number, isLast: boolean) => {
    const filteredItems =
      storeList?.filter((item) =>
        isLast ? item.price >= price * 10000 : item.price <= price * 10000
      ) || [];
    setItems(filteredItems);
  };

  useEffect(() => {
    setItems(storeList || []);
    setCategory(categoryId || 1);
  }, [searchParams, storeList, categoryId]);

  useEffect(() => {
    updateSearchParam(['category', 'search'], [category.toString(), '']);
    setSortOptionList(getFilteringOptions(category));
  }, [category, updateSearchParam]);

  const handleSearch = useCallback(
    (query: string) => {
      updateSearchParam(['search'], [query]);
    },
    [updateSearchParam]
  );

  useEffect(() => {
    if (selectedRegions.length > 0) {
      const filteredItems =
        storeList?.filter((item) =>
          selectedRegions.some((region) => item.location.includes(region))
        ) || [];
      setItems(filteredItems);
    } else {
      setItems(storeList || []);
    }
  }, [selectedRegions, storeList]);

  return (
    <div className='relative flex h-dvh flex-col items-center justify-center overflow-hidden'>
      <div className='flex w-full flex-col items-center justify-start'>
        <div className='flex w-full flex-col items-center justify-start gap-[30px] px-[20px] pt-[25px]'>
          <ProgressBarButton
            selectedItem={category}
            setSelectedItem={setCategory}
            progress={true}
          />
          <Search onSearch={handleSearch} />
        </div>
        {(category === 1 || category === 3) && (
          <div className='flex w-full flex-col pt-[20px]'>
            <Filtering
              selectedRegions={selectedRegions}
              setSelectedRegions={setSelectedRegions}
              regions={category === 1 ? domesticRegions : foreignRegions}
            />
          </div>
        )}
        <div className='flex w-full flex-row items-center justify-end px-[20px]'>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='mt-[20px]'>
              <div className='m-0 flex items-center justify-center gap-[-2px] p-0 focus:outline-none'>
                <Txt size='text-[12px]' color='text-textgray'>
                  {sortOptionList.length > 0 ? sortOptionList[0].label : '전체'}
                </Txt>
                <Image
                  src='/asset/icons/down-shevron.svg'
                  alt='DownShevron'
                  width={20}
                  height={20}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='flex min-w-auto flex-col items-end'>
              {sortOptionList.map((option, index) => (
                <DropdownMenuItem
                  key={index}
                  onSelect={() => {
                    if (option.value === 0) {
                      setItems(storeList || []);
                      updateSearchParam(['search'], ['']);
                    } else {
                      handlePriceFilter(
                        option.value,
                        index === sortOptionList.length - 1
                      );
                    }
                  }}
                >
                  <Txt
                    size='text-[12px]'
                    color='text-textgray'
                    align='text-center'
                  >
                    {option.label}
                  </Txt>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='scrollbar-hide flex w-full flex-1 flex-col items-center justify-start gap-[10px] overflow-y-scroll px-[20px] pt-[20px]'>
        {items.map((item, index) => (
          <StoreCard key={index} store={item} />
        ))}
      </div>

      <div className='flex w-full flex-row items-center justify-center bg-transparent px-[20px] pt-[20px] pb-[20px]'>
        <Button
          onClick={() => {
            if (categoryId === 5) {
              router.push('/wedding-bucket?before=estimate');
            } else {
              updateSearchParam(
                ['category', 'search'],
                [(categoryId ? categoryId + 1 : 0).toString(), '']
              );
            }
          }}
        >
          {categoryId === 5 ? '완료' : '다음'}
        </Button>
      </div>
      <button className='bg-mint absolute right-[20px] bottom-[88px] cursor-pointer rounded-full p-[10px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.10)]'>
        <Image
          src='/asset/icons/bucket.svg'
          alt='Bucket'
          width={30}
          height={30}
          onClick={() => {
            router.push('/wedding-bucket');
          }}
        />
      </button>
    </div>
  );
}
