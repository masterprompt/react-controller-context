import React from 'react';
import { Controller } from './definitions';
import { createControllerProvider } from './create-provider';

export function createContextForController<TController>(
    useController: Controller<TController>,
) {
    const context = React.createContext<TController>({} as TController);
    console.log('createContextForController:', { context, useController });
    return {
        Provider: createControllerProvider(context, useController),
        useController: () => React.useContext(context),
    };
}