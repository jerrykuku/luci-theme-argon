'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');
const createRenderer = require('./helpers/render-templates');

const templates = path.join(__dirname, '../ucode/template/themes/argon');

test('application and login compose the same head with their own resource boundaries', () => {
	const renderer = createRenderer(templates);
	try {
		for (const entry of ['application', 'sysauth']) {
			const { html, contentTypes } = renderer.render(entry, {
				hostname: 'Test Router', node: { title: 'Settings', css: 'extra.css' }, css: '.fixture { color: red; }',
				settings: { mode: 'dark', primary: '#123456', dark_primary: '#abcdef', blur: '0', transparency: '0.7' }
			});
			assert.deepEqual(contentTypes, ['text/html; charset=UTF-8']);
			assert.equal((html.match(/<!DOCTYPE html>/g) || []).length, 1);
			assert.match(html, /<title>Test Router - Settings - LuCI<\/title>/);
			assert.match(html, /data-argon-mode="dark"/);
			assert.match(html, /name="theme-color" content="#abcdef"/);
			assert.match(html, /--light-primary: #123456/);
			assert.match(html, /--blur-radius-light:0px/);
			assert.match(html, /--blur-opacity-light:0.7/);
			assert.ok(html.indexOf('/css/cascade.css') < html.indexOf('/extra.css'));
			assert.ok(html.indexOf('/extra.css') < html.indexOf('.fixture { color: red; }'));
			assert.match(html, /var luciLocation =/);
			if (entry === 'application') {
				assert.match(html, /name="argon-menu-icons" content="default.svg status.svg"/);
				assert.match(html, /\/luci\.js\?v=test-build/);
				assert.match(html, /L\.require\('menu-argon'\)/);
				assert.match(html, /L\.require\('argon-sshkeys'\)/);
			} else {
				assert.doesNotMatch(html, /argon-menu-icons|\/luci\.js|\/cbi\.js|L\.require/);
			}
		}
		assert.equal((renderer.render('headers-twice').html.match(/<!DOCTYPE html>/g) || []).length, 1);
	} finally { renderer.close(); }
});

test('login partials retain image/video, branding and authentication scope and script order', () => {
	const renderer = createRenderer(templates);
	try {
		const { html } = renderer.render('sysauth', {
			settings: { login_style: 'centered' }, backgrounds: ['background.webm'],
			branding: { logo: 'custom.png', favicon: 'custom.png' },
			fuser: 'root', auth_plugin: 'otp', auth_message: 'Enter one-time code',
			auth_fields: [{ name: 'luci_otp', label: 'One-time code', type: 'text', placeholder: 'Code "123456"', maxlength: 6, inputmode: 'numeric', pattern: '[0-9]*', autocomplete: 'one-time-code', required: true }],
			auth_html: '<div id="auth-widget">Challenge</div>', auth_assets: [{ type: 'script', src: '/auth-plugin.js' }]
		});
		assert.match(html, /data-login-style="centered"/);
		assert.match(html, /\/branding\/custom.png/);
		assert.match(html, /<video loop muted playsinline id="video"/);
		assert.match(html, /background.webm" type="video\/webm"/);
		assert.match(html, /prefers-reduced-motion: reduce/);
		assert.match(html, /Enter one-time code/);
		assert.doesNotMatch(html, /Invalid username and\/or password/);
		assert.match(html, /maxlength="6"/);
		assert.match(html, /title="Code &quot;123456&quot;"/);
		assert.match(html, /autocomplete="one-time-code"/);
		assert.ok(html.indexOf('id="auth-widget"') < html.indexOf('src="/auth-plugin.js"'));
		assert.ok(html.indexOf('src="/auth-plugin.js"') < html.indexOf('input.focus()'));
		const image = renderer.render('sysauth', { configExists: false, backgrounds: [] }).html;
		assert.match(image, /data-login-style="classic"/);
		assert.match(image, /class="main-bg"/);
		assert.match(image, /img\/bg1.jpg/);
		assert.doesNotMatch(image, /<video|--light-primary:/);
		assert.match(renderer.render('sysauth', { fuser: 'root' }).html, /Invalid username and\/or password/);
	} finally { renderer.close(); }
});
