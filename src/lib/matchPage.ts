function findMatchedPath<ITEM>(
	taregt: string,
	list: ITEM[],
	{ extract = (item) => item as string }: { extract?: (item: ITEM) => string } = {}
) {
	const matched = list.find((item) => {
		const path = extract(item);
		return path === taregt;
	});

	return matched;
}

export default findMatchedPath;
