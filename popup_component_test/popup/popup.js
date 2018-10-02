//global level objects
//can go to a framework level
var YDL = {};

//self invoking function defines the module pattern inside it
(function(scope) {
	//validate the arguments passed. For demo this is empty
	function _validateArgs(args) {
		return true;
	}
	/* Function to create the pop up's header */
	function _createPopUpHeader(title)
	{
	    var modalWindowHeader = null;
	    //create header for modal window area
	    modalWindowHeader = document.createElement("div");
	    modalWindowHeader.className = "modalWindowHeader";
	    modalWindowHeader.innerHTML = "<p>" + title + "</p>";
	    return modalWindowHeader;
	}
	/* Function to create the pop up's body */
	function _createPopUpContent(msg, callBackRef, scope)
	{
	    var modalWindowContent = null;
	    //create modal window content area
	    modalWindowContent = document.createElement("div");
	    modalWindowContent.className = "modalWindowContent";
	    modalWindowContent.innerHTML = "<p style='text-align:center; margin-top:10px;'>" + msg + "</p>";
	     //create the place order button
	    var okBtn = document.createElement("div");
	    okBtn.className = "redBtn okBtn";
	    okBtn.innerHTML = "<p>Close</p>";
	    okBtn.addEventListener('click', function() {callBackRef.apply(scope)}, false);
	    modalWindowContent.appendChild(okBtn);
	    return modalWindowContent;
	}

	//constructor function
	function PopUp() {
		//private attributes inside the CLASS
		var _isShowing = false,
			_args = null;

		//public methods
		this.show = function(args) {
			var that = this;
			if(!_isShowing && _validateArgs(args)) {
				console.log(args);
				_args = args;
				this.overlayElement = document.createElement("div");
			    this.overlayElement.className = 'modalOverlay';
			    this.modalWindowElement = document.createElement("div");
			    this.modalWindowElement.className = 'modalWindow';

			    //position modal window element
			    this.modalWindowElement.style.width = args.width + "px";
			    this.modalWindowElement.style.height = args.height + "px";
			    console.log(((Math.random()*(window.innerWidth - args.width) / 2)));
			    this.modalWindowElement.style.left = ((Math.random()*(window.innerWidth - args.width) / 2)) + "px";
			    this.modalWindowElement.style.top = ((Math.random()*(window.innerHeight - args.height) / 2) + 20) + "px";
			    //add childs
			    this.modalWindowElement.appendChild(_createPopUpHeader(args.headerMsg));
			    this.modalWindowElement.appendChild(_createPopUpContent(args.bodyMsg, this.hide, this));

			    if(args.modal) {
			    	document.body.appendChild(this.overlayElement);
				}
			    document.body.appendChild(this.modalWindowElement);
			    setTimeout(function() {
			        that.modalWindowElement.style.opacity = 1;
			        that.overlayElement.style.opacity = 0.4;
			        that.overlayElement.addEventListener('click', function() {that.hide();}, false);
			    }, 300);
				_isShowing = true;
			}
		};

		this.hide = function() {
			var that = this;
			if(_isShowing) {
				//console.log('hiding');
				this.modalWindowElement.style.opacity = 0;
			    this.overlayElement.style.opacity = 0;
			    this.overlayElement.removeEventListener('click', function() {this.hide();}, false);
			    setTimeout(function() {
			    	if(_args.modal) {
			        	document.body.removeChild(that.overlayElement);
			        	that.overlayElement = null;
			    	}
			        document.body.removeChild(that.modalWindowElement);
			        that.modalWindowElement = null;
			    }, 400);
				_isShowing = false;
			}
		}
	};

	//Exposed Public API
	scope.PopUp = PopUp;
})(YDL);