var questionId;

function prepareStem(event, ui)
{

    $.get
    (
        'http://grahn.dk/darup/vote.php?qid=' + questionId,
        function(res, code)
        {
            //console.debug(code + ": " + JSON.stringify(res));

            // check lige om indholdes er bare lidt i orden...
            if ( res[questionId].answers)
            {
                // fjern 'gamle' div'er
                $('#radio *').remove();
                var newContent = '';
                // gennemløb alle afsnit i Items

                // res[questionID].question

                for (var i in res[questionId].answers)
                {
                    // lav en ny "div" for hver sæson
                    // <div>
                    //     <a href="#episodeDetails">
                    //         <img src="xxx">
                    //         <h2>2 3-10</h2>
                    //     <h2>Jonas kysser Eva, men Noora ser det hele</h2>
                    //     </a>
                    //     </div>
                    newContent +=
                        '<label>' +
                        '<input type="radio" name="radio_choice" value="' + i +'">' + res[questionId].answers[i].answer +
                        '</label>';
                }
                //newContent += ""
                $(newContent).appendTo("#radio")
                $('#radio').enhanceWithin();

                $('#radio input[type="radio"]').one('click', function(){
                    answerID = this.value;
                });


                $('#stemKnap').one('click', function(){
                    // indsamle alle data
                    var postData = {};
                    postData['action']              = 'polls';
                    postData['view']                = 'process';
                    postData['poll_id']             = questionId;
                    postData['poll_' + questionId]  = answerID;
                    postData['poll_' + questionId + '_nonce']  = res['poll_' + questionId + '_nonce']

                    // send request
                    /// min postData: {"action":"poll","view":"process","poll_id":2,"poll_2":"10","poll_2_nonce":"ef888dbe6c"}
                    /// din postData: {"action":"polls","view":"process","poll_id":"2","poll_2":"8","poll_2_nonce":"ef888dbe6c"}
                    $.post('http://grahn.dk/darup/wp-admin/admin-ajax.php', postData,
                        function(returnData, code){
                            console.log('Du har stemt');

                            console.log('postData: ' + JSON.stringify(postData));

                            console.log('postRes: ' + JSON.stringify(returnData));
                            console.log('postRes: ' + JSON.parse(returnData));
                            console.log(code + ': ' + returnData);
                        }
                    ).fail(function () {
                        console.log('Det virkede ikke')
                    }).always(function () {
                        console.log('Du har forsøgt at stemme... :-)')
                    });
                    // henvise til resultat
                });
            }
        }
    )
}

$(document).ready( // når siden er loaded
    function()
    {
        var pageContainer = $("body").pagecontainer
        (
            {
            beforeshow:
                function( event, ui)
                {
                    //hvilken side er vi ved at vise
                    console.log("beforeshow: " + ui.toPage[0].id);

                    switch(ui.toPage[0].id)
                    {
                        case "stem":
                            // debug mockUp
                            questionId = 2;
                            prepareStem(event, ui);
                            break;

                        case "landingpage":
                            break;
                    }
                }
            }
        )
    }
);