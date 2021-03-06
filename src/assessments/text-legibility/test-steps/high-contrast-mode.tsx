// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { link } from '../../../content/link';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { TextLegibilityTestStep } from './test-step';

const highContrastModeDescription: JSX.Element = (
    <span>Websites and web apps must honor high contrast appearance settings and functions.</span>
);

const highContrastModeHowToTest: JSX.Element = (
    <div>
        Google Chrome and Microsoft Edge Insider do not support Windows' high contrast mode.
        <ol>
            <li>Open the target page in Microsoft Edge.</li>
            <li>
                Use <Markup.Term>Windows Settings</Markup.Term> > <Markup.Term>Ease of Access</Markup.Term> >{' '}
                <Markup.Term>Color & high contrast</Markup.Term> to apply a high contrast theme.
            </li>
            <li>Verify that the target page adopts the colors specified for the theme.</li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const HighContrastMode: Requirement = {
    key: TextLegibilityTestStep.highContrastMode,
    name: 'High contrast mode',
    description: highContrastModeDescription,
    howToTest: highContrastModeHowToTest,
    isManual: true,
    guidanceLinks: [link.InteroperabilityWithAT],
};
