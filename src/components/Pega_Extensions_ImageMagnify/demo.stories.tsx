// @ts-nocheck
import { withKnobs } from '@storybook/addon-knobs';

import PegaExtensionsImageMagnify from './index';
import { stateProps, configProps } from './mock';

export default {
  title: 'PegaExtensionsImageMagnify',
  decorators: [withKnobs],
  component: PegaExtensionsImageMagnify
};

export const BasePegaExtensionsImageMagnify = () => {
  const props = {
    value: configProps.value,
    placeholder: configProps.placeholder,
    label: configProps.label,
    helperText: configProps.helperText,
    testId: configProps.testId,
    hasSuggestions: configProps.hasSuggestions,

    getPConnect: () => {
      return {
        getStateProps: () => {
          return stateProps;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {
              /* nothing */
            },
            triggerFieldChange: () => {
              /* nothing */
            }
          };
        },
        ignoreSuggestion: () => {
          /* nothing */
        },
        acceptSuggestion: () => {
          /* nothing */
        },
        setInheritedProps: () => {
          /* nothing */
        },
        resolveConfigProps: () => {
          /* nothing */
        }
      };
    }
  };

  return (
    <>
      <PegaExtensionsImageMagnify {...props} />
    </>
  );
};
