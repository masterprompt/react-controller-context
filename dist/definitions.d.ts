import React from 'react';
export type ControllerProviderOptions = object;
export interface ControllerProviderProps {
    children: React.ReactNode;
}
export interface ControllerProviderContext<TController> {
    Provider: React.FC<ControllerProviderProps>;
    useController: (options?: ControllerProviderOptions) => TController;
}
