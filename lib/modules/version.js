/* @flow */

import { $ } from '../vendor';
import { Module } from '../core/module';
import * as Metadata from '../core/metadata';
import {
	BodyClasses,
	range,
} from '../utils';
import concurrentInstallsTemplate from '../templates/concurrentInstalls.mustache';

export const module: Module<*> = new Module('version');

module.moduleName = 'versionName';
module.category = 'aboutCategory';
module.description = 'versionDesc';
module.alwaysEnabled = true;
module.hidden = true;

const concurrentInstallWiki = '/r/Enhancement/wiki/tutorials/concurrent_installs';

module.beforeLoad = () => {
	addVersionClasses();
};

module.go = () => {
	reportVersion();
	homePage();
	setTimeout(avoidConcurrentInstalls, 3000);
};


function addVersionClasses() {
	BodyClasses.add('res');
	const versionComponents = Metadata.version.split('.');
	for (const i of range(0, versionComponents.length)) {
		BodyClasses.add(`res-v${versionComponents.slice(0, i + 1).join('-')}`);
	}
}


function reportVersion() {
	// report the version of RES to reddit's advisory checker.
	$('<div>', {
		id: 'RESConsoleVersion',
		style: 'display: none;',
		text: Metadata.version,
	}).appendTo(document.body);
}

function avoidConcurrentInstalls() {
	const concurrentInstalls = $('[id=RESConsoleVersion]')
		.toArray()
		.map(e => e.textContent);

	if (concurrentInstalls.length > 1) {
		BodyClasses.add('res-concurrent-installs');
		$(concurrentInstallsTemplate({
			versions: concurrentInstalls,
			wiki: concurrentInstallWiki,
		}))
		.appendTo(document.body);
	}
}

function homePage() {
	if (location.href.includes('reddit.honestbleeps.com/download') || location.href.includes('redditenhancementsuite.com/')) {
		for (const link of document.body.querySelectorAll('.install')) {
			link.classList.add('update');
			link.classList.add('res4'); // if update but not RES 4, then FF users == greasemonkey...
			link.classList.remove('install');
		}
	}
}
