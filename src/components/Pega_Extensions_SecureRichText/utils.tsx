import { EmailDisplay, PhoneDisplay } from '@pega/cosmos-react-core';

type ActionType = (propName: string, value: string) => void;

export const handleEvent = (
  actions: {
    updateFieldValue: ActionType;
    triggerFieldChange: ActionType;
  },
  eventType: string,
  propName: string,
  value: string
) => {
  switch (eventType) {
    case 'change':
      actions.updateFieldValue(propName, value);
      break;
    case 'blur':
      actions.triggerFieldChange(propName, value);
      break;
    case 'changeNblur':
      actions.updateFieldValue(propName, value);
      actions.triggerFieldChange(propName, value);
      break;
    default:
      break;
  }
};

export const formatExists: (formatterVal: string) => boolean = formatterVal => {
  const formatterValues = ['TextInput', 'Email', 'Phone'];
  let isformatter = false;
  if (formatterValues.includes(formatterVal)) {
    isformatter = true;
  }
  return isformatter;
};

export const textFormatter = (formatter: string, value: string) => {
  let displayComponent = null;
  switch (formatter) {
    case 'TextInput': {
      displayComponent = <span>{value}</span>;
      break;
    }
    case 'Email': {
      displayComponent = <EmailDisplay value={value} displayText={value} variant='link' />;
      break;
    }
    case 'Phone': {
      displayComponent = <PhoneDisplay value={value} variant='link' />;
      break;
    }
    // no default
  }
  return displayComponent;
};

export const updateContentWithAbsoluteURLsOfImgSrcs = (content: string, pConn: typeof PConnect) => {
  const newPath = pConn.getServerURL();
  const temporaryElement = new DOMParser().parseFromString(content, 'text/html').body;

  // Replace the `src` attributes
  Array.from(temporaryElement.querySelectorAll('img')).forEach(img => {
    const path = img.src;
    if (path.includes('datacontent/Image')) {
      const fileName = path.slice(path.lastIndexOf('datacontent/Image'));
      img.src = `${newPath}/${fileName}`;
    }
    if (img.dataset.attachmentId) {
      const relativePath = PCore.getAttachmentUtils().getAttachmentURL(img.dataset.attachmentId);
      img.src = relativePath || '';
    }
  });

  // Retrieve the updated `innerHTML` property
  return temporaryElement.innerHTML;
};
