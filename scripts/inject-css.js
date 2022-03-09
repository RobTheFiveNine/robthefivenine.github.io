const css = hexo.extend.helper.get('css').bind(hexo);

hexo.extend.injector.register('head_end', () => {
	return css('/css/theme-overrides.css');
});

hexo.extend.injector.register('head_end', () => {
	return css('/css/prism-dracula.css');
});

hexo.extend.injector.register('head_end', () => {
	return css('/css/prism-overrides.css');
});
