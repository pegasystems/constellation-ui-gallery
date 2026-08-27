import {
  Button,
  FormControl,
  FormField,
  Modal,
  Progress,
  useModalManager,
  withConfiguration,
  type ModalMethods,
} from '@pega/cosmos-react-core';
import { getMappedKey } from '../shared/utils';

import '../shared/create-nonce';
import { useRef, useState, useEffect } from 'react';
import StyledList from './styles';

export enum DisplayMode {
  Editable = '',
  DisplayOnly = 'DISPLAY_ONLY',
}

type WidthUnit = 'percent' | 'pixel';

export type DisplayPDFProps = {
  /**  label of the field and title of the pdf */
  label: string;
  /**  contains the binary of the pdf  */
  value: string;
  /**  width of the pdf
   *   @default 100
   */
  width?: number;
  /**  unit used for the PDF width
   *   @default percent
   */
  widthUnit?: WidthUnit;
  /**  height of the pdf in pixels
   *   @default 400
   */
  height?: number;
  /**  display a toolbar on the pdf
   *  @default true
   */
  showToolbar?: boolean;
  /**  if dataPage is set, the component will show the pdf files returned by the DP
   *   the pdf will be displayed in a modal dialog on click
   */
  dataPage?: string;
  /**  hide label of the field
   *  @default false
   */
  hideLabel?: boolean;
  /** display mode */
  displayMode?: 'DISPLAY_ONLY' | '';
  getPConnect: () => typeof PConnect;
};

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);

  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const usePdfObjectUrl = (value: string) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!value) {
      setUrl('');
      return undefined;
    }
    const buf = base64ToArrayBuffer(value);
    const blob = new Blob([buf], { type: 'application/pdf' });
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [value]);

  return url;
};

const ViewPDFModal = ({
  heading,
  height,
  formattedWidth,
  value,
  showToolbar,
}: {
  heading: string;
  formattedWidth: string;
  height: number;
  value: string;
  showToolbar: boolean;
}) => {
  const url = usePdfObjectUrl(value);
  return (
    <Modal heading={heading}>
      {url ? (
        <iframe
          src={`${url}${showToolbar ? '' : '#toolbar=0'}`}
          width={formattedWidth}
          height={`${height}px`}
          title={heading}
        />
      ) : null}
    </Modal>
  );
};

const DisplayPDFEmbed = ({
  label,
  formattedWidth,
  height,
  showToolbar,
  value,
  hideLabel,
}: {
  label: string;
  formattedWidth: string;
  height: number;
  showToolbar: boolean;
  value: string;
  hideLabel: boolean;
}) => {
  const url = usePdfObjectUrl(value);
  return (
    <FormField label={label} labelHidden={hideLabel}>
      <FormControl ariaLabel={label}>
        {url ? (
          <iframe
            name={label}
            src={`${url}${showToolbar ? '' : '#toolbar=0'}`}
            width={formattedWidth}
            height={`${height}px`}
            title={label}
          />
        ) : null}
      </FormControl>
    </FormField>
  );
};

export const PegaExtensionsDisplayPDF = (props: DisplayPDFProps) => {
  const {
    label = '',
    width = 100,
    widthUnit = 'percent',
    height = 400,
    showToolbar = true,
    value,
    hideLabel = false,
    dataPage = '',
    displayMode = DisplayMode.Editable,
    getPConnect,
  } = props;
  const formattedWidth = `${width}${widthUnit === 'pixel' ? 'px' : '%'}`;
  const [loading, setLoading] = useState<boolean>(true);
  const [pdfFiles, setPdfFiles] = useState<any[]>([]);
  const { create } = useModalManager();

  const viewAllModalRef = useRef<ModalMethods<any>>();

  useEffect(() => {
    if (dataPage && getPConnect) {
      const pConn = getPConnect();

      const CaseInstanceKey = pConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);
      const payload = {
        dataViewParameters: { caseInstanceKey: CaseInstanceKey },
      };
      PCore.getDataApiUtils()
        .getData(getMappedKey(dataPage), payload, pConn.getContextName())
        .then((response: any) => {
          if (response.data.data !== null) {
            setPdfFiles(response.data.data);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [dataPage, getPConnect]);

  if (!dataPage) {
    const displayComp = (
      <Button
        variant='link'
        onClick={() => {
          viewAllModalRef.current = create(ViewPDFModal, {
            heading: label,
            height,
            formattedWidth,
            value,
            showToolbar,
          });
        }}
      >
        {label}
      </Button>
    );

    if (displayMode === DisplayMode.DisplayOnly) {
      return displayComp;
    }
    return (
      <DisplayPDFEmbed
        label={label}
        formattedWidth={formattedWidth}
        height={height}
        showToolbar={showToolbar}
        value={value}
        hideLabel={hideLabel}
      />
    );
  }

  if (loading) {
    return (
      <Progress
        placement='local'
        message={PCore.getLocaleUtils().getLocaleValue(
          'Loading content...',
          'Generic',
          '@BASECLASS!GENERIC!PYGENERICFIELDS',
        )}
      />
    );
  }

  return (
    <StyledList>
      {pdfFiles.map((file) => {
        return (
          <li key={file[getMappedKey('pyLabel')]}>
            <Button
              variant='link'
              onClick={() => {
                viewAllModalRef.current = create(ViewPDFModal, {
                  heading: file[getMappedKey('pyLabel')],
                  formattedWidth,
                  height,
                  value: file[getMappedKey('pyContext')],
                  showToolbar,
                });
              }}
            >
              {file[getMappedKey('pyLabel')]}
            </Button>
          </li>
        );
      })}
    </StyledList>
  );
};

export default withConfiguration(PegaExtensionsDisplayPDF);
