import { useState } from 'react';
import { Button } from '@pega/cosmos-react-core';
import {
  DentalChartContainer,
  ChartHeader,
  ViewToggleContainer,
  JawContainer,
  ToothContainer,
  ToothButton,
  LegendContainer,
  LegendItem,
  LegendColorSwatch,
} from './styles';

export type DentalChartProps = {
  statusCodes: string[];
  updateToothStatus: (index: number, newStatus: string) => void;
  readOnly?: boolean;
  heading?: string;
  getPConnect?: any;
};

//Helper function to calculate tooth position on a curve
const calculateToothPosition = (index: number, total: number, radius: number) => {
  const angle = (index / (total - 1)) * Math.PI;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  return { x, y };
};

const DentalChart = ({ statusCodes, updateToothStatus, readOnly = false, heading, getPConnect }: DentalChartProps) => {
  const [currentView, setCurrentView] = useState<'maxillary' | 'mandibular'>('maxillary');

  const maxillaryUpper = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const maxillaryLower = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const mandibularUpper = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  const mandibularLower = ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];

  const handleStatusChange = (index: number, newStatus: string) => {
    if (index >= 0) {
      updateToothStatus(index, newStatus);
    }
  };

  const renderTooth = (tooth: number | string, globalIndex: number, position: { x: number; y: number }) => {
    const status = statusCodes[globalIndex] || '';
    const exists = typeof tooth === 'number' || (typeof tooth === 'string' && tooth !== '');

    const cycleStatus = () => {
      if (!exists || readOnly) return;
      let newStatus = '';
      switch (status) {
        case '':
          newStatus = 'M';
          break;
        case 'M':
          newStatus = 'E';
          break;
        case 'E':
          newStatus = '';
          break;
        default:
          newStatus = 'M';
      }
      handleStatusChange(globalIndex, newStatus);
    };

    const getAriaLabel = () => {
      if (!exists) {
        return (
          getPConnect?.().getLocalizedValue?.('Tooth {tooth}, not in patient records') ||
          `Tooth ${tooth}, not in patient records`
        ).replace('{tooth}', String(tooth));
      }
      let statusText = getPConnect?.().getLocalizedValue?.('Healthy');
      let nextStatusText = getPConnect?.().getLocalizedValue?.('Missing (M)');
      if (status === 'M') {
        statusText = getPConnect?.().getLocalizedValue?.('Missing (M)');
        nextStatusText = getPConnect?.().getLocalizedValue?.('Extracted (E)');
      } else if (status === 'E') {
        statusText = getPConnect?.().getLocalizedValue?.('Extracted (E)');
        nextStatusText = getPConnect?.().getLocalizedValue?.('Healthy');
      }

      if (readOnly) {
        return (
          getPConnect?.().getLocalizedValue?.('Tooth {tooth}, status is {status}') ||
          `Tooth ${tooth}, status is ${statusText}`
        )
          .replace('{tooth}', String(tooth))
          .replace('{status}', statusText);
      }
      return (
        getPConnect?.().getLocalizedValue?.('Tooth {tooth}, currently {status}, click to mark as {nextStatus}') ||
        `Tooth ${tooth}, currently ${statusText}, click to mark as ${nextStatusText}`
      )
        .replace('{tooth}', String(tooth))
        .replace('{status}', statusText)
        .replace('{nextStatus}', nextStatusText);
    };

    const getButtonLabel = () => {
      const missingShort = getPConnect?.().getLocalizedValue?.('M');
      const extractedShort = getPConnect?.().getLocalizedValue?.('E');
      if (status === 'M') return `${tooth}${missingShort}`;
      if (status === 'E') return `${tooth}${extractedShort}`;
      return tooth;
    };

    return (
      <ToothContainer key={`${tooth}-${status}`} top={position.y} left={position.x}>
        <ToothButton
          className='tooth-button'
          variant='simple'
          onClick={!exists || readOnly ? undefined : cycleStatus}
          aria-label={getAriaLabel()}
          role='button'
          tabIndex={exists && !readOnly ? 0 : -1}
          status={status}
          exists={exists}
          style={{ cursor: !exists || readOnly ? 'default' : 'pointer' }}
        >
          {getButtonLabel()}
        </ToothButton>
      </ToothContainer>
    );
  };

  const renderViewToggle = () => (
    <ViewToggleContainer role='tablist' aria-label={getPConnect?.().getLocalizedValue?.('Dental chart view selection')}>
      {['Maxillary', 'Mandibular'].map((view) => (
        <Button
          key={view}
          variant={currentView === view.toLowerCase() ? 'primary' : 'secondary'}
          onClick={() => setCurrentView(view.toLowerCase() as 'maxillary' | 'mandibular')}
          role='tab'
          aria-selected={currentView === view.toLowerCase()}
          aria-controls={`${view.toLowerCase()}-teeth-panel`}
          id={`${view.toLowerCase()}-tab`}
        >
          {getPConnect?.().getLocalizedValue?.(view)}
        </Button>
      ))}
    </ViewToggleContainer>
  );

  const renderJaw = (
    viewType: 'maxillary' | 'mandibular',
    upperJaw: (number | string)[],
    lowerJaw: (number | string)[],
  ) => {
    return (
      <JawContainer
        role='tabpanel'
        aria-labelledby={`${viewType}-tab`}
        hidden={currentView !== viewType}
        id={`${viewType}-teeth-panel`}
      >
        {upperJaw.map((tooth, i) => {
          const totalInArch = upperJaw.length;
          const position = calculateToothPosition(i, totalInArch, 12.5);
          const globalIndex = viewType === 'maxillary' ? i : maxillaryUpper.length + maxillaryLower.length + i;
          return renderTooth(tooth, globalIndex, position);
        })}
        {lowerJaw.map((tooth, i) => {
          const totalInArch = lowerJaw.length;
          const position = calculateToothPosition(i, totalInArch, 7.5);
          const globalIndex =
            viewType === 'maxillary'
              ? maxillaryUpper.length + i
              : maxillaryUpper.length + maxillaryLower.length + mandibularUpper.length + i;
          return renderTooth(tooth, globalIndex, position);
        })}
      </JawContainer>
    );
  };

  const renderLegend = () => {
    const legendItems = [
      {
        status: 'healthy',
        label: getPConnect?.().getLocalizedValue?.('Healthy'),
      },
      {
        status: 'missing',
        label: getPConnect?.().getLocalizedValue?.('Missing (M)'),
      },
      {
        status: 'extracted',
        label: getPConnect?.().getLocalizedValue?.('Extracted (E)'),
      },
    ] as const;

    return (
      <LegendContainer role='img' aria-label={getPConnect?.().getLocalizedValue?.('Dental chart legend')}>
        {legendItems.map(({ status, label }) => (
          <LegendItem key={label}>
            <LegendColorSwatch status={status} />
            <span>{label}</span>
          </LegendItem>
        ))}
      </LegendContainer>
    );
  };

  return (
    <DentalChartContainer>
      <ChartHeader>{heading}</ChartHeader>
      {renderViewToggle()}

      {renderJaw('maxillary', maxillaryUpper, maxillaryLower)}
      {renderJaw('mandibular', mandibularUpper, mandibularLower)}

      {renderLegend()}
    </DentalChartContainer>
  );
};

export default DentalChart;
