import React from 'react';
import { Controller } from './definitions';
import { createControllerProvider } from './create-provider';

/**
 * @deprecated Use `createContextBundle` instead, which provides stronger typing
 * and built-in runtime safety (throws when useContext is called outside Provider).
 */
export function createContextForController<TController>(
    useController: Controller<TController>,
) {
    const context = React.createContext<TController>({} as TController);
    return {
        Provider: createControllerProvider(context, useController),
        useController: () => React.useContext(context),
    };
}