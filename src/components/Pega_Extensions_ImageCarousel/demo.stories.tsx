/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';

import PegaExtensionsPegaSlider from './index';
import { configProps, operatorDetails } from './mock';

const meta: Meta<typeof PegaExtensionsPegaSlider> = {
  title: 'PegaExtensionsPegaSlider',
  component: PegaExtensionsPegaSlider,
  excludeStories: /.*Data$/,
};

export default meta;

type Story = StoryObj<typeof PegaExtensionsPegaSlider>;

if (!window.PCore) {
  window.PCore = {};
}

window.PCore.getLocaleUtils = () => {
  return {
    getLocaleValue: value => {
      return value;
    }
  };
};

window.PCore.getUserApi = () => {
  return {
    getOperatorDetails: () => {
      return Promise.resolve(operatorDetails);
    }
  };
};

export const BasePegaExtensionsPegaSlider: Story = args => {
  const props = {
    datasource: configProps.datasource,
    height: configProps.height,
    textPosition: configProps.textPosition,
    objectFit: configProps.objectFit,
    autoplay: configProps.autoplay,
    autoplayDuration: configProps.autoplayDuration,
    controlType: configProps.controlType,
    animationType: configProps.animationType,
    visibility: configProps.visibility,
    label: configProps.label, // Include label if needed
  };

  return (
    <>
      <PegaExtensionsPegaSlider {...props} {...args} />
    </>
  );
};

// Default args for the Storybook story
BasePegaExtensionsPegaSlider.args = {
  height: '40rem',
  textPosition: 'Center',
  objectFit: 'cover',
  autoplay: true,
  autoplayDuration: '3000',
  controlType: 'Dots',
  animationType: 'fade-in',
  visibility: true,
  label: 'Image Carousel',
};
