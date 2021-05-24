/** 
 * textarea增强
 * 支持tab缩进 $(".autoarea").textarea_tab();
 */
(function($) {
  $.fn.textarea_tab = function(func){
        this.on(
        'keydown',
        function(e) {
            if (e.shiftKey && e.keyCode == 9) {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;
                var selected = window.getSelection().toString();
                selected = selected.replace(/^\s{4}/g, '').replace(/\n\s{4}/g, '\n');
                this.value = this.value.substring(0, start) + selected + this.value.substring(end);
                this.setSelectionRange(start, start + selected.length);
                func();
            }else if (e.keyCode == 9) {
                e.preventDefault();
                var indent = '    ';
                var start = this.selectionStart;
                var end = this.selectionEnd;
                var selected = window.getSelection().toString();
                selected = indent + selected.replace(/\n/g, '\n' + indent);
                this.value = this.value.substring(0, start) + selected + this.value.substring(end);
                this.setSelectionRange(start + indent.length, start + selected.length);
                func();
            }

        }) 
    }
  $.fn.textarea_alt_s = function(func){
        this.on(
        'keydown',
        function(e) {
            if (e.ctrlKey && e.keyCode == 83) {
                e.preventDefault();
                func();
            }

        }) 
    }
    //jQuery设置聚焦并使光标位置在文字最后
    $.fn.setCursorPosition = function(position){  
        if(this.lengh == 0) return this;  
        return $(this).setSelection(position, position);  
    }  
      
    $.fn.setSelection = function(selectionStart, selectionEnd) {  
        if(this.lengh == 0) return this;  
        input = this[0];  
      
        if (input.createTextRange) {  
            var range = input.createTextRange();  
            range.collapse(true);  
            range.moveEnd('character', selectionEnd);  
            range.moveStart('character', selectionStart);  
            range.select();  
        } else if (input.setSelectionRange) {  
            input.focus();  
            input.setSelectionRange(selectionStart, selectionEnd);  
        }  
      
        return this;  
    }  
      
    $.fn.focusEnd = function(){  
        this.setCursorPosition(this.val().length);  
    }
    $.fn.focusStart = function(){  
        this.setCursorPosition(0);  
    }     
})(jQuery);