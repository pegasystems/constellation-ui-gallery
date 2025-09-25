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

import '../create-nonce';
import { useRef, useState, useEffect } from 'react';
import StyledList from './styles';

export enum DisplayMode {
  Editable = '',
  DisplayOnly = 'DISPLAY_ONLY',
}

export type DisplayPDFProps = {
  /**  label of the field and title of the pdf */
  label: string;
  /**  contains the binary of the pdf  */
  value: string;
  /**  width of the pdf in pixels or %
   *   @default 100%
   */
  width?: string;
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
  getPConnect?: any;
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

const ViewPDFModal = ({
  heading,
  height,
  width,
  value,
  showToolbar,
}: {
  heading: string;
  width: string;
  height: number;
  value: string;
  showToolbar: boolean;
}) => {
  const buf = base64ToArrayBuffer(value);
  const blob = new Blob([buf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  return (
    <Modal heading={heading}>
      <iframe src={`${url}${showToolbar ? '' : '#toolbar=0'}`} width={width} height={`${height}px`} title={heading} />
    </Modal>
  );
};

export const PegaExtensionsDisplayPDF = (props: DisplayPDFProps) => {
  const {
    label = '',
    width = '100%',
    height = 400,
    showToolbar = true,
    value,
    hideLabel = false,
    dataPage = '',
    displayMode = DisplayMode.Editable,
    getPConnect,
  } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [pdfFiles, setPdfFiles] = useState<any[]>([]);
  const { create } = useModalManager();

  const viewAllModalRef = useRef<ModalMethods<any>>();

  useEffect(() => {
    if (dataPage && getPConnect) {
      const pConn = getPConnect();

      const CaseInstanceKey = pConn.getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
      const payload = {
        dataViewParameters: [{ caseInstanceKey: CaseInstanceKey }],
      };
      (window as any).PCore.getDataApiUtils()
        .getData(dataPage, payload, pConn.getContextName())
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
            width,
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
    const buf = base64ToArrayBuffer(value);
    const blob = new Blob([buf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return (
      <FormField label={label} labelHidden={hideLabel}>
        <FormControl ariaLabel={label}>
          <iframe
            name={label}
            src={`${url}${showToolbar ? '' : '#toolbar=0'}`}
            width={width}
            height={`${height}px`}
            title={label}
          />
        </FormControl>
      </FormField>
    );
  }

  if (loading) {
    return (
      <Progress
        placement='local'
        message={(window as any).PCore.getLocaleUtils().getLocaleValue(
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
          <li key={file.pyLabel}>
            <Button
              variant='link'
              onClick={() => {
                viewAllModalRef.current = create(ViewPDFModal, {
                  heading: file.pyLabel,
                  width,
                  height,
                  value: file.pyContext,
                  showToolbar,
                });
              }}
            >
              {file.pyLabel}
            </Button>
          </li>
        );
      })}
    </StyledList>
  );
};

export default withConfiguration(PegaExtensionsDisplayPDF);
