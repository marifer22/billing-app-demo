const { get } = require('https');
const { join } = require('path');
const { load } = require('cheerio');
const { writeFile } = require('fs');

const fileName = join(__dirname, 'db.json');
const numberOfBooks = parseInt(process.argv[2], 10) || 10;
const baseDomain = 'https://www.libreriainternacional.com';

function fetch(path) {
  return new Promise((resolve, reject) =>
    get(`${baseDomain}${path}`, res => {
      let result = '';
      res.on('data', data => result += data.toString());
      res.on('end', () => resolve(result));
    }).on('error', err => reject(err)));
}

fetch('/index.php?option=com_virtuemart&category_id=&page=shop.browse&pag=true&limit=' +
  numberOfBooks + '&limitstart=0&Section_id=15&vmcchk=1&Itemid=1')
  .then(res => load(res))
  .then($ => Promise.all($('.libro .portada a')
    .toArray()
    .map(el => ({
      url: $(el).attr('href') + '&vmcchk=1&Itemid=1',
      thumb: baseDomain + $('img', el).attr('src')
    }))
    .map(({ url , thumb }) => fetch(url)
      .then(page => ({ $: load(page), thumb }))))
  )
  .then(pages => pages
    .map(({ $, thumb }) => ({
      thumb,
      image: baseDomain + $('#imagen img').attr('src'),
      preview: baseDomain + $('#preview a').attr('href'),
      title: $('#titulo').text().trim(),
      author: $('#autor a').text().trim(),
      subtitle: $('#subTitulo').text().trim(),
      rank: $('#rank .rank').text().trim(),
      price: $('#precio .productPrice').text().trim(),
      publisher: $('#editorial a').text().trim(),
      category: $('#tema a').text().trim(),
      year: $('#fechaPublicacion').contents().get(2).data.trim(),
      code: $('#codigo').eq(0).contents().get(2).data.trim(),
      description: {
        title: $('#sipnosis h1').text(),
        content: $('#sipnosis p').text()
      }
    }))
    .map((book, index) => Object.assign(book, {
      price: parseInt(book.price.match(/\d+/)[0], 10),
      rank: parseInt(book.rank.match(/^\d/)[0], 10),
      id: index + 1
    })))
  .then(books => new Promise((resolve, reject) =>
    writeFile(
      fileName,
      JSON.stringify({ books }, null, 2),
      err => err ? reject(err) : resolve()
    )))
  .then(() => console.log(fileName, 'completed successfuly!'));
