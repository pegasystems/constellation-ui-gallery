export interface PegaExtensionsFormWithVerticalStepperProps {
  // If any, enter additional props that only exist on TextInput here
  showLabel: boolean;
  label: string;
  NumCols: string;
  stepperPosition: 'left' | 'right';
  children: any;
  getPConnect: any;
}

export interface VerticalNavbarProps {
  getPConnect: () => any;
}

export interface ActionButtonsProps {
  getPConnect: () => any;
}

export type Step = {
  ID: string;
  actionID: string;
  allow_jump: boolean;
  name: string;
  visited_status: string;
};

export type ActionButtonData = {
  main: Array<{
    actionID: string;
    jsAction: string;
    name: string;
  }>;
  secondary: Array<{
    actionID: string;
    jsAction: string;
    name: string;
  }>;
};
