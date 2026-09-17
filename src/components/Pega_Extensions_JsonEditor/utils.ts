export interface JsonValidation {
  isEmpty: boolean;
  isValid: boolean;
  message?: string;
  errorLine?: number;
  errorColumn?: number;
  formattedValue: string;
  minifiedValue: string;
}

export interface JsonHighlightPart {
  text: string;
  className?: string;
  key: string;
}

export type CopyState = 'idle' | 'copied' | 'failed';

const JSON_TOKEN_PATTERN = /("(?:\\.|[^"\\])*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(?:true|false|null)\b|[{}[\],:]/g;

export const normalizeIndent = (indent: number | string): number => {
  const parsedIndent = typeof indent === 'number' ? indent : Number(indent);

  if (!Number.isFinite(parsedIndent)) {
    return 2;
  }

  return Math.min(10, Math.max(0, Math.floor(parsedIndent)));
};

const getErrorLocation = (value: string, error: unknown) => {
  const message = error instanceof Error ? error.message : '';
  const positionMatch = message.match(/position\s+(\d+)/i);

  if (!positionMatch) {
    return {};
  }

  const position = Number(positionMatch[1]);
  const precedingText = value.slice(0, position);
  const lastLineBreak = precedingText.lastIndexOf('\n');

  return {
    errorLine: precedingText.split('\n').length,
    errorColumn: position - lastLineBreak,
  };
};

export const highlightJson = (value: string): JsonHighlightPart[] => {
  const highlighted: JsonHighlightPart[] = [];
  let lastIndex = 0;

  for (const match of value.matchAll(JSON_TOKEN_PATTERN)) {
    const token = match[0];
    const start = match.index ?? 0;
    const end = start + token.length;

    if (start > lastIndex) {
      highlighted.push({ text: value.slice(lastIndex, start), key: `text-${lastIndex}-${start}` });
    }

    let className = 'json-punctuation';
    if (token.startsWith('"')) {
      className = /^\s*:/.test(value.slice(end)) ? 'json-key' : 'json-string';
    } else if (/^-?\d/.test(token)) {
      className = 'json-number';
    } else if (/^(true|false|null)$/.test(token)) {
      className = 'json-literal';
    }

    highlighted.push({ text: token, className, key: `${start}-${end}` });
    lastIndex = end;
  }

  if (lastIndex < value.length) {
    highlighted.push({ text: value.slice(lastIndex), key: `text-${lastIndex}-${value.length}` });
  }

  return highlighted;
};

export const validateJson = (value: string, indent: number | string, required: boolean): JsonValidation => {
  if (!value.trim()) {
    return {
      isEmpty: true,
      isValid: !required,
      message: required ? 'JSON is required.' : undefined,
      formattedValue: '',
      minifiedValue: '',
    };
  }

  try {
    const parsedValue: unknown = JSON.parse(value);
    return {
      isEmpty: false,
      isValid: true,
      formattedValue: JSON.stringify(parsedValue, null, normalizeIndent(indent)),
      minifiedValue: JSON.stringify(parsedValue),
    };
  } catch (error) {
    const { errorLine, errorColumn } = getErrorLocation(value, error);
    return {
      isEmpty: false,
      isValid: false,
      message: error instanceof SyntaxError ? error.message : 'Invalid JSON.',
      errorLine,
      errorColumn,
      formattedValue: '',
      minifiedValue: '',
    };
  }
};

export const copyText = async (value: string): Promise<void> => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  try {
    textArea.select();
    if (!document.execCommand('copy')) {
      throw new Error('Clipboard access is unavailable.');
    }
  } finally {
    document.body.removeChild(textArea);
  }
};

export const getValidationLabel = (jsonValidation: JsonValidation): string => {
  return jsonValidation.isValid ? 'Valid JSON' : 'Invalid JSON';
};

export const getValidationStatus = (jsonValidation: JsonValidation): 'invalid' | 'valid' => {
  return jsonValidation.isValid ? 'valid' : 'invalid';
};

export const getLineCount = (value: string): number => (value ? value.split('\n').length : 0);
