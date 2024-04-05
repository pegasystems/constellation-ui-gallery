import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Text,
  Button,
  Configuration
} from '@pega/cosmos-react-core';

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

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function PegaExtensionsCaseLauncher(props: CaseLauncherProps) {
  const { heading, description, classFilter, labelPrimaryButton, getPConnect } = props;
  const pConn = getPConnect();

  /* Create a new case on click of the selected button */
  const createCase = (className: any) => {
    const options = {
      flowType: 'pyStartCase',
      containerName: 'primary',
      openCaseViewAfterCreate: true
    };

    pConn.getActionsApi().createWork(className, options);
  };

  return (
    <Configuration>
      <Card>
        <CardHeader>
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <CardContent>{description}</CardContent>
        <CardFooter justify='end'>
          <Button
            key={classFilter}
            variant='primary'
            onClick={() => {
              createCase(classFilter);
            }}
          >
            {labelPrimaryButton}
          </Button>
        </CardFooter>
      </Card>
    </Configuration>
  );
}
