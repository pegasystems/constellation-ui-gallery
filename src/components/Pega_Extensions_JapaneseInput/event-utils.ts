const handleEvent = (actions: any, eventType: string, propName: string, value: string) => {
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

export default handleEvent;