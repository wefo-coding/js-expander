/**
 * JavaScript Expander.
 * 
 * Link:    https://github.com/wefo-coding/js-expander
 * Author:  Florian Otten
 * Website: https://we-fo.de/
 * Version: 0.3.0
 */

(function (global) {
    
    var toggleButtons;
    var globalToggleButtons;
    var expandables;
    
    global.addEventListener('load', initialize);
    
    /* Call this function if the content of the website have changed. For example after the website has been loaded or if content has been loaded asynchronously.  */
    function initialize(){
        expanders = global.document.getElementsByClassName('wefo-expander');
        expandables = global.document.getElementsByClassName('wefo-expandable');
        toggleButtons = global.document.getElementsByClassName('wefo-expander-toggle');
        globalToggleButtons = global.document.getElementsByClassName('wefo-expander-global-toggle');
        
        updateGlobalToggleButtons();

        global.removeEventListener('resize', handleResize);
        global.addEventListener('resize', handleResize);
        
        for(var i = 0; i < toggleButtons.length; i++){
            
            /* Add click handler to toggle buttons. */
            toggleButtons[i].removeEventListener('click', handleToggleButtonClick);
            toggleButtons[i].addEventListener('click', handleToggleButtonClick);
            
            if(toggleButtons[i].classList.contains('wefo-expand-on-hover')){
                
                /* Add mouse over handler to toggle buttons. */
                toggleButtons[i].removeEventListener('mouseover', handleToggleButtonMouseOver);
                toggleButtons[i].addEventListener('mouseover', handleToggleButtonMouseOver);

                /* Add mouse out handler to toggle buttons. */
                toggleButtons[i].removeEventListener('mouseout', handleToggleButtonMouseOut);
                toggleButtons[i].addEventListener('mouseout', handleToggleButtonMouseOut);
            }
        }
        
        for(var i = 0; i < globalToggleButtons.length; i++){
            
            /* Add click handler to global toggle buttons */
            globalToggleButtons[i].removeEventListener('click', handleGlobalToggleButtonClick);
            globalToggleButtons[i].addEventListener('click', handleGlobalToggleButtonClick);
            
            if(globalToggleButtons[i].classList.contains('wefo-expand-on-hover')){
                
                /* Add mouse over handler to global toggle buttons. */
                globalToggleButtons[i].removeEventListener('mouseover', handleGlobalToggleButtonMouseOver);
                globalToggleButtons[i].addEventListener('mouseover', handleGlobalToggleButtonMouseOver);
                
                /* Add mouse out handler to global toggle buttons. */
                globalToggleButtons[i].removeEventListener('mouseout', handleGlobalToggleButtonMouseOut);
                globalToggleButtons[i].addEventListener('mouseout', handleGlobalToggleButtonMouseOut);
            }
        }
        
        
    }
    
    function handleResize(e){
        /* Set maxHeight to none on risize. */
        for(var i = 0; i < expandables.length; i++){
            if(expandables[i].style.maxHeight.match(/^[1-9]/)){ /* max height is set */
                expandables[i].style.maxHeight = 'none';
            }
        }
    }
    
    function handleToggleButtonClick(e){
        var toggleButton = e.target;
        var expander = getClosest(toggleButton, '.wefo-expander');
        if(!expander){
            return;
        }

        if(expander.classList.contains('wefo-expander-hover')){
            expander.classList.remove('wefo-expander-hover');
            return;
        }

        if(expander.classList.contains('wefo-expanded')){
            collapse(expander);
        }
        else{
            var wrapper = getWrapper(expander);
            if(wrapper.classList.contains('wefo-expander-single')){
                var wrapperExpanders = getWrapperExpanders(wrapper);
                for(var j = 0; j < wrapperExpanders.length; j++){
                    if(wrapperExpanders[j].classList.contains('wefo-expanded')){
                        collapse(wrapperExpanders[j]);
                    }
                }
            }
            expand(expander);
        }

        updateGlobalToggleButtons();
    }
    
    function handleToggleButtonMouseOver(e){
        var toggleButton = e.target;
        var expander = getClosest(toggleButton, '.wefo-expander');
        if(expander && !expander.classList.contains('wefo-expanded') && !this.classList.contains('wefo-expander-hover')){
            handleToggleButtonClick(e);
            expander.classList.add('wefo-expander-hover');
        }
    }
    
    function handleToggleButtonMouseOut(e){
        var toggleButton = e.target;
        var expander = getClosest(toggleButton, '.wefo-expander');
        if(expander && expander.classList.contains('wefo-expander-hover') && expander.classList.contains('wefo-expanded')){
            expander.classList.remove('wefo-expander-hover');
            handleToggleButtonClick(e);
        }
    }
    
    function handleGlobalToggleButtonClick(e){
        var toggleButton = e.target;
        if(toggleButton.classList.contains('wefo-expander-hover')){
            toggleButton.classList.remove('wefo-expander-hover');
            return;
        }
        
        var wrapper;
        var wrapperExpanders;
        
        if(! toggleButton.dataset.toggle && !toggleButton.dataset.global){
            return;
        }
        if(toggleButton.dataset.toggle){
            wrapper = getWrapper(toggleButton);
            wrapperExpanders = getWrapperExpanders(wrapper);
        }
        if(toggleButton.dataset.global){
            wrapper = global.document.getElementsByTagName('body')[0];
            wrapperExpanders = wrapper.getElementsByClassName('wefo-expander');
        }
        for(var j = 0; j < wrapperExpanders.length; j++){
            if((toggleButton.dataset.toggle && wrapperExpanders[j].classList.contains(toggleButton.dataset.toggle)) || (toggleButton.dataset.global && wrapperExpanders[j].classList.contains(toggleButton.dataset.global))){
                if(toggleButton.classList.contains('wefo-expanded')){
                    collapse(wrapperExpanders[j]);
                }
                else{
                    expand(wrapperExpanders[j]);
                }
            } else if(wrapper.classList.contains('wefo-expander-single') && wrapperExpanders[j].classList.contains('wefo-expanded')){
                collapse(wrapperExpanders[j]);
            }
        }

        updateGlobalToggleButtons();
    }
    
    function handleGlobalToggleButtonMouseOver(e){
        var toggleButton = e.target;
        if(!toggleButton.classList.contains('wefo-expanded') && !this.classList.contains('wefo-expander-hover')){
            handleGlobalToggleButtonClick(e);
            toggleButton.classList.add('wefo-expander-hover');
        }
    }
    
    function handleGlobalToggleButtonMouseOut(e){
        var toggleButton = e.target;
        if(toggleButton.classList.contains('wefo-expander-hover') && toggleButton.classList.contains('wefo-expanded')){
            toggleButton.classList.remove('wefo-expander-hover');
            handleGlobalToggleButtonClick(e);
        } 
    }
    
    
    function expand(expander){
        
        var parents = getParents(expander, '.wefo-expandable');
        var expandables = getExpandables(expander);
        
        // Bei allen Eltern die maximale Höhe auf none setzten um sie so "freizugeben"
        for(var i = 0; i < parents.length; i++){
            parents[i].style.maxHeight = 'none';
        }
        if(expander.classList.contains('wefo-expandable')){
            expander.style.maxHeight = 'none';
        }
        
        // Alle zugehörigen ausklappbaren Bereiche mit max height 0 initialisieren
        for(var i = 0; i < expandables.length; i++){
            expandables[i].style.maxHeight = '0px';
        }
        
        // Klasse switchen
        expander.classList.add('wefo-expanded');
        
        // Alle zugehörigen ausklappbaren Bereiche auf scroll height setzen
        for(var i = 0; i < expandables.length; i++){
            expandables[i].style.maxHeight = expandables[i].scrollHeight + 'px';
        }
    }
    
    function collapse(expander){
        
        var expandables = getExpandables(expander);
        
        // Alle zugehörigen ausklappbaren Bereiche mit scroll height initialisieren
        for(var i = 0; i < expandables.length; i++){
            expandables[i].style.maxHeight = expandables[i].scrollHeight + 'px';
            expandables[i].offsetHeight; //Trigger a reflow
        }

        // Klasse switchen
        expander.classList.remove('wefo-expanded');

        // Alle zugehörigen ausklappbaren Bereiche auf 0 setzen
        for(var i = 0; i < expandables.length; i++){
            expandables[i].style.maxHeight = '0px';
        }
    }
    
    function updateGlobalToggleButtons(){
        var wrapper;
        var wrapperExpanders;
        var expanded;
        for(var i = 0; i < globalToggleButtons.length; i++){
            expanded = true;
            
            if(globalToggleButtons[i].dataset.toggle){
                wrapper = getWrapper(globalToggleButtons[i]);
                wrapperExpanders = getWrapperExpanders(wrapper);
            }
            if(globalToggleButtons[i].dataset.global){
                wrapper = global.document.getElementsByTagName('body')[0];
                wrapperExpanders = wrapper.getElementsByClassName('wefo-expander');
            }
            
            for(var j = 0; j < wrapperExpanders.length; j++){
                if(((globalToggleButtons[i].dataset.toggle && wrapperExpanders[j].classList.contains(globalToggleButtons[i].dataset.toggle)) || (globalToggleButtons[i].dataset.global && wrapperExpanders[j].classList.contains(globalToggleButtons[i].dataset.global))) && !wrapperExpanders[j].classList.contains('wefo-expanded')){
                    expanded = false;
                    break;
                }
            }
            if(!expanded && globalToggleButtons[i].classList.contains('wefo-expanded')){
                globalToggleButtons[i].classList.remove('wefo-expanded');
            }
            else if(expanded && !globalToggleButtons[i].classList.contains('wefo-expanded')){
                globalToggleButtons[i].classList.add('wefo-expanded');
            }
        }
    }
    
    function getWrapper(element){
        return getClosest(element, '.wefo-expander-wrapper') || global.document.getElementsByTagName('body')[0];
    }
    
    function getWrapperExpanders(wrapper){
        var expanders = [];
        var allExpanders = wrapper.getElementsByClassName('wefo-expander'); // Also from nested Wrappers
        if(wrapper.classList.contains('wefo-expander-nested')){
            return allExpanders();
        }
        for (var i = 0; i < allExpanders.length; i++){
            if((getClosest(allExpanders[i], '.wefo-expander-wrapper') || global.document.getElementsByTagName('body')[0]) === wrapper ){
                expanders.push(allExpanders[i]);
            }
        }
        return expanders;
    }
    
    function getExpandables(expander){
        var expandables = [];
        var allExpandables = expander.getElementsByClassName('wefo-expandable'); // Also from nested Expanders
        for (var i = 0; i < allExpandables.length; i++){
            if(getClosest(allExpandables[i], '.wefo-expander') === expander){
                expandables.push(allExpandables[i]);
            }
        }
        return expandables;
    }
    
    
    /* *
     * Get Parents of HTMLElement by selector.
     * Selector can be a class '.classname', a tag 'tagname' or empty '' to get all parents.
     * */
    function getParents(element, selector){
        selector = selector || '';
        var parents = [];
        
        if(element instanceof HTMLElement){
            for (var parent = element && element.parentElement; parent; parent = parent.parentElement){
                if(
                    selector === '' ||
                    (selector.toLowerCase() === parent.tagName.toLowerCase()) ||
                    (selector.match(/^./) && parent.classList.contains(selector.substring(1)))
                ){
                    parents.push(parent);
                }
            }
        }
        return parents;
    }
    
    /* *
     * Get Closest of HTMLElement by selector.
     * Selector can be a class '.classname', a tag 'tagname' or empty '' to get parent element.
     * */
    function getClosest(element, selector){
        var parents = getParents(element, selector);
        if(parents.length > 0){
            return parents[0];
        }
        return null;
    }
    
}(window));