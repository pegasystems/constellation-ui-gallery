import { useEffect, useState } from 'react';
import { withConfiguration, Table } from '@pega/cosmos-react-core';
import { AppAnnouncement as PegaAppAnnouncement } from '@pega/cosmos-react-work';
import type { PConnFieldProps } from './PConnProps';

import StyledPegaExtensionsHrAppraisalReportWrapper from './styles';

// interface for props
interface PegaExtensionsHrAppraisalReportProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
    datasource: Array<any>;
    header: string;
    description: string;
    whatsnewlink: string;
    image: string;
}

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function PegaExtensionsHrAppraisalReport(props: PegaExtensionsHrAppraisalReportProps) {

  const { header, description, datasource = [], whatsnewlink, image, getPConnect } = props;
  const [worklist, setWorklist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const PConnect = getPConnect();
  const dataViewName = 'D_pyMyWorkList';
  const context = PConnect.getContextName();

  let details = [];
  // @ts-ignore
  if (datasource && datasource.source) {
    // @ts-ignore
    details = datasource.source.map((item) => {
      return item.name;
    });
  }

  // setting up columns for the work list table
  const columns = [
    { renderer: 'caseType', label: PConnect.getLocalizedValue('Case type', '', '') },
    { renderer: 'insKey', label: PConnect.getLocalizedValue('Key', '', '') },
    { renderer: 'status', label: PConnect.getLocalizedValue('Status', '', '') },
    { renderer: 'stage', label: PConnect.getLocalizedValue('Stage', '', '') }
  ];

  // going to get data for worklist to put into a table
  // data comes from calling a PCore function to get
  // get data from a data page and a PConnect function
  // to get getContextName
  useEffect(() => {

    PCore.getDataApiUtils()
      .getData(dataViewName, {}, context)
      // @ts-ignore
      .then((response: any) => {
        setIsLoading(false);
        if (response.data.data !== null) {
          // table requires an index or will get setExtraStackFrame error
          setWorklist(
            response.data.data.map((entry: any, index: number) => {
              // mapping the data into the column names
              // MUST have an id/index or will get a setExtraStackFrame error
              // put a key in the table
              return {
                caseType: entry.pxProcessName,
                insKey: entry.pxRefObjectInsName,
                status: entry.pyAssignmentStatus,
                stage: entry.pxTaskLabel,
                id: index
              };
            })
          );
        }
        else {
          setWorklist([]);
          setIsLoading(false);
        }

      })
      .catch((error: any) => {
        setWorklist([]);
        setIsLoading(false);
        console.log(error);
      });
  }, [context]);

  return (
    <StyledPegaExtensionsHrAppraisalReportWrapper>
    <PegaAppAnnouncement
      heading={header}
      description={description}
      details={details}
      whatsNewLink={whatsnewlink}
      image={image.replace(/ /g, '+')}
    />
    <br />
    <Table
      title={PConnect.getLocalizedValue('Work list', '', '')}
      columns={columns}
      data={worklist}
      loading={isLoading}
      loadingMessage={PConnect.getLocalizedValue('Loading Work list', '', '')}
    />
    </StyledPegaExtensionsHrAppraisalReportWrapper>
  );

}

export default withConfiguration(PegaExtensionsHrAppraisalReport);
