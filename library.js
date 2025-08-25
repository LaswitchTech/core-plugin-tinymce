builder.add('inputs','mce', class extends builder.InputClass {

    _init(){

        // Execute Parent
        super._init();

        // Set Additional Properties
        this._properties.tinymce = {};
    }

    _input(){

        // Create Input
        const input = $(document.createElement('div')).addClass('mce form-control');
        input.editor = $(document.createElement('textarea')).attr({
            'id': this._component.id + '-input',
            'name': this._properties.name,
            'autocomplete': this._properties.autocomplete,
        });

        // Return Input
        return input;
    }

    _extend(){

        // Set Self
        const self = this;

        // Initialize config
        this._component.config = {
            height: 400,
            width: '100%',
            menubar: false,
            skin: 'oxide',
        };

        // Configure TinyMCE
        for(const [key, value] of Object.entries(this._properties.tinymce)){
            if(typeof this._component.config[key] !== 'undefined'){
                this._component.config[key] = value;
            }
        }

        // Configure required
        this._component.config.selector = '#' + this._component.id + '-input';
        this._component.config.plugins = [
            'advlist', 'autolink',
            'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
            'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ];
        this._component.config.toolbar = 'undo redo | a11ycheck casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist checklist outdent indent | removeformat | code table help';
        this._component.config.init_instance_callback = function (editor) {
            self._component.input.editor.mce = editor;
            self._component.input.editor.mce.getBody().setAttribute('contenteditable', true);
            var container = $(editor.getContainer());
            container.find('.tox-statusbar').addClass("d-none");
            if (self._component.hasClass('rounded-0')) {
                container.addClass("rounded-0 border-0 m-0");
            } else {
                container.addClass("rounded-0 rounded-end border-0 m-0");
            }
        }
        this._component.config.setup = function (editor) {
            editor.on('change', function(){
                self.onChange();
            });
        };
    }

    _timeout(){

        // Set Self
        const self = this;

        // Execute Parent
        super._timeout();

        // Initialize TinyMCE
        if (typeof this._component.input.editor.mce === 'undefined') {
            tinymce.init(this._component.config);
        }
    }

    val(value = null){

        // Set Self
        const self = this;

        // Check if value is provided
        if (value) {

            // Check if TinyMCE is initialized
            if (typeof this._component.input.editor.mce !== 'undefined') {

                // Set the content of the editor
                this._component.input.editor.mce.setContent(value);
                this._component.input.editor.mce.focus();
            } else {

                // Add an interval to ensure TinyMCE is initialized
                var interval = setInterval(function() {
                    if (typeof self._component.input.editor.mce !== 'undefined') {
                        clearInterval(interval);
                        self._component.input.editor.mce.setContent(value);
                        self._component.input.editor.mce.focus();
                    } else {
                        console.error("TinyMCE is not initialized yet.");
                    }
                }, 100);
            }
        }

        // Return the content of the editor
        if (typeof self._component.input.editor.mce !== 'undefined') {
            return self._component.input.editor.mce.getContent();
        } else {
            return self._component.input.editor.val();
        }
    }
});
