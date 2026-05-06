"use client"

import type React from "react"
import { useState, useRef, useEffect, memo } from "react"
import { X } from "lucide-react"

interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  name?: string
}

export const Combobox = memo(({ options, value, onChange, placeholder = "Search...", name, className = "" }: ComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [valueHidden, setValueHidden] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label)
      setValueHidden(selectedOption.value)
      return
    }

    if (!value) {
      setSearchTerm("")
      setValueHidden("")
    }
  }, [selectedOption, value])

  useEffect(() => {
    const form = inputRef.current?.closest("form")
    if (!form) return

    const handleReset = () => {
      setSearchTerm("")
      setValueHidden("")
      setHighlightedIndex(-1)
      setIsOpen(false)
    }

    if (name) {
      form.addEventListener("reset", handleReset)
    }
    return () => {
      if (name) {
        form.removeEventListener("reset", handleReset)
      }
    }
  }, [name])

  const clearValue = () => {
    setSearchTerm("")
    setValueHidden("")
    setHighlightedIndex(-1)
    setIsOpen(false)
    onChange?.("")
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value
    setSearchTerm(nextValue)
    setIsOpen(true)
    setHighlightedIndex(-1)

    if (!nextValue) {
      setValueHidden("")
      onChange?.("")
    }
  }

  const handleOptionClick = (option: ComboboxOption) => {
    onChange?.(option.value)
    name && setValueHidden(option.value)
    setSearchTerm(option.label)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true)
        return
      }
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
      />
      {searchTerm && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={clearValue}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Clear input"
        >
          <X size={16} />
        </button>
      )}
      {name && <input value={valueHidden} name={name} className="hidden" readOnly />}

      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto dark:bg-gray-800 dark:border-gray-600"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`px-3 py-2 cursor-pointer text-gray-900 dark:text-white ${index === highlightedIndex ? "bg-sky-100 dark:bg-sky-900" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {isOpen && filteredOptions.length === 0 && searchTerm && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
          No options found
        </div>
      )}
    </div>
  )
})

Combobox.displayName = "Combobox"
