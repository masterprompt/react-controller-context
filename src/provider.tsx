import { ControllerProviderProps, ControllerProviderOptions } from './definitions';
import React from 'react';

interface Props<TController> extends ControllerProviderProps {
    context: React.Context<TController>;
    useController: (options?: ControllerProviderOptions) => TController;
    options?: ControllerProviderOptions;
}

export function ControllerProvider<TController>(props: Props<TController>) {
    const {
        context: Context,
        useController,
        children,
        options,
    } = props;

    const controller = useController(options);
    
    return (
        <Context.Provider value={controller}>
            {children}
        </Context.Provider>
    );
}