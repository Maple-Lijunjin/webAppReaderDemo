;(function ($){
    var foo = function (options){
        var self = this;
            self.options = $.extend({
                parent: $("#myForm"),
                register: $("[node-type=register]"),
                submit: $("[node-type=submit]")
            }, options);
        self.bindEvent();
    };

    foo.prototype = {
        bindEvent: function (){
            var self = this;
            self.login();
        },
        login: function (){
            var self = this,
                parent = self.options.parent,
                submit = self.options.submit;


            submit.on("click", function (){
                // debugger;
                var jqXML = $.ajax({
                    url: "/userData",
                    dataType: "json",
                    type: "get",
                    data: parent.serialize()
                });

                jqXML.done(function (data){
                    if(data.code == 200){
                        location.href = "/home";
                    }
                });
            });
        }
    };

    new foo();
})(jQuery);