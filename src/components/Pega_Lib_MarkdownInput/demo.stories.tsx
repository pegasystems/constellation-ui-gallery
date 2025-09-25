// @ts-nocheck
import type { StoryObj } from '@storybook/react-webpack5';

import { PegaExtensionsMarkdownInput } from './index';

export default {
  title: 'Fields/Markdown editor',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
    additionalProps: {
      table: {
        disable: true,
      },
    },
    formatter: {
      table: {
        disable: true,
      },
    },
    isTableFormatter: {
      table: {
        disable: true,
      },
    },
    fieldMetadata: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsMarkdownInput,
};

type Story = StoryObj<typeof PegaExtensionsMarkdownInput>;

export const Default: Story = {
  render: (args) => {
    const props = {
      ...args,

      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: '.MardownInput',
            };
          },
          getActionsApi: () => {
            return {
              updateFieldValue: () => {
                /* nothing */
              },
              triggerFieldChange: () => {
                /* nothing */
              },
            };
          },
        };
      },
    };
    return <PegaExtensionsMarkdownInput {...props} />;
  },
  args: {
    displayMode: '',
    readOnly: false,
    required: false,
    hideLabel: false,
    label: 'Markdown Sample',
    value: `# Heading 1

This is a paragraph with **bold text**, *italic text*, and [a link](https://www.pega.com).

## Heading 2

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

### Heading 3

1. First item
2. Second item
3. Third item

> This is a blockquote.

\`\`\`javascript
// This is a code block
function greet() {
  console.log("Hello, world!");
}
\`\`\`

---

This is a horizontal rule.`,
    helperText: 'Markdown Helper Text',
    testId: 'markdown-12345678',
    placeholder: 'Markdown Placeholder',
    validatemessage: '',
    disabled: false,
  },
};
