import { useEffect, useState } from 'react';
import { Progress, Button, Icon, Card, CardHeader, CardContent, Text, useTheme } from '@pega/cosmos-react-core';
import { Draggable } from '@hello-pangea/dnd';
import { StyledCardContent } from './styles';

export type TaskProps = {
  title: string;
  index: number;
  insKey: string;
  classname: string;
  groupValue: string;
  id: string;
  details?: any;
  getDetails: any;
  editTask: any;
  getPConnect: () => any;
};

export const Task = (props: TaskProps) => {
  const { index, insKey, classname, id, title, groupValue, details, getDetails, editTask, getPConnect } = props;
  const [newdetails, setDetails] = useState<any>(details);
  const theme = useTheme();
  const onEdit = () => {
    editTask(insKey);
  };

  const addDetails = async () => {
    setDetails(await getDetails(id, classname));
  };

  useEffect(() => {
    addDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupValue]);

  /* Once the groupValue is a Status and reaches Resolved-, it cannot be dragged anymore and becomes completed */
  if (groupValue.startsWith('Resolved-')) {
    return (
      <StyledCardContent theme={theme}>
        <Card>
          <CardHeader>
            <Text variant='h3'>{title}</Text>
          </CardHeader>
          <CardContent>
            {newdetails || (
              <Progress
                placement='inline'
                message={(window as any).PCore.getLocaleUtils().getLocaleValue(
                  'Loading content...',
                  'Generic',
                  '@BASECLASS!GENERIC!PYGENERICFIELDS',
                )}
              />
            )}
          </CardContent>
        </Card>
      </StyledCardContent>
    );
  }
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <StyledCardContent theme={theme}>
          <Card {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            <CardHeader
              actions={
                <Button
                  variant='simple'
                  label={getPConnect().getLocalizedValue('Edit task')}
                  icon
                  compact
                  onClick={onEdit}
                >
                  <Icon name='pencil' />
                </Button>
              }
            >
              <Text variant='h3'>{title}</Text>
            </CardHeader>
            <CardContent>
              {newdetails || (
                <Progress
                  placement='inline'
                  message={(window as any).PCore.getLocaleUtils().getLocaleValue(
                    'Loading content...',
                    'Generic',
                    '@BASECLASS!GENERIC!PYGENERICFIELDS',
                  )}
                />
              )}
            </CardContent>
          </Card>
        </StyledCardContent>
      )}
    </Draggable>
  );
};
