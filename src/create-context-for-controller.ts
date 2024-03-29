import React from 'react';
import { Controller } from './definitions';
import { createControllerProvider } from './create-provider';

export function createContextForController<TController>(
    useController: Controller<TController>,
) {
    const context = React.createContext<TController>({} as TController);
    return {
        Provider: createControllerProvider(context, useController),
        useController: () => React.useContext(context),
    };
}