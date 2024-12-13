import { EmailDisplay, PhoneDisplay } from '@pega/cosmos-react-core';

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
