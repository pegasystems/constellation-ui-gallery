import { useState } from 'react';
import type { StoryObj } from '@storybook/react-webpack5';
import Input from '@pega/cosmos-react-core/lib/components/Input/Input';
import { PegaExtensionsFormWithVerticalStepper } from './index';
import type { PegaExtensionsFormWithVerticalStepperProps } from './types';

export default {
  title: 'Templates/Form With Vertical Stepper',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsFormWithVerticalStepper,
};

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {
      return {
        PUB_SUB_EVENTS: {
          CASE_EVENTS: {
            CREATE_STAGE_SAVED: 'CaseEvents_CreateStageSaved',
          },
        },
        CASE_INFO: {
          ACTION_BUTTONS: 'actionsButtonData',
        },
      };
    },
    getLocaleUtils: () => ({
      getLocaleValue: (val: string) => val,
    }),
    getFormUtils: () => ({
      isFormValid: () => true,
    }),
    getPubSubUtils: () => {
      return {
        subscribe: () => {
          /* nothing */
        },
        unsubscribe: () => {
          /* nothing */
        },
      };
    },
  };
};

const generateChildren = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    type: 'Text',
    config: {
      value: '',
      label: `@L Field${index + 1}`,
    },
    key: index.toString(),
  }));
};

const mainResponse = {
  name: 'pyReview',
  type: 'View',
  config: {
    template: 'Details',
    ruleClass: 'Work-MyComponents',
    showLabel: true,
    label: '@L Details',
    localeReference: '@LR Details',
    inheritedProps: [],
  },
  children: [
    {
      name: 'A',
      type: 'Region',
      getPConnect: () => {
        return {
          getRawMetadata: () => {
            return mainResponse.children[0];
          },
        };
      },
      children: generateChildren(10),
    },
  ],
  classID: 'Work-MyComponents',
};

// Create stable references outside of render
const mockGetPConnect = {
  getInheritedProps: () => {
    return mainResponse.config.inheritedProps;
  },
  createComponent: (f: any) => {
    return createComponent(f.config, f.key);
  },
  getContextName: () => 'app/primary_1/workarea_1',
  getPageReference: () => 'caseInfo.content',
  getLocalizationService: () => ({
    getLocalizedText: (text: string) => text,
  }),
  getCaseInfo: () => ({
    getKey: () => 'CASE12345',
    getAssignmentID: () => 'ASSIGN67890',
    c11nEnv: {
      getValue: () => '',
    },
  }),
};

const createComponent = (config: any, key: string) => {
  return <Input key={key} label={config.label.replace('@L ', '')} autoComplete='off' />;
};

type Story = StoryObj<typeof PegaExtensionsFormWithVerticalStepper>;
export const Default: Story = {
  render: (args) => {
    setPCore();

    const [steps, setSteps] = useState([
      { ID: 'step1', name: 'Step 1', visited_status: 'current' },
      { ID: 'step2', name: 'Step 2', visited_status: 'future' },
      { ID: 'step3', name: 'Step 3', visited_status: 'future' },
      { ID: 'step4', name: 'Step 4', visited_status: 'future' },
    ]);

    const navigateToStep = (stepID: string) => {
      if (stepID === 'previous') {
        const currentStepIndex = steps.findIndex((step) => step.visited_status === 'current');
        if (currentStepIndex === 0) {
          return; // already at first step
        }

        const currentStepID = steps[currentStepIndex].ID;
        const previousStepID = steps[currentStepIndex - 1].ID;

        // update current step to success status and set previous step to current
        setSteps((prevSteps) =>
          prevSteps.map((step) => {
            if (step.ID === currentStepID) {
              return { ...step, visited_status: 'success' };
            } else if (step.ID === previousStepID) {
              return { ...step, visited_status: 'current' };
            } else {
              return step;
            }
          }),
        );
        return;
      }

      // update current step to future status and set selected step to current
      setSteps((prevSteps) =>
        prevSteps.map((step) => {
          if (step.ID === stepID) {
            return { ...step, visited_status: 'current' };
          } else if (step.visited_status === 'current') {
            return { ...step, visited_status: 'success' };
          } else {
            return step;
          }
        }),
      );
    };

    const getValue = (field: string) => {
      if (field === 'caseInfo.navigation.steps') {
        return steps;
      }

      if (field === (window as any).PCore.getConstants().CASE_INFO.ACTION_BUTTONS) {
        const isFirstStep = steps[0].visited_status === 'current';
        const isLastStep = steps[steps.length - 1].visited_status === 'current';

        const mainButtons = [];
        const secondaryButtons = [];

        if (!isLastStep) {
          mainButtons.push({ actionID: 'next', name: 'Next' });
        } else {
          mainButtons.push({ actionID: 'submit', name: 'Submit' });
        }

        if (!isFirstStep) {
          secondaryButtons.push({ actionID: 'back', name: 'Back' });
        }

        secondaryButtons.push({ actionID: 'cancel', name: 'Cancel' });
        secondaryButtons.push({ actionID: 'save', name: 'Save' });

        return {
          main: mainButtons,
          secondary: secondaryButtons,
        };
      }

      return [];
    };

    const getPConnect = (): any => {
      return {
        ...mockGetPConnect,
        getValue,
        getActionsApi: () => ({
          navigateToStep,
          finishAssignment: () => {
            // navigate to next step for demo purposes
            setSteps((prevSteps) =>
              // make current step success and next step current
              prevSteps.map((step, index) => {
                if (step.visited_status === 'current' && index < prevSteps.length - 1) {
                  return { ...step, visited_status: 'success' };
                } else if (index === prevSteps.findIndex((s) => s.visited_status === 'current') + 1) {
                  return { ...step, visited_status: 'current' };
                } else {
                  return step;
                }
              }),
            );

            return Promise.resolve();
          },
          cancelAssignment: () => {
            return Promise.resolve();
          },
          saveAssignment: () => {
            return Promise.resolve();
          },
        }),
      };
    };

    const props: PegaExtensionsFormWithVerticalStepperProps = {
      ...args,
      getPConnect,
    };
    const regionAChildren = mainResponse.children[0].children.map((child: any) => {
      return getPConnect().createComponent(child);
    });

    return <PegaExtensionsFormWithVerticalStepper {...props}>{regionAChildren}</PegaExtensionsFormWithVerticalStepper>;
  },
  args: {
    showLabel: true,
    label: 'Form template',
    NumCols: '2',
  },
};
