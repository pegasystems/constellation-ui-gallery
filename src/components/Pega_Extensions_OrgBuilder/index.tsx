import { useState } from 'react';
import { withConfiguration, Text, Card, CardHeader, CardContent, Button, Icon } from '@pega/cosmos-react-core';

import StyledPegaExtensionsOrgBuilder from './styles';
import { OrganizationBuilder } from './OrganizationBuilder';
import * as resetIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/reset.icon';
import { registerIcon } from '@pega/cosmos-react-core';
import '../shared/create-nonce';

registerIcon(resetIcon);

export interface OrgBuilderProps {
  /** Heading of the widget */
  heading: string;

  /** Name of the data page that will be called to get reference and target organization trees */
  dataPage: string;

  /** If the DP is parameterized, this property will be passed as pyGUID parameter */
  selectionProperty?: string;

  /** Height of the diagram
   * @default 40rem
   */
  height?: string;

  /** Show the refresh button to reload the DP
   * @default true
   */
  showRefresh?: boolean;

  /** Left panel heading (reference organization) */
  referenceHeading?: string;

  /** Right panel heading (organization to create) */
  targetHeading?: string;

  getPConnect: any;
}

export const PegaExtensionsOrgBuilder = (props: OrgBuilderProps) => {
  const {
    heading = '',
    height = '100%',
    dataPage,
    selectionProperty,
    getPConnect,
    showRefresh = true,
    referenceHeading = 'Organisation de référence',
    targetHeading = 'Organisation dédiée',
  } = props;
  const [counter, setCounter] = useState(1);

  const refreshData = () => {
    setCounter((prev) => prev + 1);
  };

  return (
    <Card>
      <CardHeader
        actions={
          showRefresh ? (
            <Button
              variant='simple'
              label={getPConnect().getLocalizedValue('Reload')}
              icon
              compact
              onClick={refreshData}
            >
              <Icon name='reset' />
            </Button>
          ) : undefined
        }
      >
        <Text variant='h2'>{heading}</Text>
      </CardHeader>
      <CardContent>
        <StyledPegaExtensionsOrgBuilder height={height}>
          <OrganizationBuilder
            dataPage={dataPage}
            selectionProperty={selectionProperty}
            getPConnect={getPConnect}
            referenceHeading={referenceHeading}
            targetHeading={targetHeading}
            counter={counter}
          />
        </StyledPegaExtensionsOrgBuilder>
      </CardContent>
    </Card>
  );
};
export default withConfiguration(PegaExtensionsOrgBuilder);
