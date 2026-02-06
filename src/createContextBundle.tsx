import React, { PropsWithChildren, createContext, useContext } from 'react';

type NoProps = Record<never, never>;

type Controller<R, P extends object = NoProps> = (p: P) => R;

/**
 * Creates a strongly-typed React Context "bundle" from a controller hook.
 *
 * The bundle consists of:
 * - A `context` object (React.Context)
 * - A `Provider` component that calls your controller hook and supplies its return value
 * - A `useContext` hook with built-in error checking
 *
 * This pattern removes boilerplate when wiring up hooks to context and ensures
 * type safety across your component tree.
 *
 * @template R The type returned by the controller hook (the context value).
 * @template P The parameter object type accepted by the controller hook.
 *             Defaults to `NoProps` (an empty object). `children` is excluded automatically.
 *
 * @param {Controller<R, P>} useController
 *   A hook/function that takes parameters `P` and returns a context value `R`.
 * @param {string} name
 *   A human-readable name used for debugging and in error messages. Also
 *   used to set `context.displayName`.
 *
 * @returns {{
 *   context: React.Context<R | undefined>;
 *   Provider: React.FC<React.PropsWithChildren<WithoutChildren<P>>>;
 *   useContext: () => R;
 * }}
 * An object containing:
 * - `context`: The React context instance.
 * - `Provider`: A typed provider component. It calls `useController(rest)` with all
 *   props except `children`, and makes the result available via context.
 * - `useContext`: A hook that retrieves the context value and throws if called
 *   outside the corresponding Provider.
 *
 * @example
 * ```tsx
 * // Step 1: Define your controller hook
 * const useAuthController = ({ initialUser }: { initialUser?: string }) => {
 *   const [user, setUser] = useState(initialUser ?? null);
 *   return { user, setUser };
 * };
 *
 * // Step 2: Create the context bundle
 * const AuthBundle = createContextBundle(useAuthController, 'Auth');
 *
 * // Step 3: Use the Provider
 * <AuthBundle.Provider initialUser="Casey">
 *   <App />
 * </AuthBundle.Provider>
 *
 * // Step 4: Consume via useContext
 * const { user, setUser } = AuthBundle.useContext();
 * ```
 */
export const createContextBundle = <R, P extends object = NoProps>(
    useController: Controller<R, P>,
    name: string,
) => {
    const context = createContext<R | undefined>(undefined);
    context.displayName = `${name}.Context`;

    function Provider(props: P & PropsWithChildren) {
        const { children, ...rest } = props;
        const result = useController(rest as P);
        return <context.Provider value={result}>{children}</context.Provider>;
    }

    function useProviderContext() {
        const ctx = useContext(context);
        if (!ctx) {
            throw new Error(`${name}.useContext must be used within a ${name}.Provider`);
        }
        return ctx;
    }

    return {
        context,
        Provider,
        useContext: useProviderContext,
    };
};

export default createContextBundle;
