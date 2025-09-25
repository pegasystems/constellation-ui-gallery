import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsChatGenAI } from './index';

export default {
  title: 'Widgets/Chat GenAI',
  argTypes: {
    dataPage: {
      table: {
        disable: true,
      },
    },
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsChatGenAI,
};

/* Set this value to false to call an external API instead of using a simulated answer */
const simulateGenAIResponse = true;

const sleep = (m: number) =>
  new Promise((r) => {
    setTimeout(r, m);
  });

type ChatItem = {
  role: string;
  content: string;
};

/* Sample function to call a GenAI endpoint to simulate real response */
async function getRealGenAIResponse(message: Array<string>) {
  const chats: Array<ChatItem> = [];
  message.forEach((msg) => {
    chats.push({ role: 'user', content: msg });
  });
  const response = await fetch('http://localhost:8000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chats }),
  });
  const details = await response.json();
  return Promise.resolve({ pyMessage: details.output.content });
}

const setPCore = () => {
  (window as any).PCore = {
    getDataPageUtils: () => {
      return {
        getPageDataAsync: (dataPageName: string, context: string, parameters: { prompt: string }) => {
          if (simulateGenAIResponse) {
            return sleep(2000).then(() => {
              return Promise.resolve({
                pyMessage: `Thanks for asking about '${parameters.prompt}' but I don't know the answer`,
              });
            });
          } else {
            const chats = JSON.parse(parameters.prompt);
            return getRealGenAIResponse(chats);
          }
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsChatGenAI>;
export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getLocalizedValue: (val: string) => {
            return val;
          },
          getContextName: () => '',
        };
      },
    };
    return <PegaExtensionsChatGenAI {...props} />;
  },
  args: {
    heading: 'AI Assistant',
    maxHeight: 'auto',
    sendAllUserContext: false,
    dataPage: '',
  },
};
