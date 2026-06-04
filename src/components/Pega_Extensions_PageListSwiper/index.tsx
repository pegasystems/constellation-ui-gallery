/**
 * Pega_Extensions_PageListSwiper
 *
 * Renders pages from a page list one at a time.
 * Each page is shown as a card with all its fields displayed.
 * The user can Accept or Reject the current page to move to the next one.
 *
 * Accepted / rejected indices are reported back to Pega via updateFieldValue.
 */

import { useState, useEffect } from 'react';
import {
  withConfiguration,
  Text,
  Button,
  Flex,
  Card,
  CardContent,
  CardHeader,
  Status,
  Progress,
} from '@pega/cosmos-react-core';
import StyledPageListSwiper from './styles';
import '../shared/create-nonce';

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export type PageListSwiperProps = {
  getPConnect: any;
  heading?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  completionMessage?: string;
  /** Property name on each page list item that stores the yes/no accept decision */
  acceptProperty?: string;
};

type FieldDef = {
  label: string;
  value: Array<any>;
  componentType?: string;
};

type FieldsResult = {
  fields: FieldDef[];
  embedDataRef: string;
};

/* ─── Utility: extract parallel ScalarList fields from the region children ─── */

function getAllFields(getPConnect: any): FieldsResult {
  const metadata = getPConnect().getRawMetadata();
  if (!metadata?.children) return { fields: [], embedDataRef: '' };

  const region = metadata.children[0];
  const children: Array<any> = region?.children ?? [];

  let embedDataRef = '';

  const fields = children
    .filter((child: any) => child.config != null)
    .map((child: any): FieldDef | null => {
      const cfg = child.config;
      // String path from Pega: "@FILTERED_LIST .Doctors[].pyName"
      if (typeof cfg.value === 'string') {
        const dotIdx = cfg.value.indexOf(' .');
        const bracketIdx = cfg.value.indexOf('[].'); 
        if (!embedDataRef && dotIdx !== -1 && bracketIdx !== -1) {
          embedDataRef = cfg.value.substring(dotIdx + 2, bracketIdx);
        }
        const resolved = getPConnect().resolveConfigProps(cfg);
        return {
          label: cfg.label ?? '',
          value: Array.isArray(resolved.value) ? resolved.value : [],
          componentType: cfg.componentType,
        };
      }
      // Pre-resolved array (Storybook demo)
      if (Array.isArray(cfg.value)) {
        const resolved = getPConnect().resolveConfigProps(cfg);
        if (!embedDataRef && resolved.pageref) embedDataRef = resolved.pageref;
        return {
          label: cfg.label ?? '',
          value: cfg.value as Array<any>,
          componentType: cfg.componentType,
        };
      }
      return null;
    })
    .filter(Boolean) as FieldDef[];

  return { fields, embedDataRef };
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

export const PegaExtensionsPageListSwiper = (props: PageListSwiperProps) => {
  const {
    getPConnect,
    heading = 'Review Profiles',
    acceptLabel = 'Accept',
    rejectLabel = 'Reject',
    completionMessage = 'All profiles reviewed',
    acceptProperty = 'acceptProvider',
  } = props;

  const [fields, setFields] = useState<FieldDef[]>([]);
  const [embedDataRef, setEmbedDataRef] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  /** Per-index record of decisions; allows revisiting and changing decisions */
  const [decisions, setDecisions] = useState<Record<number, 'accepted' | 'rejected'>>({});
  /** Index of the currently accepted doctor; null if none accepted */
  const [acceptedIndex, setAcceptedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const totalRows = fields.length > 0 ? fields[0].value.length : 0;
  const currentDecision = decisions[currentIndex];
  /** Cannot navigate past the accepted doctor */
  const maxNavIndex = acceptedIndex !== null ? acceptedIndex : totalRows - 1;
  const hasAccepted = acceptedIndex !== null;
  const allRejected =
    !hasAccepted &&
    totalRows > 0 &&
    Array.from({ length: totalRows }, (_, i) => i).every((i) => decisions[i] === 'rejected');

  useEffect(() => {
    const { fields: loadedFields, embedDataRef: loadedRef } = getAllFields(getPConnect);
    setFields(loadedFields);
    setEmbedDataRef(loadedRef);
    setLoading(false);
  }, [getPConnect]);

  /** Write the yes/no acceptProperty directly onto the doctor's page object */
  const writeAcceptProperty = (index: number, value: 'true' | 'false') => {
    try {
      const messageConfig = {
        meta: props,
        options: {
          context: getPConnect().getContextName(),
          hasForm: true,
          pageReference: `caseInfo.content.${embedDataRef}[${index}]`,
          referenceList: `.${embedDataRef}`,
          viewName: getPConnect().options?.viewName ?? '',
        },
      };
      const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
      c11nEnv.getPConnect().getActionsApi().updateFieldValue(`.${acceptProperty}`, value);
    } catch {
      /* no-op in Storybook / offline mode */
    }
  };

  const handleDecision = (decision: 'accepted' | 'rejected') => {
    if (decision === 'accepted') {
      /* Only one accepted doctor allowed at a time.
         Auto-reject every other already-explored doctor. */
      const newDecisions: Record<number, 'accepted' | 'rejected'> = {};
      Object.entries(decisions).forEach(([key, val]) => {
        const idx = Number(key);
        if (idx !== currentIndex) {
          newDecisions[idx] = 'rejected';
          if (val === 'accepted') writeAcceptProperty(idx, 'false'); // clear old acceptance
        }
      });
      newDecisions[currentIndex] = 'accepted';
      writeAcceptProperty(currentIndex, 'true');
      setDecisions(newDecisions);
      setAcceptedIndex(currentIndex);
    } else {
      /* Rejecting: if this was the accepted doctor, lift the nav cap */
      const wasAccepted = acceptedIndex === currentIndex;
      if (wasAccepted) setAcceptedIndex(null);
      setDecisions((prev) => ({ ...prev, [currentIndex]: 'rejected' }));
      writeAcceptProperty(currentIndex, 'false');
      /* Auto-advance unless already at the navigation limit */
      const newMax = wasAccepted ? totalRows - 1 : maxNavIndex;
      if (currentIndex < newMax) {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  const handleNavigation = (dir: 'prev' | 'next') => {
    setCurrentIndex((prev) =>
      dir === 'prev' ? Math.max(0, prev - 1) : Math.min(maxNavIndex, prev + 1)
    );
  };

  /* ── Loading state ── */
  if (loading) {
    return <Progress placement='local' message='Loading profiles...' />;
  }

  /* ── Empty state ── */
  if (totalRows === 0) {
    return (
      <Card>
        <CardContent>
          <Text variant='secondary'>No profiles to review.</Text>
        </CardContent>
      </Card>
    );
  }

  /* ── Profile card (all navigation and decisions happen inline) ── */
  return (
    <StyledPageListSwiper>
      <Flex container={{ direction: 'column', gap: 1 }}>
        {/* Header bar */}
        <Text variant='h2'>{heading}</Text>

        {/* All-decided summary banner */}
        {(hasAccepted || allRejected) && (
          <div className={`summary-banner summary-banner--${hasAccepted ? 'success' : 'urgent'}`}>
            {hasAccepted
              ? <Status variant='success'>Provider Accepted</Status>
              : <Status variant='urgent'>{completionMessage}</Status>
            }
          </div>
        )}

        {/* Prev / Next navigation row */}
        <Flex container={{ direction: 'row', alignItems: 'center', justify: 'between' }}>
          <Button
            variant='secondary'
            disabled={currentIndex === 0}
            onClick={() => handleNavigation('prev')}
          >← Previous</Button>
          <Text variant='secondary'>{currentIndex + 1} / {totalRows}</Text>
          <Button
            variant='secondary'
            disabled={currentIndex >= maxNavIndex}
            onClick={() => handleNavigation('next')}
          >Next →</Button>
        </Flex>

        {/* Progress pills — clickable to jump; locked beyond the accepted doctor */}
        <Flex container={{ direction: 'row', gap: 0.5 }} className='progress-pills'>
          {Array.from({ length: totalRows }, (_, i) => {
            const locked = i > maxNavIndex;
            return (
              <span
                key={i}
                title={locked ? 'Locked' : `Profile ${i + 1}${decisions[i] ? ` — ${decisions[i]}` : ''}`}
                className={`pill pill--${locked ? 'locked' : (decisions[i] ?? (i === currentIndex ? 'current' : 'pending'))} ${i === currentIndex ? 'pill--active' : ''}`}
                onClick={() => !locked && setCurrentIndex(i)}
              />
            );
          })}
        </Flex>

        {/* Profile card */}
        <Card>
          <CardHeader>
            <Flex container={{ direction: 'row', alignItems: 'center', gap: 1 }}>
              <Text variant='h3'>Profile {currentIndex + 1}</Text>
              {currentDecision === 'accepted' && <Status variant='success'>Accepted</Status>}
              {currentDecision === 'rejected' && <Status variant='urgent'>Rejected</Status>}
            </Flex>
          </CardHeader>
          <CardContent>
            <Flex container={{ direction: 'column', gap: 1 }}>
              {fields.map((field) => (
                <Flex
                  key={field.label}
                  container={{ direction: 'row', gap: 1, alignItems: 'baseline' }}
                  className='field-row'
                >
                  <Text variant='secondary' className='field-label'>{field.label}</Text>
                  <Text className='field-value'>{String(field.value[currentIndex] ?? '—')}</Text>
                </Flex>
              ))}
            </Flex>
          </CardContent>
        </Card>

        {/* Action buttons — Reject is red, Accept is primary blue */}
        <Flex container={{ direction: 'row', gap: 1, justify: 'end' }}>
          <span className='btn-reject-wrapper'>
            <Button
              variant='secondary'
              onClick={() => handleDecision('rejected')}
            >{rejectLabel}</Button>
          </span>
          <Button
            variant='primary'
            onClick={() => handleDecision('accepted')}
          >{acceptLabel}</Button>
        </Flex>
      </Flex>
    </StyledPageListSwiper>
  );
};

export default withConfiguration(PegaExtensionsPageListSwiper);
