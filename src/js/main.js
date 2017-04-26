//========================================================================
//Begin all initial scripts
//========================================================================
(($, window, document) => {
	'use strict';

  $('#mainForm').submit(function(event) {
    event.preventDefault();

    let textAreaHtml = document.getElementById('cssStylesArea');
    let blinkStyles = document.getElementById('blinkStyles');

    function notifyMessage(word) {
      console.log(word);
    }

    function addStylesOnPage(){
      let styles = document.createElement('style');
      styles.type = 'text/css';
      styles.id = 'blinkStyles';
      styles.innerHTML = textAreaHtml.value;
      document.getElementsByTagName('body')[0].appendChild(styles);
      notifyMessage('Styles Added');
    }

    function removeStylesOnPage() {
      document.getElementsByTagName('body')[0].removeChild(blinkStyles);
      notifyMessage('Styles Removed');
    }

    if (blinkStyles  === null) {
      notifyMessage('Blink style Not exist');
      addStylesOnPage();
    } else {
      notifyMessage('Blink style Exist');
      removeStylesOnPage();
      addStylesOnPage();
    }
  });

})(jQuery, window, document);
//========================================================================
//end all initial scripts
//========================================================================