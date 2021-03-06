// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, Times } from 'typemoq';
import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetTelemetryStatePayload,
} from '../../../../../background/actions/action-payloads';
import { Message } from '../../../../../common/message';
import { ActionMessageDispatcher } from '../../../../../common/message-creators/action-message-dispatcher';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { Messages } from '../../../../../common/messages';
import { IssueFilingServiceProperties } from '../../../../../common/types/store-data/user-configuration-store';

describe('UserConfigMessageCreator', () => {
    const dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
    let testSubject: UserConfigMessageCreator;

    beforeEach(() => {
        dispatcherMock.reset();
        testSubject = new UserConfigMessageCreator(dispatcherMock.object);
    });

    it('dispatches message for setTelemetryState', () => {
        const enableTelemetry = false;
        const payload: SetTelemetryStatePayload = {
            enableTelemetry,
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SetTelemetryConfig,
            payload,
        };

        testSubject.setTelemetryState(enableTelemetry);

        dispatcherMock.verify(dispatcher => dispatcher.dispatchMessage(expectedMessage), Times.once());
    });

    it('dispatches message for setHighContrastModeConfig', () => {
        const enableHighContrast = true;
        const payload: SetHighContrastModePayload = {
            enableHighContrast,
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SetHighContrastConfig,
            payload,
        };

        testSubject.setHighContrastMode(enableHighContrast);

        dispatcherMock.verify(dispatcher => dispatcher.dispatchMessage(expectedMessage), Times.once());
    });

    it('dispatches message for setIssueFilingService', () => {
        const issueFilingServiceName = 'UserConfigMessageCreatorTest bug service name';
        const payload: SetIssueFilingServicePayload = {
            issueFilingServiceName,
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SetIssueFilingService,
            payload,
        };

        testSubject.setIssueFilingService(issueFilingServiceName);

        dispatcherMock.verify(dispatcher => dispatcher.dispatchMessage(expectedMessage), Times.once());
    });

    it('dispatches message for setIssueFilingServiceProperty', () => {
        const payload: SetIssueFilingServicePropertyPayload = {
            issueFilingServiceName: 'bug-service-name',
            propertyName: 'property-name',
            propertyValue: 'property-value',
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SetIssueFilingServiceProperty,
            payload,
        };

        testSubject.setIssueFilingServiceProperty(payload.issueFilingServiceName, payload.propertyName, payload.propertyValue);

        dispatcherMock.verify(dispatcher => dispatcher.dispatchMessage(expectedMessage), Times.once());
    });

    it('dispatches message for saveIssueFilingSettings', () => {
        const issueFilingServiceName = 'UserConfigMessageCreatorTest bug service name';
        const issueFilingSettings: IssueFilingServiceProperties = { name: 'issueFilingSettings' };
        const payload: SaveIssueFilingSettingsPayload = {
            issueFilingServiceName,
            issueFilingSettings: issueFilingSettings,
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SaveIssueFilingSettings,
            payload,
        };

        testSubject.saveIssueFilingSettings(issueFilingServiceName, issueFilingSettings);

        dispatcherMock.verify(dispatcher => dispatcher.dispatchMessage(expectedMessage), Times.once());
    });
});
