// @ts-check
const {resolve} = require('path');
const fs = require('fs');
const readdirp = require('readdirp');
const chalk = require('chalk');
const {format} = require('util');
const {performance} = require('perf_hooks');

async function findGlobalVariables(root) {
	const variablesFile = resolve(root, './abstracts/variables.css');

	const fileContents = await fs.promises.readFile(variablesFile, 'utf-8');
	const variables = new Set();

	for (const match of fileContents.match(/--.*:/g)) {
		variables.add(match.replace(':', ''));
	}

	return variables;
}

/**
 * @param {import('fs').PathLike} absoluteFilePath
 * @param {Set<string>} knownVariables
 * @param {Set<string>} unusedVariables
 * @param {import('fs').PathLike} basePath
 */
async function processVariablesInFile(absoluteFilePath, knownVariables, unusedVariables, basePath) {
	const fileContents = await fs.promises.readFile(absoluteFilePath, 'utf-8');
	const variables = fileContents.match(/var\((.*?)\)/g);

	if (!variables) {
		const message = format(
			'%s %s does not contain any variables',
			chalk.yellow('ℹ'),
			absoluteFilePath.toString().replace(basePath + '/', '')
		);
		console.warn(chalk.cyan(message));
		return [];
	}

	const errors = [];

	for (const match of variables) {
		const variable = match.replace('var(', '').replace(')', '');

		if (!(knownVariables.has(variable))) {
			errors.push(variable);
		} else if (unusedVariables.has(variable)) {
			unusedVariables.delete(variable);
		}
	}

	return errors;
}

async function test() {
	const start = performance.now();
	const styleRoot = resolve(__dirname, '../styles/site');
	const variables = await findGlobalVariables(styleRoot);
	const unusedVariables = new Set(variables);

	const allErrors = [];

	for await (const file of readdirp(styleRoot, {
		directoryFilter: ['!abstracts'],
		fileFilter: '*.css',
		type: 'files'
	})) {
		allErrors.push(
			processVariablesInFile(file.fullPath, variables, unusedVariables, styleRoot).then(errors => {
				return {
					path: file.path,
					errors
				}
			})
		);
	}

	const sortedList = (await Promise.all(allErrors)).sort((left, right) => left.errors.length - right.errors.length);
	let fails = 0;

	for (const file of sortedList) {
		if (file.errors.length > 0) {
			fails++;
			console.log('❌ %s', file.path);

			for (const error of file.errors) {
				console.log(chalk.red('  %s'), error);
			}
		} else {
			console.log(chalk.green('✔'), file.path);
		}
	}

	const end = performance.now();
	const timeTaken = end - start;

	if (unusedVariables.size > 0) {
		console.log(chalk.yellow(format('There are %d unused variables', unusedVariables.size)));
		for (const variable of unusedVariables) {
			console.log(chalk.yellow('  %s'), variable);
		}
	}

	console.log(format(
		'Processed %s files in %s with %s %s %s',
		chalk.cyan(sortedList.length),
		chalk.cyan(timeTaken.toFixed(2) + 'ms'),
		fails === 0 ? chalk.green('0') : chalk.red(fails),
		fails === 1 ? 'error' : 'errors',
		fails === 0 ? '🎉' : ''
	));
}

test();
