(function(){

	var button = document.getElementById('button'),
    wrapper = document.getElementById('nav-wrapper');

    //open and close menu when the button is clicked
	var open = false;
	button.addEventListener('click', handler, false);

	function handler(){
	  if(!open){
	    this.innerHTML = "Close";
	    classie.add(wrapper, 'opened-nav');
	  }
	  else{
	    this.innerHTML = '<img src="http://i.imgur.com/4KJSwfj.png" width="100%" height="100%" />';
		classie.remove(wrapper, 'opened-nav');
	  }
	  open = !open;
	}
	function closeWrapper(){
		classie.remove(wrapper, 'opened-nav');
	}

})();

$(document).ready(function() {
    wrapper = document.getElementById('nav-wrapper');
    setTimeout(function() {
        classie.add(wrapper, 'opened-nav');
        setTimeout(function() {
            classie.remove(wrapper, 'opened-nav');
        }, 2000);
    }, 2000);
});