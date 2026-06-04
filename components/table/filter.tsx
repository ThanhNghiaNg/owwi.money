import { cn } from '@/lib/utils';
import React from 'react'
import { Button } from '../ui/button';
import { Combobox } from '../ui/combobox';
import { Input } from '../ui/input';
import { CalendarIcon, Filter, FilterX, X } from 'lucide-react';
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
interface FilterDateRange extends BaseFilter {
    type: "date-range";
    startName: string;
    endName: string;
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

export type FilterOption = FilterText | FilterCheckbox | FilterCombobox | FilterNumber | FilterDate | FilterDateRange;

const TableFilter = ({ filters, setFilters, filterOptions, className, enterLabel, disableEnter, resetLabel, defaultFilters }: Props) => {
    const [expand, setExpand] = React.useState<boolean>(false);
    const [openDateRange, setOpenDateRange] = React.useState<string>("");
    const dateRangeRef = React.useRef<HTMLDivElement | null>(null);
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

    const updateDateRangeValue = (startName: string, endName: string, fieldName: string, value: string) => {
        setFilters((prev) => {
            const next = { ...prev };

            if (!value) {
                delete next[fieldName];
                return next;
            }

            next[fieldName] = value;

            const startValue = String(next[startName] || '');
            const endValue = String(next[endName] || '');

            if (startValue && endValue && startValue > endValue) {
                if (fieldName === startName) {
                    next[endName] = startValue;
                } else {
                    next[startName] = endValue;
                }
            }

            return next;
        });
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }

    const resetFilters = () => {
        setFilters(defaultFilters || {});
    }

    const formatDateInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const formatDateLabel = (value?: string | number | boolean) => {
        if (typeof value !== 'string' || !value) return '';
        const [year, month, day] = value.split('-');
        if (!year || !month || !day) return value;
        return `${day}/${month}/${year}`;
    }

    React.useEffect(() => {
        if (!openDateRange) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!dateRangeRef.current?.contains(event.target as Node)) {
                setOpenDateRange("");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDateRange]);

    return (
        <div className='p-4 border border-gray-200 rounded-md'>
            <h4 className='text-md font-semibold text-gray-900 dark:text-white mb-4 flex justify-between items-center cursor-pointer' onClick={() => setExpand(!expand)}>
                <span>{t("transactions.search")}</span>
                <span>{expand ? <FilterX size={18} /> : <Filter size={18} />}</span>
            </h4>
            {expand && (
            <form className={cn('space-y-2', className, disableEnter && "pointer-events-none opacity-50")} onSubmit={onSubmit} onReset={resetFilters}>
                <div className='flex flex-wrap gap-2 items-end'>
                    {filterOptions?.map(option => {
                        const fieldName = option.type === 'date-range' ? `${option.startName}-${option.endName}` : option.name || option.label;
                        const fieldValue = option.type === 'date-range' ? undefined : filters[fieldName];
                        const textValue = typeof fieldValue === 'string' || typeof fieldValue === 'number' ? String(fieldValue) : '';
                        const hasValue = fieldValue !== undefined && fieldValue !== null && fieldValue !== '' && fieldValue !== false;

                        return (
                            <div key={fieldName} className='flex flex-col'>
                                <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{option.label}</label>

                                {option.type === "date-range" && (
                                    <div className="relative" ref={dateRangeRef}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setOpenDateRange(openDateRange === fieldName ? "" : fieldName)}
                                            className="justify-start gap-2 border border-gray-300 px-3 py-2 text-left font-normal min-w-[260px]"
                                        >
                                            <CalendarIcon size={16} />
                                            <span>
                                                {filters[option.startName] && filters[option.endName]
                                                    ? `${formatDateLabel(filters[option.startName])} - ${formatDateLabel(filters[option.endName])}`
                                                    : option.placeholder || option.label}
                                            </span>
                                        </Button>
                                        {openDateRange === fieldName && (
                                            <div className="absolute left-0 top-full z-40 mt-2 w-[280px] rounded-md border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                                                <div className="grid gap-3">
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">{t("transactions.startDate")}</label>
                                                        <Input
                                                            type="date"
                                                            value={typeof filters[option.startName] === 'string' ? String(filters[option.startName]) : ''}
                                                            max={typeof filters[option.endName] === 'string' ? String(filters[option.endName]) : undefined}
                                                            onChange={(e) => updateDateRangeValue(option.startName, option.endName, option.startName, e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">{t("transactions.endDate")}</label>
                                                        <Input
                                                            type="date"
                                                            value={typeof filters[option.endName] === 'string' ? String(filters[option.endName]) : ''}
                                                            min={typeof filters[option.startName] === 'string' ? String(filters[option.startName]) : undefined}
                                                            onChange={(e) => updateDateRangeValue(option.startName, option.endName, option.endName, e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
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
            )}
        </div>
    )
}

export default TableFilter
