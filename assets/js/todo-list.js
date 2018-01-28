var socket = io();

/**
  * todo::created
  * Add a todo to the list.
  */
socket.on('todo::created', function(todo) {
    console.log("[socketio todo::created] =====>");
    console.log(todo);

    var template = $($('#todo-template').html());
    template.attr('data-id', todo.id);
    template.find('.message').text(todo.message);
    $('.todoList').prepend(template);
});


/**
  * todo::delete
  * Remove a todo from the list by his id.
  */
socket.on('todo::delete', function(todo) {
    console.log("[socketio todo::delete] =====>");
    console.log(todo);

    if (typeof todo.id != 'undefined') {
        $('li[data-id="' + todo.id + '"]').remove();
    }
})


/**
  * On remove button click.
  * Send an ajax post request and try remove a todo by his id.
  */
$('body').on('click', '.todoRemove', function(event) {
    event.preventDefault();
    var id = $(this).parent().data('id');

    if (typeof id != "undefined") {
        $.ajax({
                type: "POST",
                url: "todo/delete",
                data: {
                    id: id
                }
            })
            .done(function(res) {
                console.log("[remove todo] =====>")
                console.log(res);
            });
    }
});

/**
  * on submit button click or enter click.
  * Send an ajax post request and try add a new todo to the list.
  */
$('#frmTodoForm').on('submit', function(event) {
    event.preventDefault();
    var msg = $('#frmTodoMsg');

    if ((typeof msg != "undefined") && (msg.val() != "")) {
        $.ajax({
                type: "POST",
                url: "todo/add",
                data: {
                    message: msg.val()
                }
            })
            .done(function(res) {
                console.log("[form todo submit] =====>")
                console.log(res);
                if (res.success) {
                    msg.val("");
                }
            });
    }
});