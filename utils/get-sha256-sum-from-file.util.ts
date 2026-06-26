const bytesToBase64 = (bytes: Uint8Array): string => {
	let binary = ''
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i])
	}

	if (typeof globalThis.btoa === 'function') {
		return globalThis.btoa(binary)
	}

	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	let result = ''

	for (let i = 0; i < binary.length; i += 3) {
		const a = binary.charCodeAt(i)
		const b = i + 1 < binary.length ? binary.charCodeAt(i + 1) : 0
		const c = i + 2 < binary.length ? binary.charCodeAt(i + 2) : 0
		const triplet = (a << 16) | (b << 8) | c

		result += chars[(triplet >> 18) & 0x3f]
		result += chars[(triplet >> 12) & 0x3f]
		result += i + 1 < binary.length ? chars[(triplet >> 6) & 0x3f] : '='
		result += i + 2 < binary.length ? chars[triplet & 0x3f] : '='
	}

	return result
}

export const getSha256SumFromFile = async (uri: string): Promise<string> => {
	const response = await fetch(uri)
	const buffer = await response.arrayBuffer()
	const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)

	return bytesToBase64(new Uint8Array(hashBuffer))
}
