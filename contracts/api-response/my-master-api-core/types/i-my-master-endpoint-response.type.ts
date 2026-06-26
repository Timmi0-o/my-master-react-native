export interface IMyMasterEndpointResponse {
	result: {
		data: unknown
		meta?: {
			total: number
			totalCount: number
			limit: number
			page: number
		}
		success?: boolean
	}
	error?: {
		statusCode: number
		message: string
		timestamp: string
		path?: string
		method?: string
		error?: string
	}
}
