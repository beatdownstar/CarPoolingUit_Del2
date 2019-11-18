let activeChats = [];
let pendingMessages = {};
let fetchingMessages = false;

$(document).ready(function() {
    initChat();
    let oShow = $.fn.show;
    $.fn.show = function() {
        this.removeClass("d-none");
        return oShow.apply(this, arguments);
    };

    let oHide = $.fn.hide;
    $.fn.hide = function() {
        this.addClass('d-none');
        return oHide.apply(this, arguments);
    };
});


function initChat() {
    //$('.chat-window').hide();

    $.each($('.toggle-chat'), function() {
       let $this = $(this);
       $this.on('click', function() {
          let id = 'trip-chat-' + $this.data('chat-id');
          let $chatWindow = $('#' + id);
          if ($chatWindow.is(":hidden") || !$chatWindow.length) {
              $chatWindow.show();
              chatWindowEvent($this.data('chat-id'), 'open');
          }
          //chatWindowEvent(id, 'open');
          let $chatMessages = $chatWindow.find($('.chat-contents'));
          $chatMessages.show();
          scrollToBottom($chatMessages.find($('.card-body')));
       });
       //$this.trigger('click');
    });


    checkActiveChats();
    setInterval(getUnreadMessages, 5000);

}

function addActiveChat(id) {
    if (!activeChats.includes(id)) {
        activeChats.push(id);
    }
}

function getUnreadMessages() {
    activeChats.forEach(function(id) {
        getMessages(id, false);
    });
}


function queueSelfMessage(tripId, message) {
    if (typeof pendingMessages[tripId] === 'undefined' )
        pendingMessages[tripId] = [];
    pendingMessages[tripId].push(message);
    getUnreadMessages();
}


function addSelfMessage() {
    Object.keys(pendingMessages).forEach(function(tripId) {
        let $chatMessages = $('#trip-chat-' + tripId).find($('.chat-messages'));
        let messages = pendingMessages[tripId];

        messages.forEach(function (message) {

            message = message.replace(/\n\s*\n\s*\n/g, '\n\n');

            $.post("chatActions.php", {'action': 'save', 'message': message, 'tripId': tripId}, function () {})
            .done(function (data) {
                if (data !== '-1') {
                    let msgId = data;

                    let $msgLi = $("<li class='chat-message-self'></li>").append(message.replace(/\n\s*\n\s*\n/g, '\n\n'));
                    $msgLi.attr('id', 'message-' + msgId);

                    $chatMessages.append($msgLi);
                    wrapClusters(tripId);
                }
            })
            .fail(function (data) {
                alert("Error: " + data);
            });
        });
    });
    pendingMessages = {};
}

function getMessages(tripId, all) {

        fetchingMessages = true;

        let action = all ? 'getAll' : 'getUnread';
        let params = {'action': action, 'tripId': tripId};

        if (!all) {
            let lastId = getLastReadId(tripId);
            if (lastId > -1) {
                params.lastReadId = getLastReadId(tripId);
            }
        }

        $.post("chatActions.php", params, function () {

        })
            .done(function (data) {
                if (data !== '-1') {
                    let $chatMessages = $('#trip-chat-' + tripId).find($('.chat-messages'));
                    $chatMessages.append(data);
                    //scrollToBottom($chatMessages.find($('.card-body')));
                }
            })
            .always(function () {
                wrapClusters(tripId);
                fetchingMessages = false;
                addSelfMessage();
            })
            .fail(function (data) {
                alert("Error: " + data);
            });

}

function wrapClusters(tripId) {
    let $chatMessages = $('#trip-chat-' + tripId).find($('.chat-messages'));

    $chatMessages.find($('.chat-messages > .chat-message-self:not(.chat-message-self + .chat-message-self), :not(.chat-message-self) + .chat-message-self')).each(function() {
        let $this = $(this);
        let $prev = $(this).prev();
        if ($prev.hasClass('chat-message-cluster') && $prev.find($('.chat-message-self')).length) {
            $prev.append($this);
        } else {
            $(this).nextUntil(':not(.chat-message-self)').addBack().wrapAll('<div class="chat-message-cluster"/>');
        }
    });

    $chatMessages.find($('.chat-messages > .chat-message-other:not(.chat-message-other + .chat-message-other), :not(.chat-message-other) + chat-message-other')).each(function() {
        let $this = $(this);
        let $prev = $(this).prev();
        if ($prev.hasClass('chat-message-cluster') && $prev.data('author-id') === $this.data('author-id')) {
                $prev.append($this);
        } else {
            $this.
            nextUntil(':not(.chat-message-other)').
            addBack().
            wrapAll('<div class="chat-message-cluster" data-author-id="' + $(this).data('author-id')+ '"/>');
        }
        if (!$this.parent().find($('.chat-label-div')).length) {
            $(this).parent().prepend('<div class="chat-label-div d-inline-block" data-author-id="' + $(this).data('author-id')+ '"><small>' + $(this).data('author-name') + '</small></div>');
        }
    });

    //scrollToBottom($chatMessages.find($('.card-body')));
}

function scrollToBottom($element) {
    if ($element.length)
        $element.scrollTop($element[0].scrollHeight);
}

function getLastReadId(tripId) {
    let idString = $('#trip-chat-' + tripId).find($('.chat-messages')).find($('[id^=message-]').last()).attr('id');
    let id = -1;
    if (typeof idString !== 'undefined') {
        id = idString.split('-')[1];
    }
    return id;
}


function chatWindowEvent(id, event) {
    $.post("chatActions.php", {'action': 'chatWindowEvent', 'event': event, 'tripId': id}, function () {})
        .done(function (data) {
            if (data !== "1") {
                $('#chat-container').replaceWith(data);
                checkActiveChats();
            }
        })
        .fail(function (data) {
            alert("Error: " + data);
        });
}

function checkActiveChats() {

    $.each($('.chat-close'), function() {
        let $this = $(this);
        $this.on('click', function() {
            chatWindowEvent($this.data('chat-id'), 'close');
            let chat = $this.closest($('.chat-window'));
            chat.hide();
        });
    });

    $.each($('.chat-input'), function() {

        let $this = $(this);
        let $chat = $this.parent().parent();
        let tripId = $chat.data('trip-id');

        getMessages(tripId, true);
        addActiveChat(tripId);

        $this.on('keypress', function (e) {

            let code = (e.keyCode ? e.keyCode : e.which);

            if (code === 13 && !e.shiftKey) {
                e.preventDefault();
                let text = $this.val();
                if (text.replace(/^\s+|\s+$/g, '').length > 0) {
                    queueSelfMessage(tripId, text);
                    $this.val('');
                    $this.val($this.val().replace("\n", ''));
                    scrollToBottom($chat.find('.card-body'));
                }
                return true;
            }
        });

    });

    $.each($('.chat-header'), function() {
        let $this = $(this);

        $this.on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            let id = $this.data('chat-id');
            addActiveChat(id);
            let $content =  $('.chat-contents[data-chat-id="' + id + '"]');

            $content.toggle();
            if ($content.is(':hidden') || $content.hasClass('d-none')) {
                chatWindowEvent($this.data('chat-id'), 'minimize');

                $content.find($('.chat-input')).focus();
                scrollToBottom($content.find('.card-body'));
            } else {
                console.log("maximize");
                chatWindowEvent($this.data('chat-id'), 'maximize');
            }
        });
    });
}