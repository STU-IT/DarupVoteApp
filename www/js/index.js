/**
 * Created by smag on 07-02-2017.
 */

function prepareCategories(event, ui)
{
    console.log("ready to load Categories");

    $.get("grahn.dk/darup/vote.php",
        function(res, code) {
            console.debug(code + ": " + JSON.stringify(res));

            // check lige om indholdes er bare lidt i orden...
            if (res.questions)
            {
                // fjern 'gamle' knapper
               // $('#seasons a').remove();
                var newContent = '';
                // gennemløb alle sæsoner i Items
                for (var i in res.questions)
                {
                    // lav en ny "knap" for hver sæson
                    // <a href="#episodes" data-role="button" data-slug="">Sæson 1</a>
                    newContent += '<a href="#episodes" data-role="button" data-id="'+i+'">' + res.questions[i] + '</a>';
                }
                // tilføj knapperne til DOM'en

                $(newContent).appendTo('#seasons');
                // lad JQM forbedre htmlen
                $('#seasons').enhanceWithin();
                // tilføj event handler til hver knap
                $('#seasons a').one('click', prepareSeason);
            }

        }
    )
}

$(document).ready( // når siden er loaded
    function(){
        var pageContainer = $("body").pagecontainer({
            beforeshow:
                function( event, ui){
                    //hvilken side er vi ved at vise
                    console.log("beforeshow: " + ui.toPage[0].id);

                    switch(ui.toPage[0].id) {
                        case "kategorier":
                            prepareCategories(event, ui);
                            break;

                        case "forside":
                            break;
                    }
                }
        })
    }
);