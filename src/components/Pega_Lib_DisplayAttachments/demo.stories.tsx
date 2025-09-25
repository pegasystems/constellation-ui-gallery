import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsDisplayAttachments, type UtilityListProps } from './index';

export default {
  title: 'Widgets/Display Attachments',
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
  component: PegaExtensionsDisplayAttachments,
};

/* Simulate download of attachment - The files need to be in the static  storybook folder */
async function getFile(url: string) {
  const response = await fetch(url);
  const details = await response.arrayBuffer();
  return Promise.resolve({ data: details, headers: { 'content-transfer-encoding': 'binary' } });
}

const setPCore = () => {
  (window as any).PCore = {
    getMessagingServiceManager: () => {
      return {
        subscribe: () => {
          /* nothing */
        },
        unsubscribe: () => {
          /* nothing */
        },
      };
    },
    getDataApiUtils: () => {
      return {
        getData: () => {
          return Promise.resolve({
            data: {
              data: [
                {
                  pxObjClass: 'Link-Attachment',
                  pxCreateOpName: 'John Smith',
                  pxCreateDateTime: '2024-01-28T14:54:50.323Z',
                  pyMemo: 'pega.com',
                  pzInsKey: 'LINK-ATTACHMENT DEMOURL',
                  pyTopic: 'application/octet-stream',
                  pyCategory: 'URL',
                  pyLabel: 'URL',
                },
                {
                  pxObjClass: 'Link-Attachment',
                  pxCreateOpName: 'Marc Doe',
                  pyFileName: 'demoPDF.pdf',
                  pyTopic: 'application/pdf',
                  pyFileCategory: 'FILE',
                  pyLabel: 'File',
                  pxCreateDateTime: '2024-01-28T13:18:43.193Z',
                  pyMemo: 'demoPDF',
                  pzInsKey: 'LINK-ATTACHMENT DEMOPDF',
                  pyCategory: 'File',
                },
                {
                  pxObjClass: 'Link-Attachment',
                  pyCategory: 'Correspondence',
                  pyMemo: 'Hello',
                  pyTopic: 'application/octet-stream',
                  pxCreateDateTime: '2024-01-28T14:54:50.323Z',
                  pxCreateOpName: 'John Smith',
                  pzInsKey: 'LINK-ATTACHMENT OK5NF|-COMPUTER-WORK F-11015!20240206T121808.330 GMT',
                },
                {
                  pxObjClass: 'Link-Attachment',
                  pyCategory: 'File',
                  pyMemo: 'Demo Word',
                  pyTopic: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  pxCreateDateTime: '2024-01-28T14:54:50.323Z',
                  pxCreateOpName: 'John Smith',
                  pyFileName: 'Test.docx',
                  pzInsKey: 'LINK-ATTACHMENT DEMODOCX',
                },
                {
                  pxObjClass: 'Link-Attachment',
                  pyCategory: 'Image',
                  pyMemo: 'Screenshot',
                  pyTopic: 'image/png',
                  pyFileName: 'demoImage.png',
                  pxCreateDateTime: '2024-01-28T14:54:50.323Z',
                  pxCreateOpName: 'Sue Lee',
                  pzInsKey: 'LINK-ATTACHMENT DEMOPNG',
                },
              ],
            },
          });
        },
      };
    },
    getAttachmentUtils: () => {
      return {
        downloadAttachment: (ID: string) => {
          if (ID === 'LINK-ATTACHMENT DEMOURL') {
            return Promise.resolve({ data: 'https://www.pega.com' });
          } else if (ID === 'LINK-ATTACHMENT DEMOPNG') {
            return getFile('./Overview.png');
          } else if (ID === 'LINK-ATTACHMENT DEMODOCX') {
            return getFile('./SampleWord.docx');
          } else if (ID === 'LINK-ATTACHMENT DEMOPDF') {
            return getFile('./SamplePDF.pdf');
          } else {
            return Promise.resolve({ data: 'https://www.pega.com' });
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
                  type: 'GET',
                },
              },
              ID: 'LINK-ATTACHMENT DEMOURL',
              mimeType: 'application/octet-stream',
              category: 'URL',
              type: 'URL',
              categoryName: 'URL',
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
                  type: 'GET',
                },
              },
              ID: 'LINK-ATTACHMENT DEMOPNG',
              category: 'Evidence',
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
                  type: 'GET',
                },
              },
              ID: 'LINK-ATTACHMENT DEMODOCX',
              category: 'File',
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
                  type: 'GET',
                },
              },
              ID: 'LINK-ATTACHMENT DEMOPDF',
              category: 'File',
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
                  type: 'GET',
                },
              },
              ID: 'LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.178 GMT',
              category: 'File',
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
                  type: 'GET',
                },
              },
              ID: 'LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.153 GMT',
              category: 'Shipping Label',
            },
          ]);
        },
      };
    },
    getConstants: () => {
      return {
        CASE_INFO: {},
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return '/case/case-1';
        },
        getActions: () => {
          return {
            ACTION_OPENWORKBYHANDLE: 'openWorkByHandle',
          };
        },
      };
    },
    getPubSubUtils: () => {
      return {
        publish: () => {
          /* nothing */
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsDisplayAttachments>;

const DisplayAttachmentsDemo = (inputs: UtilityListProps) => {
  return {
    render: (args: UtilityListProps) => {
      setPCore();
      const props = {
        ...args,
        getPConnect: () => {
          return {
            getLocalizedValue: (val: string) => {
              return val;
            },
            getContextName: () => '',
            getValue: () => 'C-123',
          };
        },
      };
      return <PegaExtensionsDisplayAttachments {...props} />;
    },
    args: inputs,
  };
};

export const Default: Story = DisplayAttachmentsDemo({
  heading: 'Display attachments',
  categories: '',
  useLightBox: false,
  useAttachmentEndpoint: true,
  enableDownloadAll: false,
  dataPage: 'D_AttachmentListRO',
  displayFormat: 'list',
  iconName: 'clipboard',
});

export const Tiles: Story = DisplayAttachmentsDemo({
  heading: 'Display attachments',
  categories: '',
  useLightBox: true,
  useAttachmentEndpoint: true,
  enableDownloadAll: true,
  dataPage: 'D_AttachmentListRO',
  displayFormat: 'tiles',
  iconName: 'clipboard',
});
