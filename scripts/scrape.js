var cheerio = require('cheerio');
var request = require('request');



var scrape = function(cb) {

request('https://vice.com/en_us/topic/news', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      //empty array
      var article = [{}];
      
      $('.grid__wrapper__card').each((i, el) => {
          //grab text and cut off white space
          var head = $(el).find('h2').text().replace(/\s\s+g/, '');
          var summ = $(el).find('div.grid__wrapper__card__text__summary').text();
          var link = $(el).attr('href');
          var datePosted = $(el).find('div.canonical__date').text();
          console.log('----');
          console.log(head);
          console.log(summ);
          console.log(datePosted);
          console.log(link);
          console.log('----');


          //regex method that cleans up
          if(head && summ && link && datePosted){
              var headNeat = head.replace(/(\r\n|\r|\t|\s+)/gm," ").trim();
              var summNeat = summ.replace(/(\r\n|\r|\t|\s+)/gm," ").trim();
              var datePostedNeat = datePosted.replace(/(\r\n|\r|\t|\s+)/gm," ").trim();
              
              var dataToAdd = {
                  headline: headNeat,
                  summary: summNeat,
                  link: link,
                  datePosted: datePostedNeat
              };
              article.push(dataToAdd);
          }
      });
      console.log('scrape done')
      cb(article);
  }
});
}
    


module.exports = scrape;