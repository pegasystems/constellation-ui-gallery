import { useEffect, useState } from 'react';
import {
  Progress,
  Button,
  Icon,
  Card,
  CardHeader,
  CardContent,
  Text,
  useTheme
} from '@pega/cosmos-react-core';
import { StyledCardContent } from './styles';

export type TaskProps = {
  title: string;
  insKey: string;
  status: string;
  classname: string;
  id: string;
  details?: any;
  getDetails: any;
  editTask: any;
};

export const Task = (props: TaskProps) => {
  const { insKey, classname, status, id, title, details, getDetails, editTask } = props;
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
  }, []);

  return (
    <StyledCardContent theme={theme}>
      <Card>
        <CardHeader
          actions={
            !status.startsWith('Resolved-') ? (
              <Button variant='simple' label='Edit task' icon compact onClick={onEdit}>
                <Icon name='pencil' />
              </Button>
            ) : null
          }
        >
          <Text variant='h3'>{title}</Text>
        </CardHeader>
        <CardContent>
          {newdetails || <Progress placement='inline' message='Loading content...' />}
        </CardContent>
      </Card>
    </StyledCardContent>
  );
};
