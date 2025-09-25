import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsStatusBadge } from './index';

export default {
  title: 'Fields/Status Badge',
  component: PegaExtensionsStatusBadge,
};

type Story = StoryObj<typeof PegaExtensionsStatusBadge>;

export const Default: Story = {
  render: (args) => {
    const props = {
      ...args,
    };
    return <PegaExtensionsStatusBadge {...props} />;
  },
  args: {
    inputProperty: 'Open',
    infoStatus: 'open|hold|info|new',
    warnStatus: 'fail|cancel|reject|withdraw|revoke|stopped|warn',
    successStatus: 'resolved|completed|success',
    pendingStatus: 'pending',
    urgentStatus: 'blocked',
  },
};
