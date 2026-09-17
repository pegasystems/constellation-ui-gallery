export const configProps = {
  value: `{
  "caseId": "C-10042",
  "status": "In progress",
  "priority": 2,
  "isEscalated": false,
  "owner": null,
  "customer": {
    "name": "Avery Morgan",
    "email": "avery.morgan@example.com"
  },
  "tags": ["billing", "priority"],
  "milestones": [
    {
      "name": "Review",
      "complete": true
    },
    {
      "name": "Resolution",
      "complete": false
    }
  ]
}`,
  label: 'JSON value',
  placeholder: `{
  "title": "Constellation",
  "count": 3,
  "enabled": true,
  "notes": null,
  "tags": ["json", "editor"],
  "settings": {
    "theme": "light"
  }
}`,
  helperText: 'Supports objects, arrays, strings, numbers, booleans, and null.',
  testId: 'JsonEditor-12345678',
  displayMode: '' as const,
  hideLabel: false,
  readOnly: false,
  required: false,
  disabled: false,
  status: undefined,
  validatemessage: '',
};

export const stateProps = {
  value: '.JsonValue',
};
