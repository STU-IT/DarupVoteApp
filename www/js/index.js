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
                        '<input type="radio" name="radio-choice-0" id=' + i +'>' + res[questionId].answers[i].answer +
                        '</label>';
                }
                $(newContent).appendTo("#radio")
                $('#radio').enhanceWithin();
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