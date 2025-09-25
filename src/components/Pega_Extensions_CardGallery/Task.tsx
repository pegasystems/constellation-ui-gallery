import { Progress, Button, Icon, Card, CardHeader, CardContent, Text, useTheme } from '@pega/cosmos-react-core';
import { StyledCardContent } from './styles';

export type TaskProps = {
  title: string;
  insKey: string;
  status: string;
  details?: any;
  editTask: any;
  getPConnect: () => any;
};

export const Task = (props: TaskProps) => {
  const { insKey, status, title, details, editTask, getPConnect } = props;
  const theme = useTheme();
  const onEdit = () => {
    editTask(insKey);
  };

  return (
    <StyledCardContent theme={theme}>
      <Card>
        <CardHeader
          actions={
            !status.startsWith('Resolved-') ? (
              <Button
                variant='simple'
                label={getPConnect().getLocalizedValue('Edit task')}
                icon
                compact
                onClick={onEdit}
              >
                <Icon name='pencil' />
              </Button>
            ) : null
          }
        >
          <Text variant='h3'>{title}</Text>
        </CardHeader>
        <CardContent>
          {details || (
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
};
