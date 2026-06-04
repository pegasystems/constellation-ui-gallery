import { useState, useEffect } from 'react';
import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsPageListSwiper } from './index';

type configInfo = {
  value?: Array<any>;
  componentType?: string;
  label?: string;
};

type info = {
  config: configInfo;
  type: string;
  children?: Array<info>;
  getPConnect?: () => any;
};

export default {
  title: 'Templates/Page List Swiper',
  argTypes: {
    getPConnect: {
      table: { disable: true },
    },
  },
  component: PegaExtensionsPageListSwiper,
};

/* ─── Demo data: a list of 5 doctor profiles ─────────────────────────────── */

const doctorFields: Array<info> = [
  {
    config: {
      value: ['Dr. Alice Nguyen', 'Dr. Bob Martinez', 'Dr. Carol Smith', 'Dr. David Lee', 'Dr. Eva Brown'],
      componentType: 'TextInput',
      label: 'Name',
    },
    type: 'ScalarList',
  },
  {
    config: {
      value: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'],
      componentType: 'TextInput',
      label: 'Specialization',
    },
    type: 'ScalarList',
  },
  {
    config: {
      value: ['12 years', '8 years', '20 years', '15 years', '5 years'],
      componentType: 'TextInput',
      label: 'Experience',
    },
    type: 'ScalarList',
  },
  {
    config: {
      value: ['City General Hospital', 'Neuro Care Clinic', "St. Mary's Children Hospital", 'Bone & Joint Center', 'SkinHealth Institute'],
      componentType: 'TextInput',
      label: 'Hospital',
    },
    type: 'ScalarList',
  },
  {
    config: {
      value: ['$250 / visit', '$300 / visit', '$180 / visit', '$220 / visit', '$200 / visit'],
      componentType: 'TextInput',
      label: 'Consultation Fee',
    },
    type: 'ScalarList',
  },
  {
    config: {
      value: ['Mon–Fri, 9am–5pm', 'Tue–Sat, 10am–6pm', 'Mon–Wed, 8am–4pm', 'Mon–Fri, 11am–7pm', 'Thu–Sun, 9am–3pm'],
      componentType: 'TextInput',
      label: 'Availability',
    },
    type: 'ScalarList',
  },
  {
    config: {
      value: ['4.9 ★', '4.7 ★', '4.8 ★', '4.6 ★', '4.5 ★'],
      componentType: 'TextInput',
      label: 'Rating',
    },
    type: 'ScalarList',
  },
];

/* ─── Mock PCore & PConnect ─────────────────────────────────────────────────── */

const genDemoView = () => {
  const demoView: any = {
    name: 'demoView',
    type: 'View',
    config: {
      template: 'PageListSwiper',
      ruleClass: 'Work-',
      inheritedProps: { label: 'Doctor Profiles' },
    },
    children: [
      {
        name: 'A',
        type: 'Region',
        children: doctorFields,
        getPConnect: () => ({
          getRawMetadata: () => demoView.children[0],
        }),
      },
    ],
    classID: 'Work-MyComponents',
  };
  return demoView;
};

const setPCore = (onAcceptProperty: (index: number, value: string) => void) => {
  (window as any).PCore = {
    getLocaleUtils: () => ({
      getLocaleValue: (val: string) => val,
    }),
    getContextTreeManager: () => ({
      addPageListNode: () => {},
    }),
    createPConnect: (config: any) => ({
      getPConnect: () => ({
        getActionsApi: () => ({
          updateFieldValue: (prop: string, value: string) => {
            /* Extract the array index from pageReference: "...Doctors[2]" → 2 */
            const match = (config?.options?.pageReference ?? '').match(/\[(\d+)\]$/);
            const idx = match ? parseInt(match[1], 10) : -1;
            console.log(`Doctor[${idx}]${prop} =`, value);
            onAcceptProperty(idx, value);
          },
        }),
        getContextName: () => '',
      }),
    }),
  };
};

/* ─── Story ─────────────────────────────────────────────────────────────────── */

type Story = StoryObj<typeof PegaExtensionsPageListSwiper>;

const DOCTOR_NAMES = ['Dr. Alice Nguyen', 'Dr. Bob Martinez', 'Dr. Carol Smith', 'Dr. David Lee', 'Dr. Eva Brown'];

export const Default: Story = {
  render: (args) => {
    const demoView = genDemoView();

    /* Track acceptProvider writes: index → 'true' | 'false' */
    const [providerLog, setProviderLog] = useState<Array<{ index: number; value: string }>>([]);

    useEffect(() => {
      setPCore((index, value) => {
        setProviderLog((prev) => {
          /* Replace existing entry for same index, or append */
          const next = prev.filter((e) => e.index !== index);
          return [...next, { index, value }];
        });
      });
    }, []);

    const getPConnect = () => ({
      meta: { name: '' },
      options: { viewName: '' },
      getLocalizedValue: (val: string) => val,
      getContextName: () => 'workarea',
      getTarget: () => 'workarea',
      getActionsApi: () => ({
        updateFieldValue: (_key: string, value: string) => {
          console.log('Decision recorded:', value);
        },
      }),
      getChildren: () => demoView.children,
      getRawMetadata: () => demoView,
      getInheritedProps: () => demoView.config.inheritedProps,
      setInheritedProp: () => {},
      setValue: () => {},
      /* Return pageref so embedDataRef is resolved for the PCore createPConnect call */
      resolveConfigProps: (f: any) => ({ ...f, pageref: 'Doctors' }),
    });

    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <PegaExtensionsPageListSwiper {...args} getPConnect={getPConnect} />

        {/* acceptProvider log panel */}
        {providerLog.length > 0 && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f8f8f8',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            <strong>acceptProvider values (written to doctor page objects):</strong>
            <table style={{ width: '100%', marginTop: '0.5rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '0.25rem 0.5rem' }}>Doctor</th>
                  <th style={{ padding: '0.25rem 0.5rem' }}>acceptProvider</th>
                  <th style={{ padding: '0.25rem 0.5rem' }}>Decision</th>
                </tr>
              </thead>
              <tbody>
                {providerLog
                  .sort((a, b) => a.index - b.index)
                  .map((entry) => (
                    <tr key={entry.index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '0.25rem 0.5rem' }}>{DOCTOR_NAMES[entry.index] ?? `Profile ${entry.index + 1}`}</td>
                      <td style={{ padding: '0.25rem 0.5rem', color: entry.value === 'true' ? '#2e844a' : '#c23934' }}>
                        {entry.value}
                      </td>
                      <td style={{ padding: '0.25rem 0.5rem' }}>
                        {entry.value === 'true' ? '✅ Accepted' : '❌ Rejected'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  },
  args: {
    heading: 'Review Doctor Profiles',
    acceptLabel: 'Accept',
    rejectLabel: 'Reject',
    completionMessage: 'All doctor profiles reviewed!',
    acceptProperty: 'acceptProvider',
  },
};
