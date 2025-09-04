import React, { useRef, useState, useEffect } from 'react';
import type { KRA, ComKra } from './interfaces';
import type { AppraisalsProps } from './interfaces';

const Appraisals: React.FC<AppraisalsProps> = ({ appraisals }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  };

  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(appraisals);
    // Adjust max-height to content scrollHeight for smooth transition
    contentRefs.current.forEach((el, idx) => {
      if (!el) return;
      const isOpen = activeIndex === idx;
      if (isOpen) {
        el.style.maxHeight = `${el.scrollHeight}px`;
      } else {
        el.style.maxHeight = '0px';
      }
    });
  }, [activeIndex, appraisals]);

  if (!appraisals || appraisals.length === 0) {
    return <p>No appraisal data available.</p>;
  }

  return (
    <div id="appraisalDetailsContainer">
      {appraisals.map((appraisal : any, index) => {

        const formattedDate = (() => {
          if (!appraisal.AppraisalDate) return '-';
          const date = new Date(appraisal.AppraisalDate);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        })();

        return (
        <div key={appraisal.AppraisalDate} className="accordion-item">
          <div
            className={`accordion-header ${activeIndex === index ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => toggleAccordion(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccordion(index);
              }
            }}
          >
            {formattedDate} — Final Rating: {renderStars(appraisal.SystemCalculatedFinalRating)} ({appraisal.SystemCalculatedFinalRating})
          </div>

          <div
            ref={(el) => { contentRefs.current[index] = el; }}
            className={`accordion-content ${activeIndex === index ? 'show' : ''}`}
          >
            {activeIndex === index && (
              <>
                <h3>Performance KRAs</h3>
                <table className="kra-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>KRA</th>
                      <th>Weightage</th>
                      <th>Self Rating</th>
                      <th>Manager Rating</th>
                      <th>Final Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(appraisal.PerformanceKRAs) && appraisal.PerformanceKRAs.length > 0 ? (
                      appraisal.PerformanceKRAs.map((kraItem: KRA) => (
                        <tr key={`${kraItem.PerformanceID}-${kraItem.pxUpdateDateTime}`}>
                          <td style={{ textAlign: 'left' }}>{kraItem.PerformanceName}</td>
                          <td>{kraItem.Weightage}%</td>
                          <td>{kraItem.Emp_SelfRating_Perf ?? '-'}</td>
                          <td>{kraItem.RM_Ratings_Perf ?? '-'}</td>
                          <td>{kraItem.HRFinalRatingValue ?? '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>No KRA data available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <h3>Competency KRAs</h3>
                <table className="kra-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>KRA</th>
                      <th>Weightage</th>
                      <th>Reviewer Rating</th>
                      <th>HR Final Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(appraisal.KRACompRO) && appraisal.KRACompRO.length > 0 ? (
                      appraisal.KRACompRO.map((kraItem: ComKra) => (
                        <tr key={`${kraItem.CompetencyID}-${kraItem.pxUpdateDateTime}`}>
                          <td style={{ textAlign: 'left' }}>{kraItem.CompetencyName}</td>
                          <td>{kraItem.Weightage}%</td>
                          <td>{kraItem.CompReviewerRating}</td>
                          <td>{kraItem.HRCompFinalRatingValue}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>No KRA data available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="comments">
                  <h4>Practice Lead Comments</h4>
                  <p>{appraisal.PLInitialComments || 'N/A'}</p>

                  <h4>HR Final Comments</h4>
                  <p>{appraisal.HRReviewComments || 'N/A'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      ) })}
    </div>
  );
};

export default Appraisals;
