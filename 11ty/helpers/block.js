module.exports = (content, context, blockName) => {
	if (!context._blockData) {
		context._blockData = {};
	}

	if (context._blockData[blockName]) {
		console.warn('Warning: Duplicate block "%s" used for %s', blockName, context.permalink);
	}

	context._blockData[blockName] = content;
};

module.exports.content = (context, blockName) => {
	return context._blockData && context._blockData[blockName] || '';
};
