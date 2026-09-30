import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions: string[];
  inputStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  pillStyle?: React.CSSProperties;
  className?: string;
  iconColor?: string;
  iconSize?: number;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  suggestions,
  inputStyle,
  containerStyle,
  pillStyle,
  className = 'search-bar',
  iconColor = 'var(--text-muted)',
  iconSize = 16,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = value.trim().toLowerCase();
  const matches = query
    ? suggestions.filter(s => s.toLowerCase().includes(query) && s.toLowerCase() !== query).slice(0, 6)
    : [];

  return (
    <div ref={wrapperRef} style={{ position: 'relative', ...containerStyle }}>
      <div className={className} style={pillStyle}>
        <Search size={iconSize} color={iconColor} strokeWidth={1.5} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => { onChange(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          style={{
            background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none',
            fontSize: '0.875rem', fontFamily: 'inherit', width: '100%', boxShadow: 'none',
            ...inputStyle,
          }}
        />
      </div>

      {isOpen && matches.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 200,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.6)', borderRadius: 16,
          boxShadow: '0 16px 40px rgba(18,101,175,0.16)',
          overflow: 'hidden', padding: '0.4rem',
        }}>
          {matches.map((s, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={e => { e.preventDefault(); onChange(s); setIsOpen(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none',
                padding: '0.55rem 0.75rem', borderRadius: 10, cursor: 'pointer',
                fontSize: '0.85rem', color: 'var(--text-main)', fontFamily: 'inherit',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(18,101,175,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
