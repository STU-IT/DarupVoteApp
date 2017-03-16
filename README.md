# En knap så blank længere...

## Bla bl bla


## Events

Se espresso events på: [https://eventespresso.com/](https://eventespresso.com/) bemærk vi bruger decaf udgaven, som er gratis!

REST API på: [http://grahn.dk/darup/wp-json/ee/v4.8.36](http://grahn.dk/darup/wp-json/ee/v4.8.36)

DEMO: [https://github.com/eventespresso/eea-rest-api-client/blob/master/standalone-scripts/ee-list-events.php](https://github.com/eventespresso/eea-rest-api-client/blob/master/standalone-scripts/ee-list-events.php)

Eksepel: `http://grahn.dk/darup/wp-json/ee/v4.8.36/events?include=Datetime&where[Datetime.DTT_EVT_end][]=%3E&where[Datetime.DTT_EVT_end][]=2017-03-16T09:30:14`

Dette eksempel
`http://grahn.dk/darup/wp-json/ee/v4.8.36/events?include=Venue&where[Venue.VNU_name]=Voksen%20Scenen&include=Datetime&where[Datetime.DTT_EVT_end][]=%3E&where[Datetime.DTT_EVT_end][]=2017-04-01T18:45:14`
Giver et event (Roling Stones) på [Voksen Scenen] kl 2017-04-01T18:45:14


`http://grahn.dk/darup/wp-json/ee/v4.8.36/events?include=Venue&where[Venue.VNU_name]=Tween%20Scenen&include=Datetime&where[Datetime.DTT_EVT_end][]=%3E&where[Datetime.DTT_EVT_end][]=2017-04-01T17:45:14+01&order_by=Datetime.DTT_EVT_start&order=asc`
