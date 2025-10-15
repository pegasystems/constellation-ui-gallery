import { useState, useEffect } from 'react';
import { withConfiguration, Progress, CardContent, Card, Flex, Text } from '@pega/cosmos-react-core';
import getAllFields from './utils';
import DentalChart from './DentalChart';

export type JawLayoutProps = {
  getPConnect?: any;
  readOnly?: boolean;
  heading?: string;
};

export const PegaExtensionsJawLayout = (props: JawLayoutProps) => {
  const { getPConnect, readOnly = false, heading } = props;
  const [fields, setFields] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [embedDataRef, setEmbedDataRef] = useState<string>('');
  const [statusPropName, setStatusPropName] = useState<string>('');

  const updateToothStatus = (index: number, newStatus: string) => {
    if (readOnly) return;

    setFields((prevFields) =>
      prevFields.map((field) => {
        if (field.propref && field.propref.endsWith(statusPropName)) {
          const newValues = [...field.value];
          newValues[index] = newStatus;
          return { ...field, value: newValues };
        }
        return field;
      }),
    );

    if (getPConnect && embedDataRef && statusPropName) {
      try {
        const listPath = embedDataRef.replace('[*]', '');
        const finalPageRef = `caseInfo.content${listPath.startsWith('.') ? '' : '.'}${listPath}[${index}]`;
        const messageConfig = {
          meta: props,
          options: {
            context: getPConnect().getContextName(),
            pageReference: finalPageRef,
            target: getPConnect().getTarget(),
          },
        };
        const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
        c11nEnv.getPConnect().getActionsApi()?.updateFieldValue(`.${statusPropName}`, newStatus);
      } catch (e) {
        console.error('❌ Error calling updateFieldValue:', e);
      }
    }
  };

  useEffect(() => {
    const allFields = getAllFields(getPConnect);

    // WARNING: This is brittle. It assumes the desired field is always the first one.
    // If the field order changes in the Pega layout, this will break.
    const statusField = allFields[0];

    // Check if the field at index 0 exists and looks like the data we need.
    if (statusField && Array.isArray(statusField.value)) {
      const pageRef = statusField.pageref;
      const propName = statusField.propref?.split('.').pop() || '';

      setEmbedDataRef(pageRef);
      setStatusPropName(propName);

      try {
        (window as any).PCore.getContextTreeManager().addPageListNode(
          getPConnect().getContextName(),
          'caseInfo.content',
          getPConnect().meta.name,
          pageRef,
        );
      } catch {
        /* Silently fail if already registered */
      }
      setFields(allFields);
    } else if (allFields.length > 0) {
      setError(getPConnect().getLocalizedValue('The first field in the layout is not a valid Field Group (List)."'));
    }
    setLoading(false);
  }, [getPConnect]);

  if (loading) {
    return <Progress placement='local' message={getPConnect().getLocalizedValue('Loading content...')} />;
  }

  if (error) {
    return <Text status='error'>{error}</Text>;
  }

  const statusCodes = fields[0]?.value || [];

  return (
    <Card>
      <CardContent>
        <Flex container={{ direction: 'column', gap: 1 }}>
          <DentalChart
            heading={heading}
            statusCodes={statusCodes}
            updateToothStatus={updateToothStatus}
            readOnly={readOnly}
            getPConnect={getPConnect}
          />
        </Flex>
      </CardContent>
    </Card>
  );
};

export default withConfiguration(PegaExtensionsJawLayout);
