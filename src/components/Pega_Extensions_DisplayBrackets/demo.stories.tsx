import type { StoryObj } from '@storybook/react-webpack5';

import PegaExtensionsDisplayBrackets, { type PegaExtensionsTournamentProps } from './index';

const ConfigProps = {
  label: 'Create operator',
  createLabel: 'Created',
  updateLabel: 'Updated',
  updateDateTime: '2023-01-16T14:53:33.280Z',
  createDateTime: '2023-01-16T14:53:33.198Z',
  updateOperator: {
    userId: 'admin@mediaco',
    userName: 'admin',
  },
  createOperator: {
    userId: 'admin@mediaco',
    userName: 'admin',
  },
  hideLabel: true,
  key: '_532zx1dah',
  displayMode: 'LABELS_LEFT',
};

const OperatorDetails = {
  data: {
    pzLoadTime: 'January 18, 2023 10:33:19 AM EST',
    pzPageNameHash: '_pa1519192551088960pz',
    pyOperatorInfo: {
      pyUserName: 'french DigV2',
      pyPosition: '',
      pyImageInsKey: '',
      pySkills: [
        {
          pySkillName: '',
          pzIndexOwnerKey: 'DATA-ADMIN-OPERATOR-ID FRENCHTEST.DIGV2',
          pySkillRating: 0,
        },
      ],
      pyReportToUserName: '',
      pyReportTo: '',
      pyOrganization: 'DXIL',
      pyTitle: '',
      pyLabel: 'frenchTest.DigV2',
      pyEmailAddress: 'User@DigV2',
      pyTelephone: '',
    },
  },
  status: 200,
  statusText: '',
  headers: {
    'content-length': '435',
    'content-type': 'application/json;charset=UTF-8',
  },
  request: {},
};

export default {
  title: 'Widgets/Display Brackets',
  argTypes: {
    dataPage: {
      table: {
        disable: true,
      },
    },
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    a11y: {
      context: '#storybook-root',
      config: {
        rules: [
          {
            id: 'list',
            enabled: false,
          },
          {
            id: 'nested-interactive',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsDisplayBrackets,
};

const setPCore = () => {
  (window as any).PCore = {
    getLocaleUtils: () => ({
      getLocaleValue: (value: any) => value,
    }),
    getUserApi: () => ({
      getOperatorDetails: () =>
        new Promise((resolve) => {
          resolve(OperatorDetails);
        }),
    }),
  };
};

type Story = StoryObj<PegaExtensionsTournamentProps>;

const PegaExtensionsDisplayBracketsDemo = (inputs: PegaExtensionsTournamentProps) => {
  return {
    render: (args: PegaExtensionsTournamentProps) => {
      setPCore();
      const props = {
        ...args,
        getPConnect: () => {
          return {
            getActionsApi: () => {
              return {
                updateFieldValue: () => {
                  /* nothing */
                },
                triggerFieldChange: () => {
                  /* nothing */
                },
              };
            },
            getCaseSummary: () => {
              return {
                user: ConfigProps.updateOperator.userId,
                dateTimeValue: ConfigProps.updateDateTime,
              };
            },
            ignoreSuggestion: () => {
              /* nothing */
            },
            acceptSuggestion: () => {
              /* nothing */
            },
            setInheritedProps: () => {
              /* nothing */
            },
            resolveConfigProps: () => {
              /* nothing */
            },
          };
        },
      };
      return <PegaExtensionsDisplayBrackets {...props} />;
    },
    args: inputs,
  };
};

export const Default: Story = PegaExtensionsDisplayBracketsDemo({
  JsonField:
    '[{"bracket":[{"title":"Round of 16","seeds":[{"id":"R16-1","date":"2026-03-11","winner":"FC Barcelona","teams":[{"id":"BAR","name":"FC Barcelona"},{"id":"MIL","name":"AC Milan"}]},{"id":"R16-2","date":"2026-03-11","winner":"Liverpool FC","teams":[{"id":"LIV","name":"Liverpool FC"},{"id":"DOR","name":"Borussia Dortmund"}]},{"id":"R16-3","date":"2026-03-12","winner":"Real Madrid","teams":[{"id":"RMA","name":"Real Madrid"},{"id":"PSG","name":"Paris Saint-Germain"}]},{"id":"R16-4","date":"2026-03-12","winner":"Manchester City","teams":[{"id":"MCI","name":"Manchester City"},{"id":"JUV","name":"Juventus"}]},{"id":"R16-5","date":"2026-03-13","winner":"Chelsea FC","teams":[{"id":"CHE","name":"Chelsea FC"},{"id":"INT","name":"Inter Milan"}]},{"id":"R16-6","date":"2026-03-13","winner":"Atlético Madrid","teams":[{"id":"ATM","name":"Atlético Madrid"},{"id":"BAY","name":"Bayern Munich"}]},{"id":"R16-7","date":"2026-03-14","winner":"Ajax","teams":[{"id":"AJA","name":"Ajax"},{"id":"NAP","name":"SSC Napoli"}]},{"id":"R16-8","date":"2026-03-14","winner":"Benfica","teams":[{"id":"BEN","name":"Benfica"},{"id":"POR","name":"FC Porto"}]}]},{"title":"Quarter-finals","seeds":[{"id":"QF-1","date":"2026-03-20","winner":"FC Barcelona","teams":[{"id":"BAR","name":"FC Barcelona"},{"id":"LIV","name":"Liverpool FC"}]},{"id":"QF-2","date":"2026-03-20","winner":"Manchester City","teams":[{"id":"RMA","name":"Real Madrid"},{"id":"MCI","name":"Manchester City"}]},{"id":"QF-3","date":"2026-03-21","winner":"Atlético Madrid","teams":[{"id":"CHE","name":"Chelsea FC"},{"id":"ATM","name":"Atlético Madrid"}]},{"id":"QF-4","date":"2026-03-21","winner":"Benfica","teams":[{"id":"AJA","name":"Ajax"},{"id":"BEN","name":"Benfica"}]}]},{"title":"Semi-finals","seeds":[{"id":"SF-1","date":"2026-03-27","winner":"FC Barcelona","teams":[{"id":"BAR","name":"FC Barcelona"},{"id":"MCI","name":"Manchester City"}]},{"id":"SF-2","date":"2026-03-27","winner":"Benfica","teams":[{"id":"ATM","name":"Atlético Madrid"},{"id":"BEN","name":"Benfica"}]}]},{"title":"Final","seeds":[{"id":"F-1","date":"2026-04-03","winner":"FC Barcelona","teams":[{"id":"BAR","name":"FC Barcelona"},{"id":"BEN","name":"Benfica"}]}]}]}]',
});
