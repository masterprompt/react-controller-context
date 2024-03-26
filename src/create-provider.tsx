import {
    ControllerProviderProps,
} from './definitions';
import React from 'react';

import { ControllerProvider } from './provider';

export function createControllerProvider<TController>(
    context: React.Context<TController>,
    useController: () => TController,
): React.FC<ControllerProviderProps> {
    return (props: ControllerProviderProps) => (
        <ControllerProvider
            {...props}
            context={context}
            useController={useController}
        />
    );
}