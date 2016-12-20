const crypto = require('crypto');
const path = require('path');

const because = function (opts) {
	this.reasons = []; // :{ info: string, callSite: string }[]
	this.res = null; // :{ info: string, callSite: string }

	this.opts = opts || {};

	this.language = "en"; // default to English
	if (opts && opts.language) {
		this.language = opts.language;
		if (!this.translate()) {
			throw new Error(`Language ${opts.language} not supported`);
		}
	}

	this.extra = {
		info: this.extraInfo.bind(this),
	}
};

because.prototype.translate = function(word) {
	const dict = {
		"en" : {
			and: "and",
			because: "because",
		},
		"fr" : {
			and: "et",
			because: "parce que",
		},
		"es" : {
			and: "y",
			because: "porque"
		},
		"slang" : {
			and: "'n'",
			because: "coz"
		}
	}[this.language];

	if (!word) {
		return dict;
	}
	return dict[word];
}

because.prototype.generateCallSitePath = function() {
	const cs = {};
	Error.captureStackTrace(cs);

	const callSiteStack = cs.stack.split("\n")[3].match(/[^\(]*\((.*)\)/)[1];

	const callSitePath = callSiteStack.split(path.sep);

	return ' at ...' + path.sep +
		callSitePath.slice(callSitePath.length - 3).join(path.sep)
};

because.prototype.info = function (s) {
	if (typeof s !== "string") {
		throw new Error("Argument must be a string");
	}

	this.reasons.push({
		info: s,
		callSite: this.generateCallSitePath(),
	});
};

because.prototype.extraInfo = function (s) {
	if (typeof s !== "string") {
		throw new Error("Argument must be a string");
	}
	let reason = this.reasons[this.reasons.length - 1];
	reason.info = reason.info + ` ${this.translate("and")} ` + s;
	this.reasons[this.reasons.length - 1] = reason;
};

because.prototype.generateSpokenExplanation = function(result, reasons) {
	return [result.info].concat(reasons.reverse().map(r => r.info)).join(
		` ${this.translate("because")} `
	) + ".";
}

because.prototype.generateStructuredExplanation = function(result, reasons) {
	return [result.info].concat(reasons.map(
		r => r.info + (this.opts.showCallSite ? ('\n\t' + r.callSite) : '')
	)).join("\n - ");
}

because.prototype.spokenExplanation = function() {
	if (!this.res) {
		throw new Error("No result")
	}
	return this.generateSpokenExplanation(this.res, this.reasons);
};

because.prototype.structuredExplanation = function() {
	if (!this.res) {
		throw new Error("No result")
	}
	return this.generateStructuredExplanation(this.res, this.reasons);
};

because.prototype.customExplanation = function(fn) {
	if (!this.res) {
		throw new Error("No result")
	}
	return fn(this.res, this.reasons);
}

because.prototype.result = function(result) {
	this.res = {
		info: result,
		callSite: this.generateCallSitePath(),
	}
};

module.exports = function (opts) {
	return new because(opts);
}
