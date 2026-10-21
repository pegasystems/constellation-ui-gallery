import { useRef, useState } from 'react';
import {
  withConfiguration,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Text,
  Button,
  Progress,
} from '@pega/cosmos-react-core';
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
  /** Show inline progress and disable the button while a case is being created */
  showLoadingIndicator?: boolean | 'true' | 'false';
  getPConnect: any;
};

export const PegaExtensionsCaseLauncher = (props: CaseLauncherProps) => {
  const { heading, description, classFilter, labelPrimaryButton, showLoadingIndicator, getPConnect } = props;
  const pConn = getPConnect();
  const [isCreating, setIsCreating] = useState(false);
  const creationInProgressRef = useRef(false);
  const shouldShowLoading = showLoadingIndicator === true || showLoadingIndicator === 'true';

  /* Create a new case on click of the selected button */
  const createCase = async (className: string) => {
    if (shouldShowLoading && creationInProgressRef.current) {
      return;
    }

    const options = {
      flowType: 'pyStartCase',
      containerName: 'primary',
      openCaseViewAfterCreate: true,
    };

    if (shouldShowLoading) {
      creationInProgressRef.current = true;
      setIsCreating(true);
    }

    try {
      await pConn.getActionsApi().createWork(className, options);
    } finally {
      if (shouldShowLoading) {
        creationInProgressRef.current = false;
        setIsCreating(false);
      }
    }
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
          disabled={shouldShowLoading && isCreating}
          onClick={() => {
            createCase(classFilter);
          }}
        >
          {shouldShowLoading && isCreating ? (
            <Progress placement='inline' message={labelPrimaryButton} />
          ) : (
            labelPrimaryButton
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default withConfiguration(PegaExtensionsCaseLauncher);
