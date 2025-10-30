import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, FC } from 'react';
// import './Autocomplete.css';

interface AutocompleteProps {
  options: string[];
  onSelect?: (value: string) => void;
}

const Autocomplete: FC<AutocompleteProps> = ({ options, onSelect }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filteredSuggestions = options.filter(option =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelect?.(suggestion);
  };

  return (
    <div className="autocomplete-container" ref={containerRef}>
      <input
        type="text"
        value={inputValue}
        placeholder="Type to search"
        onChange={handleChange}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
            <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
