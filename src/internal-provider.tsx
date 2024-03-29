import React from 'react';
import { ProviderProps, ControllerOptions, Controller, Context } from './definitions';

interface Props<TController> extends ProviderProps {
    context: Context<TController>;
    options?: ControllerOptions;
    useController: Controller<TController>;
}

export function InternalProvider<TController> (props: Props<TController>) {
    const {
        context,
        useController,
        children,
        options
    } = props;

    const controller = useController(options);
    
    return (
        <context.Provider value={controller}>
            {children}
        </context.Provider>
    );
};