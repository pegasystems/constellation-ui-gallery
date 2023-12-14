export const pyReviewRaw = {
  name: 'pyReview',
  type: 'View',
  config: {
    template: 'Details',
    ruleClass: 'Work-MyComponents',
    showLabel: true,
    label: '@L Details',
    localeReference: '@LR MYCOMPONENTS!VIEW!PYREVIEW'
  },
  children: [
    {
      name: 'A',
      type: 'Region',
      getPConnect: () => {
        return {
          getRawMetadata: () => {
            return pyReviewRaw.children[0];
          }
        };
      },
      children: [
        {
          type: 'DateTime',
          config: {
            value: '@P .pySLADeadline',
            label: '@L SLA Deadline'
          },
          key: '1'
        },
        {
          type: 'DateTime',
          config: {
            value: '@P .pySLAGoal',
            label: '@L SLA Goal'
          },
          key: '2'
        },
        {
          type: 'DateTime',
          config: {
            value: '@P .pySLAStartTime',
            label: '@L SLA Start Time'
          },
          key: '3'
        }
      ]
    }
  ],
  classID: 'Work-MyComponents'
};

export const regionChildrenResolved = [
  {
    readOnly: true,
    value: '30 days',
    label: 'SLA Deadline',
    key: 'SLA Deadline'
  },
  {
    readOnly: true,
    value: '10 days',
    label: 'SLA Goal',
    key: 'SLA Goal'
  },
  {
    readOnly: true,
    value: '2/12/2023',
    label: 'SLA Start Time',
    key: 'SLA Start Time'
  }
];
