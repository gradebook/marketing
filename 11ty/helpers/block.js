module.exports = function captureBlockContent(blockName, options) {
	if (!this._blockData) {
		this._blockData = {};
	}

	this._blockData[blockName] = (this._blockData[blockName] || '') + options.fn(this);
};

module.exports.content = function renderBlockContent(blockName, options) {
	if (this._blockData && blockName in this._blockData && Boolean(this._blockData[blockName])) {
		if (options.fn) {
			return options.fn({content: this._blockData[blockName]});
		}

		return this._blockData[blockName];
	}

	if (options.inverse) {
		return options.inverse(this);
	}

	return '';
};
