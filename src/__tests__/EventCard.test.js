const setBackground = require('../components/Cards/EventCard/EventCard').setBackground



test("Setbackground should return correct color based on rating of event", ()=>{
 const rating = 6

 const backgroundColor = setBackground(rating);

 expect(backgroundColor).toBe("yellow")

})