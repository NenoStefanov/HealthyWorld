let router = Sammy('#content', function() {
    this.get('#/', function() {
        $("body").html("App works");
    });
});

export { router };