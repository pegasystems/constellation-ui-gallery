import { Input } from '@pega/cosmos-react-core';

type FieldComponentProps = {
  field: {
    type?: string;
    label?: string;
    value?: string;
    options?: Array<{ label: string; value: string }>;
    displayMode?: string;
    onChange?: (value: string) => void;
    key?: string;
  };
  index?: number;
};

/**
 * Component for rendering form fields (Dropdown or Input)
 */
export const FieldComponent = ({ field, index = 0 }: FieldComponentProps) => {
  const { type, label, value, options, displayMode, onChange, key } = field || {};
  const componentKey = key || label || `field-${index}`;

  if (type === 'Dropdown' && Array.isArray(options) && options.length > 0) {
    return (
      <select
        key={componentKey}
        value={value || ''}
        disabled={displayMode === 'DISPLAY_ONLY'}
        onChange={(e) => {
          if (typeof onChange === 'function') {
            onChange(e.target.value);
          }
        }}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: 'var(--app-bg-surface, #fff)',
        }}
      >
        {options.map((option: any, optIndex: number) => (
          <option key={`${componentKey}-option-${optIndex}`} value={option.value || option.label}>
            {option.label || option.value}
          </option>
        ))}
      </select>
    );
  }

  return (
    <Input
      key={componentKey}
      label={label}
      value={value || ''}
      disabled={displayMode === 'DISPLAY_ONLY'}
      onChange={(e) => {
        if (typeof onChange === 'function') {
          onChange(e.currentTarget.value);
        }
      }}
    />
  );
};
