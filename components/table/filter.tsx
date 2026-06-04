import { cn } from '@/lib/utils';
import React from 'react'
import { Button } from '../ui/button';
import { Combobox } from '../ui/combobox';
import { Input } from '../ui/input';
import { Filter, FilterX, X } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface BaseFilter {
    label: string;
    name?: string;
    placeholder?: string;
}
interface FilterCheckbox extends BaseFilter {
    type: "checkbox";
}
interface FilterText extends BaseFilter {
    type: "text";
}
interface FilterCombobox extends BaseFilter {
    type: "combobox";
    options: { value: string; label: string }[];
}
interface FilterNumber extends BaseFilter {
    type: "number";
}
interface FilterDate extends BaseFilter {
    type: "date";
}

interface Props {
    filters: { [key: string]: string | number | boolean };
    setFilters: React.Dispatch<React.SetStateAction<{ [key: string]: string | number | boolean }>>;
    filterOptions?: FilterOption[];
    className?: string;
    enterLabel?: string;
    disableEnter?: boolean;
    resetLabel?: string;
    defaultFilters?: { [key: string]: string | number | boolean };
}

export type FilterOption = FilterText | FilterCheckbox | FilterCombobox | FilterNumber | FilterDate;

const TableFilter = ({ filters, setFilters, filterOptions, className, enterLabel, disableEnter, resetLabel, defaultFilters }: Props) => {
    const [expand, setExpand] = React.useState<boolean>(false);
    const { t } = useLanguage();

    const updateFieldValue = (fieldName: string, value: string | number | boolean) => {
        setFilters((prev) => {
            const next = { ...prev };

            if (value === '' || value === false || value === undefined || value === null) {
                delete next[fieldName];
                return next;
            }

            next[fieldName] = value;
            return next;
        });
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }

    const resetFilters = () => {
        setFilters(defaultFilters || {});
    }

    return (
        <div className={cn('p-4 border border-gray-200 rounded-md', expand ? 'h-full' : 'min-h-14',)}>
            <h4 className='text-md font-semibold text-gray-900 dark:text-white mb-4 flex justify-between items-center cursor-pointer' onClick={() => setExpand(!expand)}>
                <span>{t("transactions.search")}</span>
                <span>{expand ? <FilterX size={18} /> : <Filter size={18} />}</span>
            </h4>
            <form className={cn('space-y-2', className, disableEnter && "pointer-events-none opacity-50")} onSubmit={onSubmit} onReset={resetFilters}>
                <div className='flex flex-wrap gap-2 items-end'>
                    {filterOptions?.map(option => {
                        const fieldName = option.name || option.label;
                        const fieldValue = filters[fieldName];
                        const textValue = typeof fieldValue === 'string' || typeof fieldValue === 'number' ? String(fieldValue) : '';
                        const hasValue = fieldValue !== undefined && fieldValue !== null && fieldValue !== '' && fieldValue !== false;

                        return (
                            <div key={fieldName} className='flex flex-col'>
                                <label className='text-sm font-medium text-gray-700 mb-1'>{option.label}</label>
                                {option.type === "text" && (
                                    <div className='relative'>
                                        <Input
                                            type="text"
                                            name={fieldName}
                                            value={textValue}
                                            onChange={(e) => updateFieldValue(fieldName, e.target.value)}
                                            className='border border-gray-300 rounded-md px-2 py-1 pr-8 truncate'
                                            placeholder={option.placeholder || option.label}
                                        />
                                        {hasValue && (
                                            <button
                                                type="button"
                                                onClick={() => updateFieldValue(fieldName, '')}
                                                className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                                aria-label={`Clear ${option.label}`}
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                )}
                                {(option.type === "number" || option.type === "date") && (
                                    <div className='relative'>
                                        <Input
                                            type={option.type}
                                            name={fieldName}
                                            value={textValue}
                                            onChange={(e) => updateFieldValue(fieldName, e.target.value)}
                                            className='border border-gray-300 rounded-md px-2 py-1 pr-8 truncate'
                                        />
                                        {hasValue && (
                                            <button
                                                type="button"
                                                onClick={() => updateFieldValue(fieldName, '')}
                                                className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                                aria-label={`Clear ${option.label}`}
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                )}
                                {option.type === "checkbox" && (
                                    <Input
                                        type="checkbox"
                                        name={fieldName}
                                        checked={Boolean(filters[fieldName])}
                                        onChange={(e) => updateFieldValue(fieldName, e.target.checked)}
                                        className='h-4 w-4 text-blue-600 border-gray-300 rounded truncate'
                                    />
                                )}
                                {option.type === "combobox" && (
                                    <Combobox
                                        options={option.options}
                                        name={fieldName}
                                        value={typeof fieldValue === 'string' ? fieldValue : ''}
                                        onChange={(value) => updateFieldValue(fieldName, value)}
                                        placeholder={option.placeholder || option.label}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className='flex space-x-2'>
                    <Button type="submit" className='h-fit' disabled={disableEnter}>{enterLabel || t("transactions.search")}</Button>
                    <Button type="reset" className='h-fit' disabled={disableEnter}>{resetLabel || t("modal.cancel")}</Button>
                </div>
            </form>
        </div>
    )
}

export default TableFilter
