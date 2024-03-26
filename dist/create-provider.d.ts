import { ControllerProviderProps } from './definitions';
import React from 'react';
export declare function createControllerProvider<TController>(context: React.Context<TController>, useController: () => TController): React.FC<ControllerProviderProps>;
