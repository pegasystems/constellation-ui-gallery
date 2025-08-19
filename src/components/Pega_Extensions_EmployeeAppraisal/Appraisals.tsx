import React, { useRef, useState, useEffect } from 'react';
import type { KRA } from './interfaces';
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
      {appraisals.map((appraisal, index) => (
        <div key={appraisal.Year} className="accordion-item">
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
            {appraisal.Year} — Final Rating: {renderStars(appraisal.score)} — Score: {appraisal.score}%
          </div>

          <div
            ref={(el) => { contentRefs.current[index] = el; }}
            className={`accordion-content ${activeIndex === index ? 'show' : ''}`}
          >
            {activeIndex === index && (
              <>
              {Array.isArray(appraisal.KRA) && appraisal.KRA.length > 0 ? (
                appraisal.KRA.map((kraItem: KRA) => (
                  <table key={kraItem.ID} className="kra-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>KRA Category</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'left' }}>Learning</td>
                        <td>{kraItem.Learning}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left' }}>Leadership</td>
                        <td>{kraItem.Leadership}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left' }}>Job Knowledge</td>
                        <td>{kraItem.JobKnowledge}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left' }}>Communication Skills</td>
                        <td>{kraItem.CommunicationSkills}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left' }}>Flexibility</td>
                        <td>{kraItem.Flexibility}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left' }}>Initiative</td>
                        <td>{kraItem.Initiative}</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left' }}>Policy Adherence</td>
                        <td>{kraItem.PolicyAdherence}</td>
                      </tr>
                    </tbody>
                  </table>
                ))
              ) : (
                <p>No KRA data available.</p>
              )}

                <div className="comments">
                  <h4>Employee Comments</h4>
                  <p>{appraisal.EmployeeComments}</p>
                  <h4>Manager Comments</h4>
                  <p>{appraisal.ManagerComments}</p>
                  <h4>HR Final Comments</h4>
                  <p>{appraisal.HRFinalComments}</p>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Appraisals;
