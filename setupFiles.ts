// Jest global setup integrating Storybook decorators for composeStories tests.
import { setProjectAnnotations } from '@storybook/react';
import preview from './.storybook/preview';

setProjectAnnotations(preview);
