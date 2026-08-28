import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { PegaExtensionsDuplicateRowButton } from './index';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders duplicate row button with default args', () => {
  render(<Default />);
  expect(screen.getByText('Duplicate row')).not.toBeNull();
});

test('calls list insert when duplicate row button is clicked', async () => {
  const insertSpy = jest.fn();
  (window as any).PCore = {
    getStore: () => ({
      getState: () => ({
        data: {
          workarea: {
            caseInfo: {
              content: {
                Orders: [
                  {
                    LineItems: [
                      {
                        classID: 'Data-LineItem',
                        ProductName: 'Keyboard',
                        Quantity: 2,
                        pzInsKey: 'LINE-1',
                      },
                      {
                        classID: 'Data-LineItem',
                        ProductName: 'Monitor',
                        Quantity: 1,
                        pzInsKey: 'LINE-2',
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      }),
    }),
    createPConnect: () => ({
      getPConnect: () => ({
        getListActions: () => ({
          insert: insertSpy,
        }),
      }),
    }),
  };

  render(
    <PegaExtensionsDuplicateRowButton
      label='Duplicate row'
      getPConnect={() => ({
        getContextName: () => 'workarea',
        getPageReference: () => 'caseInfo.content.Orders[0].LineItems[0]',
        getTarget: () => 'workarea',
        options: {
          pageReference: 'caseInfo.content.Orders[0].LineItems[0]',
          viewName: 'LineItemRow',
        },
        getLocalizedValue: (val: string) => val,
      })}
    />,
  );

  await userEvent.click(screen.getByText('Duplicate row'));

  expect(insertSpy).toHaveBeenCalledWith(
    {
      classID: 'Data-LineItem',
      ProductName: 'Keyboard',
      Quantity: 2,
    },
    2,
  );
});
