// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from '../common/environment-info-provider';
import { IndexedDBAPI } from '../common/indexedDB/indexedDB';
import { StateDispatcher } from '../common/state-dispatcher';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { IssueFilingControllerImpl } from '../issue-filing/common/issue-filing-controller-impl';
import { IssueFilingServiceProvider } from '../issue-filing/issue-filing-service-provider';
import { AssessmentsProvider } from './../assessments/types/assessments-provider';
import { AssessmentActionCreator } from './actions/assessment-action-creator';
import { GlobalActionHub } from './actions/global-action-hub';
import { BrowserAdapter } from './browser-adapters/browser-adapter';
import { CommandsAdapter } from './browser-adapters/commands-adapter';
import { StorageAdapter } from './browser-adapters/storage-adapter';
import { CompletedTestStepTelemetryCreator } from './completed-test-step-telemetry-creator';
import { FeatureFlagsController } from './feature-flags-controller';
import { PersistedData } from './get-persisted-data';
import { GlobalActionCreator } from './global-action-creators/global-action-creator';
import { IssueFilingActionCreator } from './global-action-creators/issue-filing-action-creator';
import { UserConfigurationActionCreator } from './global-action-creators/user-configuration-action-creator';
import { GlobalContext } from './global-context';
import { Interpreter } from './interpreter';
import { LocalStorageData } from './storage-data';
import { GlobalStoreHub } from './stores/global/global-store-hub';
import { TelemetryEventHandler } from './telemetry/telemetry-event-handler';

export class GlobalContextFactory {
    public static createContext(
        browserAdapter: BrowserAdapter,
        telemetryEventHandler: TelemetryEventHandler,
        userData: LocalStorageData,
        assessmentsProvider: AssessmentsProvider,
        telemetryDataFactory: TelemetryDataFactory,
        indexedDBInstance: IndexedDBAPI,
        persistedData: PersistedData,
        issueFilingServiceProvider: IssueFilingServiceProvider,
        environmentInfo: EnvironmentInfo,
        storageAdapter: StorageAdapter,
        commandsAdapter: CommandsAdapter,
    ): GlobalContext {
        const interpreter = new Interpreter();

        const globalActionsHub = new GlobalActionHub();
        const globalStoreHub = new GlobalStoreHub(
            globalActionsHub,
            telemetryEventHandler,
            browserAdapter,
            userData,
            assessmentsProvider,
            indexedDBInstance,
            persistedData,
            storageAdapter,
        );

        const featureFlagsController = new FeatureFlagsController(globalStoreHub.featureFlagStore, interpreter);

        globalStoreHub.initialize();

        const issueFilingController = new IssueFilingControllerImpl(
            issueFilingServiceProvider,
            browserAdapter,
            environmentInfo,
            globalStoreHub.userConfigurationStore,
        );

        const issueFilingActionCreator = new IssueFilingActionCreator(interpreter, telemetryEventHandler, issueFilingController);
        const actionCreator = new GlobalActionCreator(globalActionsHub, interpreter, commandsAdapter, telemetryEventHandler);
        const assessmentActionCreator = new AssessmentActionCreator(
            globalActionsHub.assessmentActions,
            telemetryEventHandler,
            interpreter.registerTypeToPayloadCallback,
        );
        const userConfigurationActionCreator = new UserConfigurationActionCreator(interpreter, globalActionsHub.userConfigurationActions);

        issueFilingActionCreator.registerCallbacks();
        actionCreator.registerCallbacks();
        assessmentActionCreator.registerCallbacks();
        userConfigurationActionCreator.registerCallback();

        const dispatcher = new StateDispatcher(browserAdapter.sendMessageToAllFramesAndTabs, globalStoreHub);
        dispatcher.initialize();

        const assessmentChangeHandler = new CompletedTestStepTelemetryCreator(
            globalStoreHub.assessmentStore,
            assessmentsProvider,
            telemetryDataFactory,
            interpreter,
        );
        assessmentChangeHandler.initialize();

        return new GlobalContext(interpreter, globalStoreHub, featureFlagsController);
    }
}
