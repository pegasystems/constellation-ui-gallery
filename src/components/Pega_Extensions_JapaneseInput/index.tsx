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
import type { FieldValueVariant } from '@pega/cosmos-react-core/lib/components/FieldValueList/FieldValueList';

enum DisplayMode {
  DisplayOnly = 'DISPLAY_ONLY',
  LabelsLeft = 'LABELS_LEFT',
  StackedLargeVal = 'STACKED_LARGE_VAL'
}

// interface for props
export interface PegaExtensionsJapaneseInputProps extends InputProps, TestIdProp {
  // If any, enter additional props that only exist on TextInput here
  hasSuggestions?: boolean;
  variant?: FieldValueVariant;
  hiraganaToKatakana: boolean;
  fullToHalf: boolean;
  lowerToUpper: boolean;
  label: string;
  getPConnect: any;
  errorMessage: string;
  displayMode?: DisplayMode;
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
  testId,
  getPConnect,
  errorMessage,
  displayMode,
  value,
  label,
  labelHidden,
  info,
  variant,
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
  const hasValueChange = useRef(false);
  const testIds = useTestIds(testId, getJapaneseInputTestIds);

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState<FormControlProps['status']>(
    hasSuggestions ? 'pending' : undefined
  );

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (errorMessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      setStatus(errorMessage !== '' ? 'error' : undefined);
    }
  }, [errorMessage, hasSuggestions, status]);

  const displayComp = inputValue || '';
  if (displayMode === DisplayMode.DisplayOnly) {
    return <Text>{displayComp}</Text>;
  }

  if (displayMode === DisplayMode.LabelsLeft) {
    return (
      <FieldValueList
        variant={labelHidden ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: labelHidden ? '' : label, value: displayComp }]}
      />
    );
  }

  if (displayMode === DisplayMode.StackedLargeVal) {
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
      info={errorMessage || info}
      value={inputValue}
      status={status}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default withTestIds(withConfiguration(PegaExtensionsJapaneseInput), getJapaneseInputTestIds);
