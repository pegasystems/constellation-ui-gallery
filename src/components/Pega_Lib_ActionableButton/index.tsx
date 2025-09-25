import { withConfiguration, Flex, Button } from '@pega/cosmos-react-core';
import '../create-nonce';

type ActionableButtonProps = {
  label: string;
  value: string;
  localAction: string;
  getPConnect: any;
};

export const PegaExtensionsActionableButton = (props: ActionableButtonProps) => {
  const { getPConnect, label, value, localAction } = props;
  if (value && localAction) {
    const availableActions =
      getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.AVAILABLEACTIONS) || [];
    const targetAction = availableActions.find((action: { ID: string }) => action.ID === localAction);
    const actionName = targetAction?.name || label;
    const LaunchLocalAction = async () => {
      const actionsAPI = getPConnect().getActionsApi();
      if (getPConnect().getContainerName() === 'workarea') {
        await actionsAPI.saveAssignment(getPConnect().getContextName());
      }
      const openLocalAction = actionsAPI.openLocalAction.bind(actionsAPI);
      openLocalAction(localAction, {
        caseID: value,
        containerName: 'modal',
        type: 'express',
        name: actionName,
      });
    };
    return (
      <Flex container={{ direction: 'row' }}>
        <Button onClick={LaunchLocalAction}>{label}</Button>
      </Flex>
    );
  }
  return null;
};

export default withConfiguration(PegaExtensionsActionableButton);
