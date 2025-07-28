import {
  withConfiguration,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Flex,
  Text,
  TextArea,
  Icon,
  registerIcon,
} from '@pega/cosmos-react-core';
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { Message, TypeIndicator, type MessageProps } from '@pega/cosmos-react-social';
import * as resetIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/reset.icon';
import * as sendIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/send.icon';
import * as robotSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/robot-solid.icon';

import { StyledCardContent, StyledGenAIComponent } from './styles';
import '../create-nonce';

type HistoryItem = {
  id: string;
  value: ReactElement<MessageProps>;
};

type ChatGenAIProps = {
  heading: string;
  dataPage: string;
  maxHeight: string;
  sendAllUserContext: boolean;
  getPConnect: any;
};

registerIcon(resetIcon, sendIcon, robotSolid);

export const PegaExtensionsChatGenAI = (props: ChatGenAIProps) => {
  const {
    heading = 'AI Assistant',
    dataPage = '',
    maxHeight = '20rem',
    sendAllUserContext = false,
    getPConnect,
  } = props;
  const cardRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<Array<HistoryItem>>([]);
  const [chats, setChats] = useState<Array<string>>([]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const genAIErrorMessage = getPConnect().getLocalizedValue(
    'Unable to process the request. Please try again after sometime.',
  );

  const loadResponse = (response: string) => {
    const id = `A#${history.length}`;
    const item = {
      id,
      value: <Message message={response} direction='in' senderType='agent' senderId={id} />,
    };
    setHistory((prev) => [...prev, item]);
  };

  const postQuestion = useCallback(
    (userPrompt: string) => {
      // Trigger the request to Gen AI
      const dataViewName = dataPage;
      const message = sendAllUserContext ? [...chats, userPrompt] : [userPrompt];
      const parameters = {
        prompt: JSON.stringify(message),
      };
      setLoading(true);
      setChats((previous: Array<string>) => {
        previous.push(userPrompt);
        return previous;
      });
      const context = getPConnect().getContextName();
      (window as any).PCore.getDataPageUtils()
        .getPageDataAsync(dataViewName, context, parameters, { invalidateCache: true })
        .then(({ pyMessage }: { pyMessage: string }) => {
          loadResponse(pyMessage ?? genAIErrorMessage);
        })
        .catch((error: Error) => {
          loadResponse(`${getPConnect().getLocalizedValue('Error')} ${error.message}. ${genAIErrorMessage}`);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataPage, getPConnect, loadResponse],
  );

  const submitQuestion = useCallback(() => {
    if (!loading) {
      const id = `Q#${history.length}`;
      const item = {
        id,
        value: <Message message={value} direction='out' senderType='customer' senderId={id} />,
      };
      setHistory((prev) => [...prev, item]);
      postQuestion(value);
      setValue('');
    }
  }, [loading, history.length, postQuestion, value]);

  const handleEnter = useCallback(
    (event: KeyboardEvent) => {
      if (!event.shiftKey && event.key === 'Enter') {
        event.preventDefault();
        submitQuestion();
      }
    },
    [submitQuestion],
  );

  const resetContext = () => {
    setHistory([]);
    setChats([]);
    setValue('');
  };

  const questionArea = (
    <CardFooter container={{ direction: 'column' }}>
      {loading && (
        <TypeIndicator
          avatarInfo={{
            name: getPConnect().getLocalizedValue('GenAI Assistant'),
          }}
          senderType='bot'
          senderId='bot'
        />
      )}
      <Flex container={{ direction: 'row', gap: 1 }}>
        <Flex item={{ grow: 1 }}>
          <TextArea
            label={getPConnect().getLocalizedValue('Message')}
            value={value}
            minLength={0}
            maxLength={500}
            autoResize
            onChange={(e) => setValue(e.target.value)}
            placeholder={getPConnect().getLocalizedValue('Enter your question')}
            onKeyPress={handleEnter}
          />
        </Flex>
        <Flex item={{ alignSelf: 'center' }}>
          <Button
            variant='simple'
            label={getPConnect().getLocalizedValue('Send')}
            icon
            onClick={submitQuestion}
            disabled={loading}
          >
            <Icon name='send' />
          </Button>
        </Flex>
      </Flex>
    </CardFooter>
  );

  // useEffect to scroll to the bottom whenever the history changes if maxHeight is set to non auto
  useEffect(() => {
    setTimeout(() => {
      if (cardRef.current && maxHeight !== 'auto') {
        cardRef.current.scrollTop = cardRef.current.scrollHeight;
      }
    }, 0);
  }, [history, maxHeight]);

  // useEffect to reset the context
  useEffect(() => {
    resetContext();
  }, [sendAllUserContext]);

  return (
    <StyledGenAIComponent>
      <Card>
        <CardHeader
          actions={
            sendAllUserContext ? (
              <Button
                variant='simple'
                label={getPConnect().getLocalizedValue('Restart conversation')}
                icon
                compact
                onClick={resetContext}
              >
                <Icon name='reset' />
              </Button>
            ) : undefined
          }
        >
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <StyledCardContent ref={cardRef} maxHeight={maxHeight}>
          {history.length ? (
            <Flex container={{ direction: 'column', pad: 1 }}>
              {history.map((e) => (
                <div key={e.id}>{e.value}</div>
              ))}
            </Flex>
          ) : null}
        </StyledCardContent>
        {questionArea}
      </Card>
    </StyledGenAIComponent>
  );
};

export default withConfiguration(PegaExtensionsChatGenAI);
