(function(){

	var editor = [],
		previewElement,
		consoleElement,
		toolbarElement;

	var editors = [];
	var previewElement, consoleElement;

	function init(){
		previewElement = document.querySelector('.preview');
		consoleElement = document.querySelector('.console');
		toolbarElement = document.querySelector('.toolbar');
		window.addEventListener("message", receiveMessage, false);
	}

	function receiveMessage(message) {
		switch(message.data.type) {
			case 'init':
				if(message.data.preview.visible) {
					document.documentElement.classList.add('has-preview');
				} else {
					document.documentElement.classList.add('no-preview');
				}
				if(message.data.console.visible) {
					document.documentElement.classList.add('has-console');
				} else {
					document.documentElement.classList.add('no-console');
				}
				document.documentElement.classList.add(message.data.layout);
				document.querySelector('.editors').innerHTML = message.data.innerHTML;
				createEditors();
				run();
				document.querySelector('.run').addEventListener('click', run);
				break;
			case 'console.log':
				consoleElement.innerHTML += message.data.arguments.join('<br />') + '<br />';
				consoleElement.scrollTop = consoleElement.scrollHeight;
				break;
			case 'console.error':
				consoleElement.innerHTML += '<span class="console-error">' + message.data.arguments.join('<br />') + '</span><br />';
				consoleElement.scrollTop = consoleElement.scrollHeight;
				break;
		}
	}

	function createEditors() {
		var blocks = document.querySelectorAll('pre code');
		var toolbarTabList = toolbarElement.querySelector('ul');
		[].forEach.call(blocks, function(el){
			var editor = new Editor(el);
			editors.push(editor);

			var tab = document.createElement('li');
			var tabLink = document.createElement('a');
			tabLink.setAttribute('href', '#');
			var tabLinkText = document.createTextNode(editor.title);
			tabLink.appendChild(tabLinkText)
			tab.appendChild(tabLink);
			toolbarTabList.appendChild(tab);

			tabLink.addEventListener('click', function(event){
				event.preventDefault();
				setActiveTab(tabLink.innerHTML);
			});

			editor.tabLink = tabLink;
  	});
  	if(blocks.length > 0) {
  		setActiveTab(editors[0].title);
  	}
	}

	function setActiveTab(tabTitle) {
		editors.forEach(function(editor){
			editor.el.style.display = (editor.title === tabTitle) ? 'block' : 'none';
			editor.tabLink.classList.toggle('selected', (editor.title === tabTitle));
		});
	}

	function getEditorByTitle(title) {
		for(var i = 0; i < editors.length; i++) {
			if(editors[i].title === title) {
				return editors[i];
			}
		}
		return null;
	}

	function getEditorsByLanguage(language) {
		return editors.filter(function(editor){
			return (editor.language === language);
		});
	}

	function concatEditorValues(editors) {
		return editors.reduce(function(previousValue, editor){
			return previousValue + editor.codeMirror.getValue();
		}, '');
	}

	function Editor(el) {
		this.mode = '';
		this.title = '';
		if(el.classList.contains('html')) {
			this.mode = 'htmlmixed';
			this.title = 'html';
			this.language = 'html';
		}
		if(el.classList.contains('javascript')) {
			this.mode = 'javascript';
			this.title = 'js';
			this.language = 'javascript';
		}
		if(el.classList.contains('css')) {
			this.mode = 'css';
			this.title = 'css';
			this.language = 'css';
		}
		if(el.hasAttribute('title')) {
			this.title = el.getAttribute('title');
		}
		//replace it with a textarea inside wrapper
		var wrapper = document.createElement('div');
		wrapper.classList.add('editor');
		//set the data attributes
		wrapper.setAttribute('data-title', this.title);
		wrapper.setAttribute('data-language', this.language);
		wrapper.setAttribute('data-mode', this.mode);
		//insert the textarea
		var textarea = document.createElement('textarea');
		textarea.innerHTML = el.innerHTML;
		wrapper.appendChild(textarea);
		el.parentNode.parentNode.replaceChild(wrapper, el.parentNode);
		//codemirror
		this.codeMirror = CodeMirror.fromTextArea(textarea, {
			lineNumbers: true,
			smartIndent: false,
			indentWithTabs: true,
			mode: this.mode
		});
		this.el = wrapper;
	}

	function run() {
		previewElement.innerHTML = '';

		var previewFrame = document.createElement('iframe');
		previewElement.appendChild(previewFrame);

		var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;

    preview.open();

    preview.write('<script src="js/previewframe.js"></script>');

    injectHTML(preview);
    injectCSS(preview);
    injectJS(preview);

    preview.close();
	}

	function injectHTML(preview) {
		var html = concatEditorValues(getEditorsByLanguage('html'));
		if(html.length === 0) {
			html = '<html><head><title>HTML</title></head><body></body></html>';
		}
    //inject base href tag into html
    var baseTag = document.createElement('base');
    baseTag.setAttribute('href', '../../');
    var doc = document.implementation.createHTMLDocument("");
    doc.documentElement.innerHTML = html;
    doc.documentElement.querySelector('head').appendChild(baseTag);
    preview.write(doc.documentElement.outerHTML);
	}

	function injectCSS(preview) {
		preview.write('<style>' + concatEditorValues(getEditorsByLanguage('css')) + '</style>');
	}

	function injectJS(preview) {
		var js = concatEditorValues(getEditorsByLanguage('javascript'));
		js = 'try{' + js + '}catch(e){console.error(e);}';
		preview.write('<script>' + js + '</script>');
	}

	init();

})();