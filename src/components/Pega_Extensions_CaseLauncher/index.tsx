import { withConfiguration, Card, CardHeader, CardContent, CardFooter, Text, Button } from '@pega/cosmos-react-core';
import StyledCard from './styles';
import '../shared/create-nonce';

// interface for props
export type CaseLauncherProps = {
  /** Card heading */
  heading: string;
  /** Description of the case launched by the widget */
  description: string;
  /** Class name of the case; used as property when launching pyStartCase  */
  classFilter: any;
  /** Primary button label  */
  labelPrimaryButton: string;
  getPConnect: any;
};

export const PegaExtensionsCaseLauncher = (props: CaseLauncherProps) => {
  const { heading, description, classFilter, labelPrimaryButton, getPConnect } = props;
  const pConn = getPConnect();

  /* Create a new case on click of the selected button */
  const createCase = (className: string) => {
    const options = {
      flowType: 'pyStartCase',
      containerName: 'primary',
      openCaseViewAfterCreate: true,
    };

    pConn.getActionsApi().createWork(className, options);
  };

  return (
    <Card as={StyledCard}>
      <CardHeader>
        <Text variant='h2'>{heading}</Text>
      </CardHeader>
      <CardContent>{description}</CardContent>
      <CardFooter justify='end'>
        <Button
          variant='primary'
          onClick={() => {
            createCase(classFilter);
          }}
        >
          {labelPrimaryButton}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default withConfiguration(PegaExtensionsCaseLauncher);
