// const a = require('./rizhu.json');
// const a = import './rizhu.json'

// fetch('./rizhu.json').then(res => res.json()).then(json => console.log(json));
// fetch('./rizhu.json').then(res => res.json()).then(json => console.log(json));


const fs = require('fs');

try {
    const jsonData = fs.readFileSync('rizhu.json', 'utf-8');
    const data = JSON.parse(jsonData);
    // console.log(data);

    const result = {};
    data.forEach(item => {
        const [date, ganzhi] = item.split('\t');
        result[date] = ganzhi;
    });

    console.log(JSON.stringify(result));

    fs.writeFile('data.json', JSON.stringify(result), err => {
        if (err) throw err;
        console.log('数据已保存');
    });

} catch (error) {
    console.error(error);
}