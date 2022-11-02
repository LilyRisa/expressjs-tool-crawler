const puppeteer = require('puppeteer');
const {config} = require('../helper/env');
const DB = require('../helper/DB');
const {slugify, checkslugorigin, movefile} = require('../helper/common');
const moment = require('moment'); 
var jsdom = require("jsdom");
class IndexController{

    constructor(){
        this.get_truyen = this.get_truyen.bind(this);
        this.insert_truyen = this.insert_truyen.bind(this);
        this.get_link_truyen = this.get_link_truyen.bind(this);
        this.insert_chapter = this.insert_chapter.bind(this);
    }

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

    async get_truyen(req, res){
        const data = await this.get_link_truyen(req.body.url);
        return res.end(JSON.stringify(data));
    }

 
    async insert_truyen(req, res){
        let data = await this.get_link_truyen(req.body.url);
        let data_truyen = data.data_truyen;
        let row = await DB.table('story').where('slug_origin', checkslugorigin(data_truyen.slug_origin)).orWhere('slug_origin', data_truyen.slug_origin).first();
        if(row) {
            return res.end(JSON.stringify({
                status: false,
                messeges: 'duplicate url: '+ data_truyen.slug_origin+' | update chapter successfully',
            }));
        }
        try{
            
            let id_story = await this._story(data_truyen, req.body.category_id);
            return res.end(JSON.stringify({
                status: true,
                story_id: id_story,
                messeges: 'insert susscessfully!'
            }));
        }catch(e){
            return res.end(JSON.stringify({
                status: false,
                messeges: e
            }));
        }
        
    }
    async insert_chapter(req, res){
        // try{
            let status = await this._chapter(req.body.url, req.body.story_id, req.body.update_chapter);
            if(status){
                return res.end(JSON.stringify({
                    status: true,
                    messeges: 'insert chapter susscessfully!'
                }));
            }

            return res.end(JSON.stringify({
                status: false,
                messeges: 'insert chapter susscessfully!'
            }));
            
        // }catch(e){
        //     return res.end(JSON.stringify({
        //         status: false,
        //         messeges: 'bind error'
        //     }));
        // }
        
    }

    async _story(data, category_id){
        try{
            let ins = await DB.execute('INSERT INTO story (title, slug, description, meta_title, meta_description, meta_keyword, keyword, thumbnail, name, other_name, status, content, is_home, is_feature, author, views, source_origin, slug_origin, is_update, created_at, main_keyword) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [
                data.title,
                data.slug,
                data.description,
                data.meta_title,
                data.meta_description,
                data.meta_keyword,
                data.keyword,
                data.thumbnail,
                data.name,
                data.other_name,
                data.status,
                data.content,
                data.is_home,
                data.is_feature,
                data.author,
                data.views,
                checkslugorigin(data.source_origin),
                data.slug_origin,
                data.is_update,
                moment().format('YYYY-MM-DD HH:mm:ss'),
                data.main_keyword,
            ]);
                console.log('Tao thanh cong truyen :'+ data.title);
               let [rows] = await DB.execute('SELECT id from story where source_origin = ?', [checkslugorigin(data.source_origin)]);
               // insert category
               try{
                    await DB.execute('INSERT INTO story_category (story_id, category_id, is_primary) VALUES (?,?,?)', [
                        rows[0].id,
                        category_id,
                        1
                    ]);
               }catch(e){
                console.log('khong the tạo category\n');
                console.log(e);
               }
               
               return rows[0].id;
            }catch(error){
                console.log('Khong the tao: '+ data.title);
                console.log(error);
                return 0;
            }
    }

    async _chapter(chap, id, update_chapter = false){
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
         });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');
        await page.goto(chap);
        
        const html = await page.evaluate(() => document.querySelector('.reading-detail').outerHTML);
        const title = await page.evaluate(() => document.querySelector('.txt-primary span').outerText);
        const title_other  = await page.evaluate(() => document.querySelector('.txt-primary a').outerText);
        let slug = slugify(title_other);
        
        let dom = new jsdom.JSDOM(html);
        let jquery = require("jquery")(dom.window);
        jquery("#page_0").remove();
        let content = dom.window.document.querySelector(".reading-detail").outerHTML;
        // content = content.textContent;

        let slug_origin = chap.split('/');
        delete slug_origin[0];
        delete slug_origin[1];
        delete slug_origin[2];
        slug_origin = slug_origin.filter(n => n)
        slug_origin = slug_origin.join('/');
        // slug_origin = slug_origin[slug_origin.length - 1];
        //check chapter dulicate 
        let [rows, fields] = await DB.execute('select * from chapters where slug_origin = ? or slug_origin = ? or source_origin = ?', [slug_origin, checkslugorigin(slug_origin), chap]);

        if(rows.length > 0) {
            console.log('Duplicate url chapter: '+ chap);
            if(update_chapter == 'true'){
                try{
                    let check = await DB.execute('UPDATE chapters SET content=?, update_origin=?, slug_origin=? where id=?', [
                        content,
                        moment().format('YYYY-MM-DD HH:mm:ss'),
                        slug_origin,
                        rows[0].id,
                    ]);
                    console.log('update thanh cong id: '+rows[0].id);
                    await browser.close();
                    return true;
                }catch(e){
                    await browser.close();
                    return false;
                }
                
            }else{
                await browser.close();
                return false;  // nếu trùng lặp chapter mới nhất thì chapter sau chắc chắc sẽ trùng
            }
            
        }
        try{
            await DB.execute('insert into chapters (title, meta_title, description, meta_description, content, source_origin, created_at, views, update_origin, story_id, slug, slug_origin) values (?,?,?,?,?,?,?,?,?,?,?,?)', [
                title_other+title,
                title_other+title,
                `✔️ Đọc truyện tranh ${title_other+title} Tiếng Việt bản đẹp chất lượng cao, cập nhật nhanh và sớm nhất ${config('api.app_name')}`,
                `✔️ Đọc truyện tranh ${title_other+title} Tiếng Việt bản đẹp chất lượng cao, cập nhật nhanh và sớm nhất ${config('api.app_name')}`,
                content,
                chap,
                moment().format('YYYY-MM-DD HH:mm:ss'),
                Math.floor(Math.random() * 1000) + 100,
                moment().format('YYYY-MM-DD HH:mm:ss'),
                id,
                slug,
                slug_origin
            ]);
            await browser.close();
            console.log('Tao thanh cong chapter:'+title_other+title);
            return true;
            
        }catch(e){
            await browser.close();
            console.log('loi');
            return false;
        }
        
    }

    

    

    async get_link_truyen(link){
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
         });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0');
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
        await browser.close();
    
        if(thumbnail.length >= 0){
            thumbnail = await movefile(thumbnail[0]);
        }
            
        
        data.data_truyen.title = title;
        data.data_truyen.slug_origin = link_origin;
        data.data_truyen.slug = slugify(title);
        data.data_truyen.description = `✔️ Đọc truyện tranh ${title} Tiếng Việt bản dịch Full mới nhất, ảnh đẹp chất lượng cao, cập nhật nhanh và sớm nhất tại ${config('api.app_name')}`;
        data.data_truyen.meta_title = title;
        data.data_truyen.meta_description = `✔️ Đọc truyện tranh ${title} Tiếng Việt bản dịch Full mới nhất, ảnh đẹp chất lượng cao, cập nhật nhanh và sớm nhất tại ${config('api.app_name')}`;
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