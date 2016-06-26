# Nightlife Tracker 

I am built this Nightlife Tracker app as part of Free Code Camp's Back End Certification curriculum. You can search for bars in your area, and indicate your intention to go tonight. You can also see all your historical RSVPs and remove ones you don't want on that list (though no one can see it but you). It is a truly single page app (just for fun), and it's my first Angular app.

User stories:
- As an unauthenticated user, I can view all bars in my area.
- As an authenticated user, I can add myself to a bar to indicate I am going there tonight.
- As an authenticated user, I can remove myself from a bar if I no longer want to go there.
- As an unauthenticated user, when I login I should not have to search again.

Built using:
- [Clementine.js](http://www.clementinejs.com), Angular version, as boilerplate (MEAN stack)
- [Bootstrap](http://www.getbootstrap.com) and this unstyled [Scrolling Nav template](http://startbootstrap.com/template-overviews/scrolling-nav/)
- Yelp's search API - thanks to Arian Faurtosh's [Guide to using Yelp's search API](https://arian.io/how-to-use-yelps-api-with-node/), which I've adapted to work with either the search or business API... Free feel to use it if it's useful (app/controllers/yelp.server.js).

Go check out the app at https://nightlife-tracker.herokuapp.com.

Let me know if you have any throughts or feedback!