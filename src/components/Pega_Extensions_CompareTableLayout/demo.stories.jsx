import { withKnobs, text, select } from '@storybook/addon-knobs';
import PegaExtensionsCompareTableLayout from './index';
import { CurrencyDisplay } from '@pega/cosmos-react-core';
import genResponse from './mock.stories';

export default {
  title: 'PegaExtensionsCompareTableLayout',
  decorators: [withKnobs],
  component: PegaExtensionsCompareTableLayout
};

if (!window.PCore) {
  window.PCore = {
    getComponentsRegistry: () => {
      return {
        getLazyComponent: f => f
      };
    }
  };
}

export const basePegaExtensionsCompareTableLayout = () => {
  const props = {
    template: 'Pega_Extensions_CompareTableLayout',
    heading: text('Heading', 'Heading'),
    selectionProperty: 'caseid',
    displayFormat: select(`Display format`, {
      SimpleTable: 'spreadsheet',
      FinancialReport: 'financialreport',
      RadioButtonCard: 'radio-button-card'
    }),
    currencyFormat: select(`Currency format`, {
      standard: 'standard',
      compact: 'compact',
      parentheses: 'parentheses'
    }),
    getPConnect: () => {
      return {
        getChildren: () => {
          return genResponse(props.displayFormat).children;
        },
        getRawMetadata: () => {
          return genResponse(props.displayFormat);
        },
        getInheritedProps: () => {
          return genResponse(props.displayFormat).config.inheritedProps;
        },
        createComponent: config => {
          if (config.type === 'Currency') {
            if (config.config.negative === 'parentheses') {
              return (
                <CurrencyDisplay
                  currencyISOCode='USD'
                  value={config.config.value}
                  formattingOptions={{
                    negative: 'parentheses',
                    notation: 'standard'
                  }}
                />
              );
            }
            return (
              <CurrencyDisplay
                currencyISOCode='USD'
                value={config.config.value}
                formattingOptions={{
                  notation: props.currencyFormat
                }}
              />
            );
          }
          return config.config.text;
        },
        setInheritedProp: () => {
          /* nothing */
        },
        setValue: () => {
          /* nothing */
        },
        resolveConfigProps: f => {
          return f;
        }
      };
    }
  };

  return (
    <>
      <PegaExtensionsCompareTableLayout {...props}></PegaExtensionsCompareTableLayout>
    </>
  );
};
