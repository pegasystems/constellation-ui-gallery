import StyledPegaExtensionsPreloadCaseStarterWrapper, { StyledCard } from './styles';
import { useEffect, useState } from 'react';

import { Card, CardHeader, CardContent, CardFooter, Text, Button } from '@pega/cosmos-react-core';

// interface for props
export type PreloadCaseStarterProps = {
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
export default function PegaExtensionsCaseLauncher(props: PreloadCaseStarterProps) {
  const { heading, description, classFilter, labelPrimaryButton, getPConnect } = props;
  const PCore = (window as any).PCore;
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

  const [quickCreatecases, setCases] = useState<any[]>([]);

  /* useEffect for the case type */
  useEffect(() => {
    const cases: any[] = [];
    const defaultCases: any[] = [];
    const envInfo = PCore.getEnvironmentInfo();

    /* Finds the work types selected to display */
    if (envInfo?.environmentInfoObject?.pyCaseTypeList) {
      envInfo.environmentInfoObject.pyCaseTypeList.forEach(
        (casetype: { pyWorkTypeName: any; pyWorkTypeImplementationClassName: any }) => {
          if (casetype.pyWorkTypeName && casetype.pyWorkTypeImplementationClassName) {
            defaultCases.push({
              classname: casetype.pyWorkTypeImplementationClassName
            });
          }
        }
      );
    } else {
      defaultCases.push({
        classname: classFilter
      });
    }

    if (classFilter?.length > 0) {
      defaultCases.forEach((casetype: any) => {
        if (casetype.classname === classFilter) {
          cases.push(casetype);
        }
      });

      setCases(cases);
    }
  }, []);

  return (
    <StyledPegaExtensionsPreloadCaseStarterWrapper>
      <Card as={StyledCard}>
        <CardHeader>
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <CardContent>{description}</CardContent>
        <CardFooter justify='end'>
          {quickCreatecases?.map(c => (
            <Button
              key={c?.classname}
              variant='primary'
              onClick={() => {
                createCase(c?.classname);
              }}
            >
              {labelPrimaryButton}
            </Button>
          ))}
        </CardFooter>
      </Card>
    </StyledPegaExtensionsPreloadCaseStarterWrapper>
  );
}
