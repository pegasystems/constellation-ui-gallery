import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsImageMagnify } from './index';

export default {
  title: 'Fields/Image Magnify',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
    customWidth: {
      if: { arg: 'widthSel', eq: 'widthpx' },
    },
    customHeight: {
      if: { arg: 'widthSel', eq: 'widthpx' },
    },
    altTextOfImage: {
      if: { arg: 'altText', eq: 'constant' },
    },
    propaltTextOfImage: {
      if: { arg: 'altText', eq: 'propertyRef' },
    },
    alwaysInPlace: {
      if: { arg: 'magnifyMode', eq: 'magSideBySide' },
    },
    switchSides: {
      if: { arg: 'magnifyMode', eq: 'magSideBySide' },
    },
    fillAvailableSpace: {
      if: { arg: 'magnifyMode', eq: 'magSideBySide' },
    },
    fillAlignTop: {
      if: { arg: 'magnifyMode', eq: 'magSideBySide' },
    },
    fillGapLeft: {
      if: { arg: 'magnifyMode', eq: 'magSideBySide' },
    },
    fillGapRight: {
      if: { arg: 'magnifyMode', eq: 'magSideBySide' },
    },
    fillGapTop: {
      if: { arg: 'magnifyMode', eq: 'magSideBySide' },
    },
    zoomTop: {
      if: { arg: 'magnifyMode', eq: 'magAdvanced' },
    },
    zoomLeft: {
      if: { arg: 'magnifyMode', eq: 'magAdvanced' },
    },
    zoomHeight: {
      if: { arg: 'magnifyMode', eq: 'magAdvanced' },
    },
    zoomWidth: {
      if: { arg: 'magnifyMode', eq: 'magAdvanced' },
    },
    zoomZIndex: {
      if: { arg: 'magnifyMode', eq: 'magAdvanced' },
    },
    previewRightOffset: {
      if: { arg: 'magnifyMode', eq: 'magAdvanced' },
    },
  },
  component: PegaExtensionsImageMagnify,
};

type Story = StoryObj<typeof PegaExtensionsImageMagnify>;

export const Default: Story = {
  render: (args) => {
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: args.value,
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
          },
        };
      },
    };
    return (
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <PegaExtensionsImageMagnify {...props} />
      </div>
    );
  },
  args: {
    value: 'Overview.png',
    widthSel: 'defaultWidth',
    customWidth: 100,
    customHeight: '100px',
    altText: 'constant',
    altTextOfImage: '',
    propaltTextOfImage: '',

    magnifyTrigger: 'magTriggerHover',
    magnifyMode: 'magSideBySide',

    fillAvailableSpace: false,
    fillAlignTop: false,
    fillGapLeft: 0,
    fillGapRight: 0,
    fillGapTop: 0,
    fillGapBottom: 0,
    switchSides: false,
    alwaysInPlace: false,

    zoomTop: 0,
    zoomLeft: 0,
    zoomHeight: 100,
    zoomWidth: 300,
    previewRightOffset: 0,
    zoomZIndex: 999,
  },
};
