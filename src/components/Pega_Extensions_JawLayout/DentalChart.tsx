import { useRef } from 'react';
import { Text } from '@pega/cosmos-react-core';
import {
  DentalChartContainer,
  JawsWrapper,
  JawSection,
  JawTitle,
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
  const maxillaryUpper = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const maxillaryLower = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const mandibularUpper = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  const mandibularLower = ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];

  // Create refs array for all tooth buttons
  const toothRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const totalTeeth = maxillaryUpper.length + maxillaryLower.length + mandibularUpper.length + mandibularLower.length;

  const handleStatusChange = (index: number, newStatus: string) => {
    if (index >= 0) {
      updateToothStatus(index, newStatus);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (globalIndex: number, event: React.KeyboardEvent) => {
    const maxillaryCount = maxillaryUpper.length + maxillaryLower.length;
    const isInMaxillary = globalIndex < maxillaryCount;
    const jawStartIndex = isInMaxillary ? 0 : maxillaryCount;
    const jawEndIndex = isInMaxillary ? maxillaryCount - 1 : totalTeeth - 1;

    let targetIndex = -1;

    switch (event.key) {
      case 'ArrowRight':
        // Move to previous tooth within the same jaw (toward 1/17)
        if (globalIndex > jawStartIndex) {
          targetIndex = globalIndex - 1;
        }
        break;

      case 'ArrowLeft':
        // Move to next tooth within the same jaw (toward 16/32)
        if (globalIndex < jawEndIndex) {
          targetIndex = globalIndex + 1;
        }
        break;

      default:
        return;
    }

    if (targetIndex >= 0 && targetIndex < totalTeeth && toothRefs.current[targetIndex]) {
      event.preventDefault();
      toothRefs.current[targetIndex]?.focus();
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

    // Ensure tabIndex=0 for first tooth in each jaw, -1 for others
    let tabIndex = -1;
    if (!readOnly && exists) {
      if (
        globalIndex === 0 ||
        globalIndex === maxillaryUpper.length + maxillaryLower.length // first mandibular tooth
      ) {
        tabIndex = 0;
      }
    }

    return (
      <ToothContainer key={`tooth-${globalIndex}`} top={position.y} left={position.x}>
        <ToothButton
          ref={(el: HTMLButtonElement | null) => {
            toothRefs.current[globalIndex] = el;
          }}
          className='tooth-button'
          variant='simple'
          onClick={!exists || readOnly ? undefined : cycleStatus}
          onKeyDown={exists && !readOnly ? (e: React.KeyboardEvent) => handleKeyDown(globalIndex, e) : undefined}
          aria-label={getAriaLabel()}
          role='button'
          tabIndex={tabIndex}
          status={status}
          exists={exists}
          style={{ cursor: !exists || readOnly ? 'default' : 'pointer' }}
        >
          {getButtonLabel()}
        </ToothButton>
      </ToothContainer>
    );
  };

  const renderJaw = (
    viewType: 'maxillary' | 'mandibular',
    upperJaw: (number | string)[],
    lowerJaw: (number | string)[],
    title: string,
  ) => {
    return (
      <JawSection tabIndex={-1}>
        <JawTitle>{title}</JawTitle>
        <JawContainer role='region' aria-label={title} id={`${viewType}-teeth-panel`}>
          {upperJaw.map((tooth, i) => {
            const totalInArch = upperJaw.length;
            const position = calculateToothPosition(i, totalInArch, 10.5);
            const globalIndex = viewType === 'maxillary' ? i : maxillaryUpper.length + maxillaryLower.length + i;
            return renderTooth(tooth, globalIndex, position);
          })}
          {lowerJaw.map((tooth, i) => {
            const totalInArch = lowerJaw.length;
            const position = calculateToothPosition(i, totalInArch, 7);
            const globalIndex =
              viewType === 'maxillary'
                ? maxillaryUpper.length + i
                : maxillaryUpper.length + maxillaryLower.length + mandibularUpper.length + i;
            return renderTooth(tooth, globalIndex, position);
          })}
        </JawContainer>
      </JawSection>
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
      <Text variant='h3' as='h3' style={{ marginBottom: '0.5rem' }}>
        {heading}
      </Text>

      {renderLegend()}

      <JawsWrapper>
        {renderJaw(
          'maxillary',
          maxillaryUpper,
          maxillaryLower,
          getPConnect?.().getLocalizedValue?.('Maxillary') || 'Maxillary',
        )}
        {renderJaw(
          'mandibular',
          mandibularUpper,
          mandibularLower,
          getPConnect?.().getLocalizedValue?.('Mandibular') || 'Mandibular',
        )}
      </JawsWrapper>
    </DentalChartContainer>
  );
};

export default DentalChart;
