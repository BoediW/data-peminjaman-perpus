import { useState, useRef, useEffect } from "preact/hooks";
import { ChevronDown, Check } from "lucide-preact";

export default function Dropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  icon: Icon,
  required = false,
  name,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    // If option is an object, use option.value, otherwise use option itself
    const selectedValue = typeof option === "object" ? option.value : option;
    onChange(selectedValue);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value) return "";
    const selectedOption = options.find((opt) =>
      typeof opt === "object" ? opt.value === value : opt === value,
    );
    return typeof selectedOption === "object"
      ? selectedOption.label
      : selectedOption;
  };

  return (
    <div class="w-full relative" ref={dropdownRef}>
      {label && (
        <label
          class="label block text-sm font-medium text-gray-700 mb-1.5 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {Icon && <Icon class="w-4 h-4 inline mr-2 text-gray-500" />}
          {label}
          {required && <span class="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div class="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          class={`w-full px-4 py-2.5 rounded-lg border bg-white text-left flex items-center justify-between transition-all duration-200 outline-none
            ${
              isOpen
                ? "border-primary-500 ring-2 ring-primary-500/20"
                : "border-base-300 hover:border-gray-400"
            }
            ${!value ? "text-gray-400" : "text-gray-800"}
          `}
        >
          <span class="truncate block w-full pr-2">
            {getDisplayValue() || placeholder}
          </span>
          <ChevronDown
            class={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {name && <input type="hidden" name={name} value={value} />}

        <div
          class={`absolute z-50 w-full mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-200 origin-top
            ${
              isOpen
                ? "opacity-100 scale-100 translate-y-0 visible"
                : "opacity-0 scale-95 -translate-y-2 invisible"
            }
          `}
        >
          <div class="max-h-60 overflow-y-auto scrollbar-thin p-1">
            {options.length === 0 ? (
              <div class="px-4 py-3 text-sm text-gray-400 text-center">
                No options available
              </div>
            ) : (
              options.map((option, index) => {
                const optValue =
                  typeof option === "object" ? option.value : option;
                const optLabel =
                  typeof option === "object" ? option.label : option;
                const isSelected = value === optValue;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(option)}
                    class={`w-full px-3 py-2.5 text-sm text-left rounded-lg flex items-center justify-between transition-colors
                      ${
                        isSelected
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span class="truncate">{optLabel}</span>
                    {isSelected && <Check class="w-4 h-4 text-primary-600" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
