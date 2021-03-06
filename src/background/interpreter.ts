// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { InterpreterMessage, PayloadCallback } from '../common/message';
import { DictionaryStringTo } from '../types/common-types';

export class Interpreter {
    protected messageToActionMapping: DictionaryStringTo<PayloadCallback> = {};

    @autobind
    public registerTypeToPayloadCallback(messageType: string, callback: PayloadCallback): void {
        this.messageToActionMapping[messageType] = callback;
    }

    public interpret(message: InterpreterMessage): boolean {
        if (this.messageToActionMapping[message.messageType]) {
            this.messageToActionMapping[message.messageType](message.payload, message.tabId);
            return true;
        }
        return false;
    }
}
