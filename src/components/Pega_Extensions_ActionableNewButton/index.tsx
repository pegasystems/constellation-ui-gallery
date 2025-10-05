import { withConfiguration, Flex, Button } from '@pega/cosmos-react-core';
import '../create-nonce';

type ActionableNewButtonProps = {
  label: string;
  value: string;
  localAction: string;
  getPConnect: any;
};

export const PegaExtensionsActionableNewButton = (props: ActionableNewButtonProps) => {
  const { getPConnect, label, value, localAction } = props;
  if (value && localAction) {
    const availableActions =
      getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.AVAILABLEACTIONS) || [];
    // const targetAction = availableActions.find((action: { ID: string }) => action.ID === localAction);
    const LaunchLocalAction = async () => {
      // eslint-disable-next-line no-console
      console.log('okkkk');
      try {

        getPConnect().getListActions().updateProperty('.FirstName', 'John Doe dsadsa');

        getPConnect().getActionsApi().updateFieldValue('.FirstName', 'John Doe m');

        getPConnect().getActionsApi().updateFieldValue('FirstName', 'John Doe lp');

      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
      // eslint-disable-next-line no-console
      console.log(availableActions);
    };
    return (
      <Flex container={{ direction: 'row' }}>
        <Button onClick={LaunchLocalAction}>{label}</Button>
      </Flex>
    );
  }
  return null;
};

export default withConfiguration(PegaExtensionsActionableNewButton);
