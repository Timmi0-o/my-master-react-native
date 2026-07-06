export function toggleDeleteId(
	deleteIds: string[],
	imageId: string,
): string[] {
	if (deleteIds.includes(imageId)) {
		return deleteIds.filter((id) => id !== imageId)
	}

	return [...deleteIds, imageId]
}
