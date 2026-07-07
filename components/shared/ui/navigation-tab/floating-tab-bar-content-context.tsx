import { createContext, useContext, type ReactElement, type ReactNode } from 'react'

const FloatingTabBarContentExtensionContext = createContext(false)

export function FloatingTabBarContentExtensionProvider({
	children,
}: {
	children: ReactNode
}): ReactElement {
	return (
		<FloatingTabBarContentExtensionContext.Provider value={true}>
			{children}
		</FloatingTabBarContentExtensionContext.Provider>
	)
}

export function useFloatingTabBarContentExtension(): boolean {
	return useContext(FloatingTabBarContentExtensionContext)
}
