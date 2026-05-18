import { IServiceMaster } from '@/actions/service/models/service.schema'

export const formatServiceMasterName = (master: IServiceMaster): string =>
	[master.surname, master.name, master.patronymic].filter(Boolean).join(' ')
