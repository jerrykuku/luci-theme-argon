'use strict';
'require baseclass';
'require ui';

/**
 * Native JavaScript slide animation utilities
 * Replaces jQuery slideUp/slideDown functionality with better performance
 */
const SlideAnimations = {
	/**
	 * Animation durations in milliseconds
	 */
	durations: {
		fast: 200,
		normal: 400,
		slow: 600
	},

	/**
	 * Map to track running animations and their cleanup functions
	 */
	runningAnimations: new WeakMap(),

	resolveDuration: function(duration) {
		if (typeof duration === 'string')
			return this.durations[duration] || this.durations.normal;
		if (typeof duration === 'number' && duration >= 0)
			return duration;
		return this.durations.normal;
	},

	prefersReducedMotion: function() {
		return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	},

	invokeCallback: function(element, callback) {
		if (callback && typeof callback === 'function') {
			try {
				callback.call(element);
			} catch (e) {
				console.error('SlideAnimations callback error:', e);
			}
		}
	},

	completeImmediately: function(element, callback, cleanupFinalStyles) {
		if (typeof cleanupFinalStyles === 'function')
			cleanupFinalStyles();
		this.invokeCallback(element, callback);
	},

	startTrackedAnimation: function(element, effectiveDuration, callback, cleanupFinalStyles, originalStyles) {
		const finish = () => this.completeAnimation(element, callback, cleanupFinalStyles);
		const onTransitionEnd = (ev) => {
			if (ev.target !== element || ev.propertyName !== 'height')
				return;
			finish();
		};
		const timeoutId = setTimeout(finish, effectiveDuration + 50);

		this.runningAnimations.set(element, { timeoutId, onTransitionEnd, originalStyles });
		element.addEventListener('transitionend', onTransitionEnd);
	},

	completeAnimation: function(element, callback, cleanupFinalStyles) {
		var animationData = this.runningAnimations.get(element);
		if (!animationData)
			return;

		clearTimeout(animationData.timeoutId);
		element.removeEventListener('transitionend', animationData.onTransitionEnd);
		this.runningAnimations.delete(element);

		if (typeof cleanupFinalStyles === 'function')
			cleanupFinalStyles();

		this.invokeCallback(element, callback);
	},

	/**
	 * Slide element down (show) with animation
	 * @param {Element} element - DOM element to animate
	 * @param {string|number} duration - Animation duration ('fast', 'normal', 'slow' or milliseconds)
	 * @param {function} callback - Optional callback function when animation completes
	 */
	slideDown: function(element, duration, callback) {
		if (!element) {
			console.warn('SlideAnimations.slideDown: No element provided');
			return;
		}
		
		// Stop any existing animation on this element
		this.stop(element);
		
		// Convert duration string to milliseconds
		const animDuration = this.resolveDuration(duration);
		const reducedMotion = this.prefersReducedMotion();
		const effectiveDuration = reducedMotion ? 0 : animDuration;
		
		// Store original styles
		const originalStyles = {
			display: element.style.display,
			overflow: element.style.overflow,
			height: element.style.height,
			transition: element.style.transition
		};
		
		// Set initial state for animation
		element.style.display = 'block';
		element.style.overflow = 'hidden';
		element.style.height = '0px';
		element.style.transition = effectiveDuration ? `height ${effectiveDuration}ms ease-out` : '';
		
		// Force reflow to ensure initial state is applied
		element.offsetHeight;
		
		// Get the target height
		const targetHeight = element.scrollHeight;
		
		// Animate to full height
		element.style.height = targetHeight + 'px';

		// Set up finish cleanup
		const cleanupFinalStyles = () => {
			element.style.height = originalStyles.height || '';
			element.style.overflow = originalStyles.overflow || '';
			element.style.transition = originalStyles.transition || '';
		};

		if (!effectiveDuration) {
			this.completeImmediately(element, callback, cleanupFinalStyles);
			return;
		}

		this.startTrackedAnimation(element, effectiveDuration, callback, cleanupFinalStyles, originalStyles);
	},

	/**
	 * Slide element up (hide) with animation
	 * @param {Element} element - DOM element to animate
	 * @param {string|number} duration - Animation duration ('fast', 'normal', 'slow' or milliseconds)
	 * @param {function} callback - Optional callback function when animation completes
	 */
	slideUp: function(element, duration, callback) {
		if (!element) {
			console.warn('SlideAnimations.slideUp: No element provided');
			return;
		}
		
		// Stop any existing animation on this element
		this.stop(element);
		
		// Convert duration string to milliseconds
		const animDuration = this.resolveDuration(duration);
		const reducedMotion = this.prefersReducedMotion();
		const effectiveDuration = reducedMotion ? 0 : animDuration;
		
		// Store original styles
		const originalStyles = {
			display: element.style.display,
			overflow: element.style.overflow,
			height: element.style.height,
			transition: element.style.transition
		};
		
		// Get current height before hiding
		const currentHeight = element.scrollHeight;
		
		// Set initial state for animation
		element.style.overflow = 'hidden';
		element.style.height = currentHeight + 'px';
		element.style.transition = effectiveDuration ? `height ${effectiveDuration}ms ease-out` : '';
		
		// Force reflow to ensure initial state is applied
		element.offsetHeight;
		
		// Animate to zero height
		element.style.height = '0px';

		// Set up finish cleanup
		const cleanupFinalStyles = () => {
			element.style.display = 'none';
			element.style.height = originalStyles.height || '';
			element.style.overflow = originalStyles.overflow || '';
			element.style.transition = originalStyles.transition || '';
		};

		if (!effectiveDuration) {
			this.completeImmediately(element, callback, cleanupFinalStyles);
			return;
		}

		this.startTrackedAnimation(element, effectiveDuration, callback, cleanupFinalStyles, originalStyles);
	},

	/**
	 * Stop all running animations on an element
	 * @param {Element} element - DOM element to stop animations on
	 */
	stop: function(element) {
		if (!element) return;
		
		const animationData = this.runningAnimations.get(element);
		if (animationData) {
			clearTimeout(animationData.timeoutId);
			element.removeEventListener('transitionend', animationData.onTransitionEnd);
			this.runningAnimations.delete(element);

			// Keep current rendered frame and restore base style knobs.
			element.style.transition = animationData.originalStyles.transition || '';
			element.style.overflow = animationData.originalStyles.overflow || '';
		}
	},

	/**
	 * Check if element has running animation
	 * @param {Element} element - DOM element to check
	 * @returns {boolean} - True if element has running animation
	 */
	isAnimating: function(element) {
		return this.runningAnimations.has(element);
	}
};

/**
 * Argon Theme Menu Module
 * Handles rendering and interaction of the main navigation menu and sidebar
 */
return baseclass.extend({
	iconProbeCache: Object.create(null),
	iconResolveCache: Object.create(null),
	iconBasePath: '/luci-static/argon/icon',
	_sidebarEventsBound: false,
	_domRefs: null,

	normalizeIconName: function (input) {
		if (!input)
			return '';

		return String(input)
			.trim()
			.toLowerCase()
			.replace(/[^\w\-]+/g, '_')
			.replace(/_+/g, '_')
			.replace(/^_+|_+$/g, '');
	},

	checkIconExists: function (iconName) {
		if (!iconName)
			return Promise.resolve(false);

		var cached = this.iconProbeCache[iconName];
		if (typeof cached === 'boolean')
			return Promise.resolve(cached);
		if (cached && typeof cached.then === 'function')
			return cached;

		var url = this.iconBasePath + '/' + iconName + '.svg';
		var req = fetch(url, { method: 'HEAD', cache: 'force-cache' })
			.then(function (res) {
				return res.ok;
			})
			.catch(function () {
				return false;
			})
			.then(L.bind(function (exists) {
				this.iconProbeCache[iconName] = exists;
				return exists;
			}, this));

		this.iconProbeCache[iconName] = req;
		return req;
	},

	resolveFirstAvailableIcon: function (candidates) {
		if (!candidates || !candidates.length)
			return Promise.resolve('');

		var cacheKey = candidates.join('|');
		var cached = this.iconResolveCache[cacheKey];
		if (typeof cached === 'string')
			return Promise.resolve(cached);
		if (cached && typeof cached.then === 'function')
			return cached;

		var tryNext = L.bind(function (idx) {
			if (idx >= candidates.length)
				return Promise.resolve('');

			var iconName = candidates[idx];
			return this.checkIconExists(iconName).then(L.bind(function (exists) {
				if (exists)
					return iconName;
				return tryNext(idx + 1);
			}, this));
		}, this);

		var req = tryNext(0).then(L.bind(function (iconName) {
			this.iconResolveCache[cacheKey] = iconName || '';
			return this.iconResolveCache[cacheKey];
		}, this));

		this.iconResolveCache[cacheKey] = req;
		return req;
	},

	resolveMenuIconCandidates: function (linkElement) {
		var candidates = [];
		var dataName = this.normalizeIconName(linkElement.getAttribute('data-name'));
		var dataTitle = this.normalizeIconName(linkElement.getAttribute('data-title'));

		if (dataName)
			candidates.push(dataName);

		if (dataTitle && dataTitle !== dataName)
			candidates.push(dataTitle);

		// Backward compatibility aliases
		if (dataName === 'bandwidth')
			candidates.push('bandwidth_monitor');
		if (dataName === 'logout' || dataName === 'log_out')
			candidates.push('log_out');

		return candidates;
	},

	getMenuNodeTitle: function (node) {
		return String((node && (node.title || node.name)) || '');
	},

	createMenuLink: function (urlParts, title, className, clickHandler, dataName) {
		var attrs = {
			'href': L.url.apply(L, urlParts),
			'class': className || null
		};

		if (clickHandler)
			attrs.click = clickHandler;
		if (dataName) {
			attrs['data-name'] = dataName;
			attrs['data-title'] = title.replace(/\s+/g, '_');
		}

		return E('a', attrs, [_(title)]);
	},

	getDomRefs: function () {
		var refs = this._domRefs || {};

		var refreshRef = function (key, selector) {
			if (!refs[key] || !refs[key].isConnected)
				refs[key] = document.querySelector(selector);
		};

		refreshRef('showSide', 'a.showSide');
		refreshRef('darkMask', '.darkMask');
		refreshRef('mainMenu', '#mainmenu');
		refreshRef('mainRight', '.main-right');
		refreshRef('modeMenu', '#modemenu');
		refreshRef('tabMenu', '#tabmenu');

		this._domRefs = refs;
		return refs;
	},

	applySidebarSvgIcons: function () {
		var refs = this.getDomRefs();
		var menuRoot = refs.mainMenu;
		if (!menuRoot)
			return;

		var links = menuRoot.querySelectorAll('.nav .menu, .nav .food');
		if (!links.length)
			return;

		links.forEach(L.bind(function (link) {
			if (link.classList.contains('menu-icon-svg') && link.style.getPropertyValue('--menu-icon-url'))
				return;

			var candidates = this.resolveMenuIconCandidates(link);
			if (!candidates.length)
				return;

			this.resolveFirstAvailableIcon(candidates).then(L.bind(function (iconName) {
					if (!iconName)
						return;
					link.classList.add('menu-icon-svg');
					link.style.setProperty('--menu-icon-url', 'url("' + this.iconBasePath + '/' + iconName + '.svg")');
				}, this));
		}, this));
	},

	/**
	 * Initialize the menu module
	 * Load menu data and trigger rendering
	 */
	__init__: function () {
		ui.menu.load().then(L.bind(this.render, this));
	},

	/**
	 * Main render function for the menu system
	 * @param {Object} tree - Menu tree structure from LuCI
	 */
	render: function (tree) {
		var node = tree;
		var url = '';

		this.renderModeMenu(node);

		// Render tab menu if we're deep enough in the navigation hierarchy
		if (L.env.dispatchpath.length >= 3) {
			for (var i = 0; i < 3 && node; i++) {
				node = node.children[L.env.dispatchpath[i]];
				url = url + (url ? '/' : '') + L.env.dispatchpath[i];
			}

			if (node) {
				this.renderTabMenu(node, url);
			}
		}

		// Attach event listeners for sidebar toggle functionality
		var refs = this.getDomRefs();
		var sidebarToggle = refs.showSide;
		var darkMask = refs.darkMask;
		
		if (!this._sidebarEventsBound) {
			if (sidebarToggle) {
				sidebarToggle.addEventListener('click', ui.createHandlerFn(this, 'handleSidebarToggle'));
			}
			if (darkMask) {
				darkMask.addEventListener('click', ui.createHandlerFn(this, 'handleSidebarToggle'));
			}
			this._sidebarEventsBound = !!(sidebarToggle || darkMask);
		}

		this.applySidebarSvgIcons();
	},

	/**
	 * Handle menu expand/collapse functionality
	 * Manages the sliding animation and active states of menu items
	 * @param {Event} ev - Click event from menu item
	 */
	handleMenuExpand: function (ev) {
		var target = ev.currentTarget;
		var slide = target.parentNode;
		var slideMenu = target.nextElementSibling;
		var shouldCollapse = false;
		var refs = this.getDomRefs();
		var menuRoot = refs.mainMenu;

		// Close all currently active submenus
		var activeMenus = menuRoot
			? menuRoot.querySelectorAll('.nav > li > ul.active')
			: document.querySelectorAll('.main .main-left .nav > li > ul.active');
		activeMenus.forEach(function (ul) {
			// Remove active classes immediately when starting slideUp animation
			ul.classList.remove('active');
			ul.previousElementSibling.classList.remove('active');
			SlideAnimations.slideUp(ul, 'fast');
			
			// Check if we're clicking on an already open menu (should collapse it)
			if (!shouldCollapse && ul === slideMenu) {
				shouldCollapse = true;
			}
		});

		// Exit if there's no submenu to show
		if (!slideMenu) {
			return;
		}

		// Open the submenu if it's not already open
		if (!shouldCollapse) {
			// Find the slide menu within the slide element
			var slideMenuElement = slide.querySelector(".slide-menu");
			if (slideMenuElement) {
				// Add active classes immediately when starting slideDown animation
				slideMenu.classList.add('active');
				target.classList.add('active');
				SlideAnimations.slideDown(slideMenuElement, 'fast');
			}
			target.blur(); // Remove focus from the clicked element
		}
		
		// Prevent default link behavior and event bubbling
		ev.preventDefault();
		ev.stopPropagation();
	},

	/**
	 * Render the main navigation menu
	 * Creates hierarchical menu structure with active states and click handlers
	 * @param {Object} tree - Menu tree node to render
	 * @param {string} url - Base URL for menu items
	 * @param {number} level - Current nesting level (0-based)
	 * @returns {Element} - Generated menu element
	 */
	renderMainMenu: function (tree, url, level) {
		var currentLevel = (level || 0) + 1;
		var menuContainer = E('ul', { 'class': level ? 'slide-menu' : 'nav' });
		var children = ui.menu.getChildren(tree);

		// Don't render empty menus or menus deeper than 2 levels
		if (children.length === 0 || currentLevel > 2) {
			return E([]);
		}

		// Generate menu items for each child
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var title = this.getMenuNodeTitle(child);
			var isActive = (
				(L.env.dispatchpath[currentLevel] === child.name) && 
				(L.env.dispatchpath[currentLevel - 1] === tree.name)
			);
			
			// Recursively render submenu
			var submenu = this.renderMainMenu(child, url + '/' + child.name, currentLevel);
			var hasChildren = submenu.children.length > 0;
			
			// Determine CSS classes based on state
			var slideClass = hasChildren ? 'slide' : null;
			var menuClass = hasChildren ? 'menu' : 'food';
			var clickHandler = (currentLevel === 1 && hasChildren) ? ui.createHandlerFn(this, 'handleMenuExpand') : null;
			
			if (isActive) {
				menuContainer.classList.add('active');
				slideClass = hasChildren ? 'slide active' : null;
				menuClass += " active";
			}

			// Create menu item with link and submenu
			var menuItem = E('li', { 'class': slideClass }, [
				this.createMenuLink([url, child.name], title, menuClass, clickHandler, child.name),
				submenu
			]);
				
			menuContainer.appendChild(menuItem);
		}

		// Append to main menu container if this is the top level
		if (currentLevel === 1) {
			var refs = this.getDomRefs();
			var mainMenuElement = refs.mainMenu;
			if (mainMenuElement) {
				mainMenuElement.appendChild(menuContainer);
				mainMenuElement.style.display = '';
			}
		}
		
		return menuContainer;
	},

	renderModeMenu: function (tree) {
		var refs = this.getDomRefs();
		var menu = refs.modeMenu;
		var children = ui.menu.getChildren(tree);
		if (!menu)
			return;

		for (var i = 0; i < children.length; i++) {
			var isActive = (L.env.requestpath.length ? children[i].name === L.env.requestpath[0] : i === 0);
			var title = this.getMenuNodeTitle(children[i]);
			if (i > 0)
				menu.appendChild(E([], ['\u00a0|\u00a0']));
			menu.appendChild(E('li', {}, [
				this.createMenuLink([children[i].name], title, isActive ? 'active' : null)
			]));
			if (isActive)
				this.renderMainMenu(children[i], children[i].name);
		}
		if (menu.children.length > 1)
			menu.style.display = '';
	},

	/**
	 * Render tab navigation menu
	 * Creates horizontal tab menu for deeper navigation levels
	 * @param {Object} tree - Menu tree node to render
	 * @param {string} url - Base URL for tab items
	 * @param {number} level - Current nesting level (0-based)
	 * @returns {Element} - Generated tab menu element
	 */
	renderTabMenu: function (tree, url, level) {
		var refs = this.getDomRefs();
		var container = refs.tabMenu;
		var currentLevel = (level || 0) + 1;
		var tabContainer = E('ul', { 'class': 'tabs' });
		var children = ui.menu.getChildren(tree);
		var activeNode = null;
		if (!container)
			return E([]);

		// Don't render empty tab menus
		if (children.length === 0) {
			return E([]);
		}

		// Generate tab items for each child
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var title = this.getMenuNodeTitle(child);
			var isActive = (L.env.dispatchpath[currentLevel + 2] === child.name);
			var activeClass = isActive ? ' active' : '';
			var className = 'tabmenu-item-%s %s'.format(child.name, activeClass);

			var tabItem = E('li', { 'class': className }, [
				this.createMenuLink([url, child.name], title)
			]);
			
			tabContainer.appendChild(tabItem);

			// Store reference to active node for recursive rendering
			if (isActive) {
				activeNode = child;
			}
		}

		// Append tab container to main tab menu element
		container.appendChild(tabContainer);
		container.style.display = '';

		// Recursively render nested tab menus if there's an active node
		if (activeNode) {
			var nestedTabs = this.renderTabMenu(activeNode, url + '/' + activeNode.name, currentLevel);
			if (nestedTabs.children.length > 0) {
				container.appendChild(nestedTabs);
			}
		}

		return tabContainer;
	},

	/**
	 * Handle sidebar toggle functionality
	 * Toggles the mobile/responsive sidebar menu visibility
	 * @param {Event} ev - Click event from sidebar toggle button or dark mask
	 */
	handleSidebarToggle: function (ev) {
		var refs = this.getDomRefs();
		var showSideButton = refs.showSide;
		var sidebar = refs.mainMenu;
		var darkMask = refs.darkMask;
		var scrollbarArea = refs.mainRight;

		// Check if any required elements are missing
		if (!showSideButton || !sidebar || !darkMask || !scrollbarArea) {
			console.warn('Sidebar toggle elements not found');
			return;
		}

		// Toggle sidebar visibility and related states
		var willOpen = !showSideButton.classList.contains('active');
		showSideButton.classList.toggle('active', willOpen);
		sidebar.classList.toggle('active', willOpen);
		scrollbarArea.classList.toggle('active', willOpen);
		darkMask.classList.toggle('active', willOpen);
	}
});
