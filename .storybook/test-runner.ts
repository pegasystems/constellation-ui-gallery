import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';

import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page, context) {
    try {
      // Get the entire context of a story, including parameters, args, argTypes, etc.
      const storyContext = await getStoryContext(page, context);

      // Apply story-level a11y rules
      await configureAxe(page, {
        rules: storyContext.parameters?.a11y?.config?.rules,
      });

      // Wait a bit to ensure any previous Axe runs have completed
      await page.waitForTimeout(200);

      await checkA11y(page, '#storybook-root', {
        detailedReport: true,
        detailedReportOptions: {
          html: true,
        },
      });
    } catch (error) {
      // If Axe is already running, wait and retry once
      if (error instanceof Error && error.message.includes('Axe is already running')) {
        console.warn('Axe was already running, waiting and retrying...');
        await page.waitForTimeout(1000); // Increased wait time
        await checkA11y(page, '#storybook-root', {
          detailedReport: true,
          detailedReportOptions: {
            html: true,
          },
        });
      } else {
        throw error;
      }
    }
  },
};

export default config;
