import { type FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import {
  Input,
  FieldValueList,
  Text,
  withConfiguration,
  type InputProps,
  type FormControlProps,
  type TestIdProp,
  useTestIds,
  createTestIds,
  withTestIds
} from '@pega/cosmos-react-core';
import '../create-nonce';

// interface for props
export interface PegaExtensionsJapaneseInputProps extends InputProps, TestIdProp {
  // If any, enter additional props that only exist on TextInput here
  hasSuggestions?: boolean;
  variant?: any;
  hiraganaToKatakana: boolean;
  fullToHalf: boolean;
  lowerToUpper: boolean;
  label: string;
  getPConnect: any;
  validatemessage: string;
  helperText: string;
  testId: string;
  fieldMetadata?: any;
  additionalProps?: any;
  displayMode?: string;
}

// interface for StateProps object
export interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

// Test-id configuration
export const getJapaneseInputTestIds = createTestIds('japanese-input', [] as const);

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export const PegaExtensionsJapaneseInput: FC<PegaExtensionsJapaneseInputProps> = ({
  getPConnect,
  placeholder,
  validatemessage,
  helperText,
  testId,
  fieldMetadata = {},
  displayMode,
  value,
  label,
  labelHidden,
  variant = 'inline',
  hasSuggestions = false,
  hiraganaToKatakana = false,
  fullToHalf = false,
  lowerToUpper = false,
  ...restProps
}: PegaExtensionsJapaneseInputProps) => {
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;
  const maxLength = fieldMetadata?.maxLength;
  const hasValueChange = useRef(false);
  const testIds = useTestIds(testId, getJapaneseInputTestIds);

  // let { readOnly = false, required = false, disabled = false } = props;
  // [readOnly, required, disabled] = [readOnly, required, disabled].map(
  //   prop => prop === true || (typeof prop === 'string' && prop === 'true')
  // );

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState<FormControlProps['status']>(
    hasSuggestions ? 'pending' : undefined
  );

  // cast status
  // let myStatus: 'success' | 'warning' | 'error' | 'pending';

  // myStatus = status as 'success' | 'warning' | 'error' | 'pending';

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, hasSuggestions, status]);

  const displayComp = value || '';
  if (displayMode === 'DISPLAY_ONLY') {
    return <Text>{displayComp}</Text>;
  }
  if (displayMode === 'LABELS_LEFT') {
    return (
      <FieldValueList
        variant={labelHidden ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: labelHidden ? '' : label, value: displayComp }]}
      />
    );
  }
  if (displayMode === 'STACKED_LARGE_VAL') {
    return (
      <Text variant='h1' as='span'>
        {displayComp}
      </Text>
    );
  }

  const handleChange = (event: any) => {
    if (hasSuggestions) {
      setStatus(undefined);
    }
    setInputValue(event.target.value);
    if (value !== event.target.value) {
      actions.updateFieldValue(propName, event.target.value);
      hasValueChange.current = true;
    }
  };

  const handleBlur = (event: any) => {
    if (!value || hasValueChange.current) {
      actions.triggerFieldChange(propName, event.target.value);
      if (hasSuggestions) {
        pConn.ignoreSuggestion('');
      }
      hasValueChange.current = false;
    }

    const convertHiraganaToKatakana = (str: string) => {
      return str.replace(/[\u3041-\u3096]/g, match => {
        return String.fromCharCode(match.charCodeAt(0) + 0x60);
      });
    };

    const fullWidthToHalfWidth = (str: string): string => {
      str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, match => {
        return String.fromCharCode(match.charCodeAt(0) - 0xfee0);
      });
      // prettier-ignore
      const kanaMap: Record<string, string> = {
        ガ: 'ｶﾞ', ギ: 'ｷﾞ', グ: 'ｸﾞ', ゲ: 'ｹﾞ', ゴ: 'ｺﾞ',
        ザ: 'ｻﾞ', ジ: 'ｼﾞ', ズ: 'ｽﾞ', ゼ: 'ｾﾞ', ゾ: 'ｿﾞ',
        ダ: 'ﾀﾞ', ヂ: 'ﾁﾞ', ヅ: 'ﾂﾞ', デ: 'ﾃﾞ', ド: 'ﾄﾞ',
        バ: 'ﾊﾞ', ビ: 'ﾋﾞ', ブ: 'ﾌﾞ', ベ: 'ﾍﾞ', ボ: 'ﾎﾞ',
        パ: 'ﾊﾟ', ピ: 'ﾋﾟ', プ: 'ﾌﾟ', ペ: 'ﾍﾟ', ポ: 'ﾎﾟ',
        ヴ: 'ｳﾞ', ヷ: 'ﾜﾞ', ヺ: 'ｦﾞ',
        ア: 'ｱ', イ: 'ｲ', ウ: 'ｳ', エ: 'ｴ', オ: 'ｵ',
        カ: 'ｶ', キ: 'ｷ', ク: 'ｸ', ケ: 'ｹ', コ: 'ｺ',
        サ: 'ｻ', シ: 'ｼ', ス: 'ｽ', セ: 'ｾ', ソ: 'ｿ',
        タ: 'ﾀ', チ: 'ﾁ', ツ: 'ﾂ', テ: 'ﾃ', ト: 'ﾄ',
        ナ: 'ﾅ', ニ: 'ﾆ', ヌ: 'ﾇ', ネ: 'ﾈ', ノ: 'ﾉ',
        ハ: 'ﾊ', ヒ: 'ﾋ', フ: 'ﾌ', ヘ: 'ﾍ', ホ: 'ﾎ',
        マ: 'ﾏ', ミ: 'ﾐ', ム: 'ﾑ', メ: 'ﾒ', モ: 'ﾓ',
        ヤ: 'ﾔ', ユ: 'ﾕ', ヨ: 'ﾖ',
        ラ: 'ﾗ', リ: 'ﾘ', ル: 'ﾙ', レ: 'ﾚ', ロ: 'ﾛ',
        ワ: 'ﾜ', ヲ: 'ｦ', ン: 'ﾝ',
        ァ: 'ｧ', ィ: 'ｨ', ゥ: 'ｩ', ェ: 'ｪ', ォ: 'ｫ',
        ッ: 'ｯ', ャ: 'ｬ', ュ: 'ｭ', ョ: 'ｮ',
        '。': '｡', '、': '､', ー: 'ｰ', '「': '｢', '」': '｣', '・': '･'
      };
      const reg = new RegExp(`(${Object.keys(kanaMap).join('|')})`, 'g');
      return str
        .replace(reg, match => {
          return kanaMap[match];
        })
        .replace(/゛/g, 'ﾞ')
        .replace(/゜/g, 'ﾟ');
    };
    let newValue = event.target.value;
    if (hiraganaToKatakana) {
      newValue = convertHiraganaToKatakana(newValue);
    }
    if (fullToHalf) {
      newValue = fullWidthToHalfWidth(newValue);
    }
    if (lowerToUpper) {
      newValue = newValue.toUpperCase();
    }
    if (event.target.value !== newValue) {
      setInputValue(newValue);
      actions.updateFieldValue(propName, newValue);
    }
  };

  return (
    <Input
      {...restProps}
      testId={testIds.root}
      type='text'
      label={label}
      labelHidden={labelHidden}
      info={validatemessage || helperText}
      value={inputValue}
      status={status}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default withTestIds(withConfiguration(PegaExtensionsJapaneseInput), getJapaneseInputTestIds);
