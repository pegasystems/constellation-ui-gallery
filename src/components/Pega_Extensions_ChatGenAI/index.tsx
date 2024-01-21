import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Flex,
  Text,
  TextArea
} from '@pega/cosmos-react-core';
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { Message, TypeIndicator, type MessageProps } from '@pega/cosmos-react-social';

import { StyledCardContent, StyledGenAIComponent } from './styles';

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

export default function PegaExtensionsChatGenAI(props: ChatGenAIProps) {
  const {
    heading = 'AI Assistant',
    dataPage = '',
    maxHeight = '20rem',
    sendAllUserContext = false,
    getPConnect
  } = props;
  const cardRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<Array<HistoryItem>>([]);
  const [chats, setChats] = useState<Array<string>>([]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const genAIErrorMessage = 'Unable to process the request. Please try again after sometime.';

  const loadResponse = useCallback(
    (response: string) => {
      const id = `A#${history.length}`;
      const item = {
        id,
        value: <Message message={response} direction='in' senderType='agent' senderId={id} />
      };
      setHistory(prev => [...prev, item]);
    },
    [history.length]
  );

  const postQuestion = useCallback(
    (userPrompt: string) => {
      // Trigger the request to Gen AI
      const dataViewName = dataPage;
      const message = sendAllUserContext ? [...chats, userPrompt] : [userPrompt];
      const parameters = {
        prompt: JSON.stringify(message)
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
          loadResponse(`Error ${error.message}. ${genAIErrorMessage}`);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getPConnect, loadResponse, genAIErrorMessage]
  );

  const submitQuestion = useCallback(() => {
    if (!loading) {
      const id = `Q#${history.length}`;
      const item = {
        id,
        value: <Message message={value} direction='out' senderType='customer' senderId={id} />
      };
      setHistory(prev => [...prev, item]);
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
    [submitQuestion]
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
            name: 'GenAI Assistant'
          }}
          senderType='bot'
          senderId='bot'
        />
      )}
      <Flex container={{ direction: 'row', gap: 1 }}>
        <Flex item={{ grow: 1 }}>
          <TextArea
            label='Message'
            value={value}
            minLength={0}
            maxLength={500}
            autoResize
            onChange={e => setValue(e.target.value)}
            placeholder='Enter your question'
            onKeyPress={handleEnter}
          />
        </Flex>
        <Flex item={{ alignSelf: 'center' }}>
          <Button variant='simple' label='Send' icon onClick={submitQuestion} disabled={loading}>
            <svg role='presentation' viewBox='0 0 25 25'>
              <path d='m1.5 2.5 22 10-22 10 2.849-9.954L1.5 2.5Zm1.495 1.706L5.177 12H16v1H5.201l-2.206 7.795L21.21 12.5 2.995 4.206Z' />
            </svg>
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
  }, [history]);

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
              <Button variant='secondary' label='Restart conversation' icon onClick={resetContext}>
                <svg role='presentation' viewBox='0 0 25 25'>
                  <path d='m19.84 7.516.045-2.492c0-.554.277-.83.785-.83.554 0 .83.277.83.83v4.754c0 .507-.277.784-.83.784h-4.8c-.508 0-.785-.277-.785-.784 0-.508.277-.785.785-.785h3.092a8.192 8.192 0 0 0-2.4-2.63c-1.246-.785-2.585-1.2-4.062-1.2-2.031 0-3.785.738-5.216 2.169-1.43 1.43-2.123 3.139-2.123 5.17 0 2.03.693 3.738 2.123 5.169 1.43 1.43 3.185 2.169 5.216 2.169 2.215 0 4.062-.83 5.492-2.446l.093-.093c.23-.139.415-.23.507-.23.6 0 .877.277.877.83 0 .23-.092.416-.23.508-1.8 2.077-4.015 3.092-6.739 3.092-2.446 0-4.57-.877-6.37-2.63C4.378 17.07 3.5 14.946 3.5 12.5c0-2.447.877-4.57 2.63-6.37 1.8-1.753 3.925-2.63 6.37-2.63 1.8 0 3.462.507 4.985 1.523.785.508 1.57 1.339 2.354 2.492v.001Z' />
                </svg>
              </Button>
            ) : undefined
          }
        >
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <StyledCardContent ref={cardRef} maxHeight={maxHeight}>
          {history.length ? (
            <Flex container={{ direction: 'column', pad: 1 }}>
              {history.map(e => (
                <div key={e.id}>{e.value}</div>
              ))}
            </Flex>
          ) : null}
        </StyledCardContent>
        {questionArea}
      </Card>
    </StyledGenAIComponent>
  );
}
