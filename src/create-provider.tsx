import React from 'react';
import { Context, ProviderProps, Controller } from './definitions';
import { InternalProvider } from './internal-provider';

export function createControllerProvider<TController>(
    context: Context<TController>,
    useController: Controller<TController>,
) {

    //  The actual provider exposed to client once created
    const Provider = (props: ProviderProps) => (
        <InternalProvider
            {...props}
            context={context}
            useController={useController}
        />
    );

    //  The actual provider exposed to client once created
    return Provider;
}