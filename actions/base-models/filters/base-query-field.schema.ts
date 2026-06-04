import { z } from 'zod'
import { BooleanFilterSchema } from './filter-fields/base-boolean-filter.schema'
import { LimitFilterSchema } from './filter-fields/base-limit-filter.schema'
import { PageFilterSchema } from './filter-fields/base-page-filter.schema'
import { GetActionPresetSchema } from './filter-fields/base-preset-filter.schema'
import { RangeFilterSchema } from './filter-fields/base-range-filter.schema'
import { RequiredIdsFilterSchema } from './filter-fields/base-required-ids-filter.schema'
import { ScalarQueryFieldSchema } from './filter-fields/base-scalar-query-field.schema'
import { SearchFilterSchema } from './filter-fields/base-search-filter.schema'
import { StringFilterSchema } from './filter-fields/base-string-filter.schema'

export const QueryFieldSchema = z.union([
	RangeFilterSchema,
	StringFilterSchema,
	BooleanFilterSchema,
	SearchFilterSchema,
	RequiredIdsFilterSchema,
	GetActionPresetSchema,
	ScalarQueryFieldSchema,
	LimitFilterSchema,
	PageFilterSchema,
])

export type IQueryField = z.infer<typeof QueryFieldSchema>
