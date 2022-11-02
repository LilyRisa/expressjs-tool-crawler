const puppeteer = require('puppeteer');
const moment = require('moment');

class IndexController{

    async viewHtml(req, res){
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
         });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');
        await page.goto(req.body.page);
        const html = await page.evaluate(() => document.querySelector('html').outerHTML);
        await browser.close();
        res.end(JSON.stringify({
            'status' : true,
            html: html
        }));
    }

    async get_link_truyen(link){
    
        await page.goto(link);
        let link_origin = link.split('/');
        link_origin = link_origin[link_origin.length - 1];
        let data = {
            data_truyen: {},
            chapter: {}
        };
    
        const title = await page.evaluate(() => document.querySelector('.title-detail').outerText);
        const content = await page.evaluate(() => document.querySelector('.detail-content p').outerText);
        const author = await page.evaluate(() => document.querySelector('.author p.col-xs-8').outerText);
        const is_update = await page.evaluate(() => document.querySelector('.status p.col-xs-8').outerText);
    
        const chapter_list = await page.evaluate(() => Array.from(document.querySelectorAll('#nt_listchapter .chapter a[href]'), a => a.getAttribute('href')) );
        let thumbnail = await page.$$eval('.detail-info .col-image img[src]', imgs => imgs.map(img => img.getAttribute('src')));
    
        if(thumbnail.length >= 0){
            thumbnail = await movefile(thumbnail[0]);
        }
            
        
        data.data_truyen.title = title;
        data.data_truyen.slug_origin = link_origin;
        data.data_truyen.slug = slugify(title);
        data.data_truyen.description = `✔️ Đọc truyện tranh ${title} Tiếng Việt bản dịch Full mới nhất, ảnh đẹp chất lượng cao, cập nhật nhanh và sớm nhất tại ${process.env.APP_NAME}`;
        data.data_truyen.meta_title = title;
        data.data_truyen.meta_description = `✔️ Đọc truyện tranh ${title} Tiếng Việt bản dịch Full mới nhất, ảnh đẹp chất lượng cao, cập nhật nhanh và sớm nhất tại ${process.env.APP_NAME}`;
        data.data_truyen.meta_keyword = title;
        data.data_truyen.main_keyword = title;
        data.data_truyen.keyword = '';
        data.data_truyen.thumbnail = thumbnail;
        data.data_truyen.name = title;
        data.data_truyen.other_name = title;
        data.data_truyen.status = 1;
        data.data_truyen.content = content;
        data.data_truyen.is_home = 0;
        data.data_truyen.is_feature = 0;
        data.data_truyen.author = author;
        data.data_truyen.source_origin = link;
        data.data_truyen.is_update = is_update;
        data.data_truyen.views = Math.floor(Math.random() * 1000) + 100;
        data.chapter = chapter_list;
        return data;
    
    }
}
module.exports = new IndexController();