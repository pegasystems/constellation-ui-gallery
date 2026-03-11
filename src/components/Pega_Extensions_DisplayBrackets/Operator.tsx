// @ts-nocheck
import { useState, useEffect, Fragment } from 'react';
import {
  Link,
  Button,
  Popover,
  useOuterEvent,
  useElement,
  Progress,
  FormField,
  useTheme,
} from '@pega/cosmos-react-core';
import { Glimpse } from '@pega/cosmos-react-work';
import { EmailDisplay } from '@pega/cosmos-react-core';

import Avatar from './Avatar';

interface PegaExtensionsDisplayBracketsOperatorProps {
  name: string;
  id: string;
  label: string;
  metaObj: any;
  externalUser: any;
  testId: string;
  helperText: string;
}

let pTarget = null;

export default function Operator(props: PegaExtensionsDisplayBracketsOperatorProps) {
  const { id, name, label, testId, helperText, externalUser, metaObj } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [popoverEl, setPopoverEl] = useElement(null);
  const [popoverContent, setpopoverContent] = useState(null);
  const theme: any = useTheme();

  /* If the id has changed, we need to reset the popover */
  useEffect(() => {
    pTarget = null;
  }, [id]);

  const OperatorPreview = () => {
    const localizedVal = PCore.getLocaleUtils().getLocaleValue;
    const localeCategory = 'Operator';
    setpopoverContent(
      <Progress variant='ring' message={localizedVal('Loading operator...', localeCategory)} placement='local' />,
    );
    if (externalUser && externalUser.classID !== 'Data-Party-Operator') {
      const fields = [
        {
          id: 'pyFirstName',
          name: localizedVal('Name', localeCategory),
          value: externalUser.name,
        },
        {
          id: 'pyEmail1',
          name: localizedVal('Email', localeCategory),
          value:
            externalUser.email !== '' ? <Link href={`mailto:${externalUser.email}`}>{externalUser.email}</Link> : '',
        },
        {
          id: 'pyPhoneNumber',
          name: localizedVal('Phone', localeCategory),
          value: externalUser.phone !== '' ? <Link href={`tel:${externalUser.phone}`}>{externalUser.phone}</Link> : '',
        },
      ];
      setIsLoading(false);
      setpopoverContent(
        <Glimpse
          visual={
            <Avatar
              metaObj={{
                name: externalUser.name,
              }}
            />
          }
          primary={externalUser.name}
          secondary={[externalUser.position]}
          fields={fields}
          target={pTarget}
        />,
      );
    } else {
      return PCore.getUserApi()
        .getOperatorDetails(id, true)
        .then((res) => {
          if (res.data?.data && res.data.data[0].BusinessID && res.data.data[0].Name) {
            const fields = [];
            if (res.data.data[0].Name) {
              fields.push({
                id: 'Name',
                name: localizedVal('Name', localeCategory),
                value: res.data.data[0].Name,
              });
            }
            if (res.data.data[0].BusinessID) {
              fields.push({
                id: 'Email',
                name: localizedVal('Email address', localeCategory),
                value: <EmailDisplay value={res.data.data[0].BusinessID} />,
              });
            }
            const opAvatar = (
              <Avatar
                metaObj={{
                  image: '',
                  name: res.data.data[0].Name,
                }}
              />
            );

            setIsLoading(false);
            setpopoverContent(
              <Glimpse
                heading={{
                  primary: res.data.data[0].Name,
                  secondary: res.data.data[0].BusinessID,
                  visual: opAvatar,
                }}
                fields={fields}
                target={pTarget}
                onDismiss={() => {
                  pTarget = null;
                }}
              />,
            );
          }
        });
    }
  };

  const clickAction = (e: any) => {
    setIsOpen(!isOpen);
    if (pTarget === null) {
      pTarget = e.currentTarget;
      OperatorPreview();
    }
  };

  const hidePopover = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  useOuterEvent('mousedown', [popoverEl], hidePopover); // Call the method on clicking outside these elements

  const hideOnEscape = (e: any) => {
    if (e.key === 'Escape') hidePopover(); // Call the method when Escape key is pressed
  };

  const comp = (
    <Fragment>
      {metaObj ? (
        <Button
          variant='text'
          aria-haspopup
          aria-expanded={isOpen}
          onClick={clickAction}
          onKeyDown={hideOnEscape}
          data-test-id={testId}
          style={label !== null ? { width: 'max-content', height: theme.components.input.height } : undefined}
        >
          <Avatar {...props} />
        </Button>
      ) : (
        <Button
          variant='link'
          aria-haspopup
          aria-expanded={isOpen}
          onClick={clickAction}
          onKeyDown={hideOnEscape}
          data-test-id={testId}
          style={label !== null ? { width: 'max-content', height: theme.components.input.height } : undefined}
        >
          {name}
        </Button>
      )}

      {isOpen && (
        <Popover
          ref={setPopoverEl}
          groupId='operator'
          target={pTarget}
          placement='bottom-start'
          style={isLoading ? { position: 'relative', width: '10rem', minHeight: '4rem' } : undefined}
          strategy='fixed'
        >
          {popoverContent}
        </Popover>
      )}
    </Fragment>
  );

  if (label !== null) {
    return (
      <FormField label={label} info={helperText}>
        {comp}
      </FormField>
    );
  }

  return comp;
}
