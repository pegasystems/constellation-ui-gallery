import { Flex, Button, Configuration } from '@pega/cosmos-react-core';

export interface ActionableButtonProps {
  label: string;
  value: string;
  localAction: string;
  getPConnect: () => typeof PConnect;
}

const PegaExtensionsActionableButton = (props: ActionableButtonProps) => {
  const { getPConnect, label, value, localAction } = props;
  if (value && localAction) {
    const LaunchLocalAction = () => {
      getPConnect().getActionsApi().openLocalAction(localAction, {
        caseID: value,
        containerName: 'modal',
        type: 'express'
      });
    };
    return (
      <Configuration>
        <Flex container={{ direction: 'row' }}>
          <Button onClick={LaunchLocalAction}>{label}</Button>
        </Flex>
      </Configuration>
    );
  }
  return null;
};

export default PegaExtensionsActionableButton;
