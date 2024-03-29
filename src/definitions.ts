import React from 'react';

export type ControllerOptions = object;
export type Controller<TController> = (options?: ControllerOptions) => TController;
export type Context<TController> = React.Context<TController>;

export interface ProviderProps {
    children: React.ReactNode;
    options?: ControllerOptions;
}