import { ControllerProviderContext } from './definitions';
export declare function createContextForController<TController>(useController: () => TController): ControllerProviderContext<TController>;
