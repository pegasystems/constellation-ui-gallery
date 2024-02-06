import { useState, useRef, useEffect } from 'react';
import {
  registerIcon,
  Modal,
  Flex,
  Card,
  Text,
  EmptyState,
  useModalManager,
  SummaryList,
  SummaryItem,
  Configuration,
  Lightbox,
  Grid
} from '@pega/cosmos-react-core';
import type {
  SummaryListItem,
  ModalMethods,
  LightboxItem,
  LightboxProps
} from '@pega/cosmos-react-core';
import { downloadBlob, addAttachment } from './utils';
import { StyledCardContent, StyledHeading } from './styles';

import * as polarisIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/polaris.icon';
import * as informationIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/information.icon';
import * as clipboardIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/clipboard.icon';

import * as downloadIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/download.icon';
import * as timesIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/times.icon';

import * as videoIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/play-solid.icon';
import * as audioIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/speaker-on-solid.icon';
import * as documentIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/filetype-text.icon';
import * as messageIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/mail-solid.icon';
import * as spreadsheetIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/grid-solid.icon';
import * as presentationIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/slideshow-solid.icon';
import * as archiveIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/archive-solid.icon';
import * as pictureIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/picture-solid.icon';
import * as openIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/open.icon';
import * as paperClipIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/paper-clip.icon';

/* To register more icon, you need to import them as shown above */
registerIcon(
  polarisIcon,
  informationIcon,
  clipboardIcon,
  downloadIcon,
  timesIcon,
  videoIcon,
  audioIcon,
  documentIcon,
  messageIcon,
  spreadsheetIcon,
  presentationIcon,
  archiveIcon,
  pictureIcon,
  openIcon,
  paperClipIcon
);

type UtilityListProps = {
  heading: string;
  useAttachmentEndpoint: boolean;
  categories?: string;
  dataPage: string;
  icon?: 'information' | 'polaris' | 'clipboard';
  displayFormat?: 'list' | 'tiles';
  useLightBox?: boolean;
  getPConnect: any;
};

export default function PegaExtensionsDisplayAttachments(props: UtilityListProps) {
  const {
    heading = 'List of objects',
    useAttachmentEndpoint = true,
    dataPage = '',
    categories = '',
    displayFormat = 'summaryList',
    icon = 'clipboard',
    useLightBox = false,
    getPConnect
  } = props;
  const { create } = useModalManager();
  const [attachments, setAttachments] = useState<Array<SummaryListItem>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [elemRef, setElemRef] = useState<HTMLElement>();
  const [images, setImages] = useState<LightboxProps['items'] | null>(null);

  const viewAllModalRef = useRef<ModalMethods<any>>();

  const viewAllModal = () => {
    return (
      <Configuration>
        <Modal heading={heading} count={attachments.length} progress={loading}>
          <SummaryList items={attachments} />
        </Modal>
      </Configuration>
    );
  };

  const onLightboxItemClose = () => {
    setImages(null);
    elemRef?.focus();
  };

  const onLightboxItemDownload = async (id: LightboxItem['id']) => {
    images?.forEach((image: any) => {
      if (image.id === id) {
        downloadBlob(image.blob, image.name, image.mimeType);
      }
    });
  };

  const loadAttachments = (response: Array<any> = []) => {
    const listOfAttachments: Array<any> = [];
    const listOfCategories = categories.split(',');
    response.forEach((attachment: any) => {
      const currentCategory = attachment.category?.trim() || attachment.pyCategory?.trim();
      if (useAttachmentEndpoint) {
        /* Filter the attachment categories */
        if (categories && listOfCategories.length > 0) {
          let isValidCategory = false;
          listOfCategories.forEach((categoryVal: string) => {
            if (currentCategory.toLocaleLowerCase() === categoryVal.trim().toLocaleLowerCase()) {
              isValidCategory = true;
            }
          });
          if (!isValidCategory) return;
        }
      } else {
        attachment = {
          ...attachment,
          category: attachment.pyCategory,
          name: attachment.pyMemo,
          ID: attachment.pzInsKey,
          type: attachment.pyFileCategory,
          fileName: attachment.pyFileName,
          mimeType: attachment.pyTopic,
          categoryName: attachment.pyLabel,
          createTime: attachment.pxCreateDateTime,
          createdByName: attachment.pxCreateOpName
        };
      }
      addAttachment({
        currentCategory,
        attachment,
        listOfAttachments,
        getPConnect,
        setImages,
        useLightBox,
        setElemRef
      });
    });
    setAttachments(listOfAttachments);
    setLoading(false);
  };

  useEffect(() => {
    const pConn = getPConnect();
    if (useAttachmentEndpoint) {
      const attachmentUtils = (window as any).PCore.getAttachmentUtils();
      const caseID = pConn.getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
      attachmentUtils
        .getCaseAttachments(caseID, pConn.getContextName())
        .then((resp: any) => loadAttachments(resp))
        .catch(() => {
          setLoading(false);
        });
    } else {
      const CaseInstanceKey = pConn.getValue(
        (window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID
      );
      const payload = {
        dataViewParameters: [{ LinkRefFrom: CaseInstanceKey }]
      };
      (window as any).PCore.getDataApiUtils()
        .getData(dataPage, payload, pConn.getContextName())
        .then((response: any) => {
          if (response.data.data !== null) {
            loadAttachments(response.data.data);
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [categories, useLightBox, useAttachmentEndpoint]);

  return (
    <Configuration>
      <Flex container={{ direction: 'column' }}>
        {displayFormat === 'list' ? (
          <SummaryList
            name={heading}
            headingTag='h3'
            icon={icon}
            count={loading ? undefined : attachments.length}
            items={attachments?.slice(0, 3)}
            loading={loading}
            noItemsText='No items'
            onViewAll={() => {
              viewAllModalRef.current = create(viewAllModal);
            }}
          />
        ) : (
          <Flex container={{ direction: 'column' }}>
            <Text variant='h2' as={StyledHeading}>
              {heading}
            </Text>
            {attachments?.length > 0 ? (
              <Grid
                container={{ pad: 0, gap: 1 }}
                xl={{ container: { cols: 'repeat(6, 1fr)', rows: 'repeat(6, 1fr)' } }}
                lg={{ container: { cols: 'repeat(4, 1fr)', rows: 'repeat(6, 1fr)' } }}
                md={{ container: { cols: 'repeat(4, 1fr)', rows: 'repeat(6, 1fr)' } }}
                sm={{ container: { cols: 'repeat(2, 1fr)', rows: 'repeat(6, 1fr)' } }}
                xs={{ container: { cols: 'repeat(1, 1fr)', rows: 'repeat(6, 1fr)' } }}
              >
                {attachments.map((attachment: any) => (
                  <Card as={StyledCardContent}>
                    <SummaryItem {...attachment}></SummaryItem>
                  </Card>
                ))}
              </Grid>
            ) : (
              <EmptyState message='No items' />
            )}
          </Flex>
        )}
        {images && (
          <Lightbox
            items={images}
            onAfterClose={onLightboxItemClose}
            onItemDownload={onLightboxItemDownload}
          />
        )}
      </Flex>
    </Configuration>
  );
}
