import type { StoryObj } from '@storybook/react';
import PegaExtensionsDisplayAttachments from './index';

export default {
  title: 'Widgets/Display Attachments',
  argTypes: {
    dataPage: {
      table: {
        disable: true
      }
    },
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: PegaExtensionsDisplayAttachments
};

/* Simulate download of attachment - The files need to be in the static  storybook folder */
async function getFile(url: string) {
  const response = await fetch(url);
  const details = await response.arrayBuffer();
  return Promise.resolve({ data: details, headers: { 'content-transfer-encoding': 'binary' } });
}

const setPCore = () => {
  (window as any).PCore = {
    getAttachmentUtils: () => {
      return {
        downloadAttachment: (ID: string) => {
          if (ID === 'LINK-ATTACHMENT DEMOURL') {
            return Promise.resolve({ data: 'https://www.pega.com' });
          } else if (ID === 'LINK-ATTACHMENT DEMOPNG') {
            return getFile('/Overview.png');
          } else if (ID === 'LINK-ATTACHMENT DEMODOCX') {
            return getFile('/SampleWord.docx');
          } else if (ID === 'LINK-ATTACHMENT DEMOPDF') {
            return getFile('/SamplePDF.pdf');
          }
        },
        getCaseAttachments: () => {
          return Promise.resolve([
            {
              createdByName: 'John Smith',
              createdBy: 'jsmith',
              createTime: '2024-01-28T14:54:50.323Z',
              name: 'pega.com',
              links: {
                download: {
                  rel: 'self',
                  href: '/attachments/LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T145450.323 GMT',
                  title: 'Retrieve the link',
                  type: 'GET'
                }
              },
              ID: 'LINK-ATTACHMENT DEMOURL',
              mimeType: 'application/octet-stream',
              category: 'URL',
              type: 'URL',
              categoryName: 'URL'
            },
            {
              createdByName: 'Marc Doe',
              extension: 'png',
              fileName: 'DemoFile.png',
              mimeType: 'image/png',
              type: 'FILE',
              categoryName: 'Evidence',
              createdBy: 'marsr',
              createTime: '2024-01-28T13:18:43.205Z',
              name: 'DemoFile',
              links: {
                download: {
                  rel: 'self',
                  href: '/attachments/LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.205 GMT',
                  title: 'Download the attachment',
                  type: 'GET'
                }
              },
              ID: 'LINK-ATTACHMENT DEMOPNG',
              category: 'Evidence'
            },
            {
              createdByName: 'Joe SMith',
              extension: 'docx',
              fileName: 'SampleWord.docx',
              mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              type: 'FILE',
              categoryName: 'File',
              createdBy: 'joe',
              createTime: '2024-01-28T13:18:43.193Z',
              name: 'SampleWord',
              links: {
                download: {
                  rel: 'self',
                  href: '/attachments/LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.193 GMT',
                  title: 'Download the attachment',
                  type: 'GET'
                }
              },
              ID: 'LINK-ATTACHMENT DEMODOCX',
              category: 'File'
            },
            {
              createdByName: 'Marc Doe',
              extension: 'pdf',
              fileName: 'demoPDF.pdf',
              mimeType: 'application/pdf',
              type: 'FILE',
              categoryName: 'File',
              createdBy: 'marsr',
              createTime: '2024-01-28T13:18:43.193Z',
              name: 'demoPDF',
              links: {
                download: {
                  rel: 'self',
                  href: '/attachments/LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.193 GMT',
                  title: 'Download the attachment',
                  type: 'GET'
                }
              },
              ID: 'LINK-ATTACHMENT DEMOPDF',
              category: 'File'
            },
            {
              createdByName: 'Marc Doe',
              extension: 'png',
              fileName: 'Screenshot 2024-01-25.png',
              mimeType: 'image/png',
              type: 'FILE',
              categoryName: 'File',
              createdBy: 'marsr',
              createTime: '2024-01-28T13:18:43.178Z',
              name: 'Screenshot 2024-01-25 PM',
              links: {
                download: {
                  rel: 'self',
                  href: '/attachments/LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.178 GMT',
                  title: 'Download the attachment',
                  type: 'GET'
                }
              },
              ID: 'LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.178 GMT',
              category: 'File'
            },
            {
              createdByName: 'Sue Lee',
              extension: 'png',
              fileName: 'Shipping Label.png',
              mimeType: 'image/png',
              type: 'FILE',
              categoryName: 'Shipping Label',
              createdBy: 'marsr',
              createTime: '2024-01-28T13:18:43.153Z',
              name: 'Shipping Label',
              links: {
                download: {
                  rel: 'self',
                  href: '/attachments/LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.153 GMT',
                  title: 'Download the attachment',
                  type: 'GET'
                }
              },
              ID: 'LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.153 GMT',
              category: 'Shipping Label'
            }
          ]);
        }
      };
    },
    getConstants: () => {
      return {
        CASE_INFO: {}
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return '/case/case-1';
        },
        getActions: () => {
          return {
            ACTION_OPENWORKBYHANDLE: 'openWorkByHandle'
          };
        }
      };
    }
  };
};

type Story = StoryObj<typeof PegaExtensionsDisplayAttachments>;
export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getContextName: () => '',
          getValue: () => 'C-123'
        };
      }
    };
    return <PegaExtensionsDisplayAttachments {...props} />;
  },
  args: {
    heading: 'Display attachments',
    categories: '',
    useLightBox: false,
    displayFormat: 'list'
  }
};
