/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import PegaExtensionsTaskList from './index';
import configProps from './mock';

const meta: Meta<typeof PegaExtensionsTaskList> = {
  title: 'PegaExtensionsTaskList',
  component: PegaExtensionsTaskList,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof PegaExtensionsTaskList>;

if (!window.PCore) {
  window.PCore = {};
}

// Mock data for worklist
const worklistData = {
  data: {
    data: [
      {
        Id: 1,
        Label: 'Project configuration has been completed',
        Status: true
      },
      {
        Id: 2,
        Label: 'Create the project report',
        Status: false
      }
    ]
  }
};

// Mock getDataApiUtils to return worklistData
window.PCore.getDataApiUtils = () => {
  return {
    getData: () => {
      return new Promise(resolve => {
        resolve(worklistData); // Resolve the worklist data
      });
    },
    getDataAsync: () => {
      return new Promise(resolve => {
        resolve(worklistData); // Resolve the worklist data asynchronously
      });
    },
    updateData: (taskId: number, newStatus: boolean) => {
      // This simulates updating the task's status based on checkbox click
      const taskIndex = worklistData.data.data.findIndex(task => task.Id === taskId);
      if (taskIndex !== -1) {
        worklistData.data.data[taskIndex].Status = newStatus;
        return new Promise(resolve => resolve(worklistData.data.data[taskIndex])); // Resolve the updated task
      }
      return new Promise((resolve, reject) => reject('Task not found'));
    }
  };
};

// Base Story for PegaExtensionsTaskList
export const BasePegaExtensionsTaskList: Story = args => {
  const props = {
    ...configProps,
    getPConnect: () => {
      return {
        getValue: value => value,
        getContextName: () => 'app/primary_1',
        getLocalizedValue: value => value,
        getActionsApi: () => ({
          updateFieldValue: (taskId: number, newStatus: boolean) => {
            // Here, update the task status using the updateData method
            window.PCore.getDataApiUtils().updateData(taskId, newStatus).then(updatedTask => {
              console.log('Updated task:', updatedTask);
            }).catch(error => {
              console.error('Error updating task:', error);
            });
          },
          triggerFieldChange: () => {}
        }),
        ignoreSuggestion: () => {},
        acceptSuggestion: () => {},
        setInheritedProps: () => {},
        resolveConfigProps: () => {}
      };
    }
  };

  return (
    <>
      <PegaExtensionsTaskList {...props} {...args} />
    </>
  );
};

// Define default arguments for the Story
BasePegaExtensionsTaskList.args = {
  header: configProps.header,
  description: configProps.description,
  whatsnewlink: configProps.whatsnewlink,
  datasource: configProps.datasource
};
