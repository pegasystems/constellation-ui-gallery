import { Avatar, registerIcon, useTheme } from '@pega/cosmos-react-core';
import * as checkIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/check.icon';
import * as moreIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/more-alt.icon';

import {
  HideTopNavigation,
  NavigationItemStatus,
  NavigationItemTextContent,
  NavigationItemTitle,
  NavigationList,
  NavigationListItem,
  ProgressDescription,
  ProgressTitle,
  ProgressDetails,
  VerticalNavbarWrapper,
} from './styles';
import type { Step, VerticalNavbarProps } from './types';

registerIcon(checkIcon, moreIcon);

const STATUS_MSG_MAP: { [key: string]: string } = {
  success: 'Completed',
  current: 'Not started yet',
  future: 'Not started yet',
};

function NavigationItemIcon({ status }: { status: string }) {
  const theme = useTheme();

  const iconMap: {
    [key: string]: { name: string; icon: string; color: string; backgroundColor: string };
  } = {
    success: {
      name: 'completed',
      icon: 'check',
      color: theme.components['case-view'].stages.status.completed['foreground-color'],
      backgroundColor: theme.components['case-view'].stages.status.completed['background'],
    },
    current: {
      name: 'current',
      icon: 'more-alt',
      color: theme.components['case-view'].stages.status.current['foreground-color'],
      backgroundColor: theme.components['case-view'].stages.status.current['background'],
    },
    future: {
      name: '',
      icon: '',
      color: theme.components['case-view'].stages.status.pending['foreground-color'],
      backgroundColor: theme.components['case-view'].stages.status.pending['background'],
    },
  };

  return (
    <Avatar
      shape='circle'
      size='m'
      name={iconMap[status].name}
      icon={iconMap[status].icon}
      color={iconMap[status].color}
      backgroundColor={iconMap[status].backgroundColor}
      aria-label={iconMap[status].name || 'Pending step'}
    />
  );
}

export default function VerticalNavbar({ getPConnect }: VerticalNavbarProps) {
  const steps: Step[] = getPConnect().getValue('caseInfo.navigation.steps') || [];
  const context = getPConnect().getContextName();
  const pageReference = getPConnect().getPageReference();
  const localizationService = getPConnect().getLocalizationService();

  const completedStepsCount = steps.filter((step: Step) => step.visited_status === 'success').length;

  const handleStepClick = (step: Step) => {
    // Prevent navigation if the step is the current one
    if (step.visited_status === 'current') return;

    // Validate the form before navigating to another step
    if ((window as any).PCore.getFormUtils().isFormValid(context, pageReference)) {
      // Navigate to the selected step
      getPConnect().getActionsApi().navigateToStep(step.ID, context);
    }
  };

  return (
    <VerticalNavbarWrapper>
      <ProgressDetails>
        <ProgressTitle>{localizationService.getLocalizedText('Progress')}</ProgressTitle>
        <ProgressDescription>
          {localizationService
            .getLocalizedText('{0} of {1} steps completed')
            .replace('{0}', completedStepsCount.toString())
            .replace('{1}', steps.length.toString())}
        </ProgressDescription>
      </ProgressDetails>

      <NavigationList>
        {steps.map((step: Step) => (
          <NavigationListItem key={step.ID} className={step.visited_status} onClick={() => handleStepClick(step)}>
            <NavigationItemIcon status={step.visited_status} />
            <NavigationItemTextContent>
              <NavigationItemStatus>{STATUS_MSG_MAP[step.visited_status]}</NavigationItemStatus>
              <NavigationItemTitle $status={step.visited_status}>{step.name}</NavigationItemTitle>
            </NavigationItemTextContent>
          </NavigationListItem>
        ))}
      </NavigationList>

      <HideTopNavigation />
    </VerticalNavbarWrapper>
  );
}
