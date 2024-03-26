import { ControllerProviderContext } from './definitions';
import { createControllerProvider } from './create-provider';
import { useControllerFromContext } from './use-controller-from-context';
import { createControllerContext } from './create-controller-context';

export function createContextForController<TController>(
    useController: () => TController,
): ControllerProviderContext<TController> {
    const context = createControllerContext<TController>();
    return {
        Provider: createControllerProvider(context, useController),
        useController: () => useControllerFromContext(context),
    };
}