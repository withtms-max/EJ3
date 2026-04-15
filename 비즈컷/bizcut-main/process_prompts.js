import fs from 'fs';
import csv from 'csv-parser';

const results = [];
console.log('Starting to parse CSV...');

fs.createReadStream('c:\\mannene\\nano-banana-pro-prompts-20260310.csv')
    .pipe(csv())
    .on('data', (data) => {
        let sourceMedia = [];
        try {
            if (data.sourceMedia) {
                sourceMedia = JSON.parse(data.sourceMedia);
            }
        } catch (e) { }

        // 필요한 데이터만 추출 (용량 최적화)
        results.push({
            id: data.id,
            t: data.title,
            d: data.description,
            c: data.content,
            img: sourceMedia.length > 0 ? sourceMedia[0] : null
        });
    })
    .on('end', () => {
        fs.writeFileSync('c:\\mannene\\public\\prompts.json', JSON.stringify(results));
        console.log('Successfully processed ' + results.length + ' prompts!');
        console.log('Saved to c:\\mannene\\public\\prompts.json');
    });
