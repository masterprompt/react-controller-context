import { ControllerProviderProps, ControllerProviderOptions } from './definitions';
import React from 'react';
interface Props<TController> extends ControllerProviderProps {
    context: React.Context<TController>;
    useController: (options?: ControllerProviderOptions) => TController;
    options?: ControllerProviderOptions;
}
export declare function ControllerProvider<TController>(props: Props<TController>): React.JSX.Element;
export {};
