export interface PegaExtensionsFormWithVerticalStepperProps {
  // If any, enter additional props that only exist on TextInput here
  showLabel: boolean;
  label: string;
  NumCols: string;
  stepperPosition: 'left' | 'right';
  children: any;
  getPConnect: () => typeof PConnect;
}

export interface VerticalNavbarProps {
  getPConnect: () => typeof PConnect;
}

export interface ActionButtonsProps {
  getPConnect: () => typeof PConnect;
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
