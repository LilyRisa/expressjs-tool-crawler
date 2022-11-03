
# API cào truyện

Dự án viết bằng express-js dùng để kết hợp với cms truyen. Cào các trang được bảo vệ bằng cloudflare hoặc sử dụng js để render nội dung


## Tài liệu API

#### Bắt buộc header cho tất cả api

| HEADER | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token_api` | `string` | **Required**. Your API key |
 

#### Xem html trang (trả về json)

```http
  POST /api/view-page
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page` | `string` | **Required**. Url page cần xem |

* Result
```bash
  {
    status : true,
    html : '<html>...'
  }
```

#### Lấy data chuẩn truyện

```http
  POST /api/get-story
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `url`      | `string` | **Required**. Url cào nội dung |


* Result example
```bash
  {
    "data_truyen": {
        "title": "THIÊN KIM TOÀN NĂNG ĐẠI TÀI",
        "slug_origin": "thien-kim-toan-nang-dai-tai-67260",
        "slug": "thien-kim-toan-nang-dai-tai",
        "description": "✔️ Đọc truyện tranh THIÊN...",
        "meta_title": "THIÊN KIM TOÀN NĂNG ĐẠI TÀI",
        "meta_description": "✔️ Đọc truyện tranh THIÊN KIM T...",
        "meta_keyword": "THIÊN KIM TOÀN NĂNG ĐẠI TÀI",
        "main_keyword": "THIÊN KIM TOÀN NĂNG ĐẠI TÀI",
        "keyword": "",
        "thumbnail": "",
        "name": "THIÊN KIM TOÀN NĂNG ĐẠI TÀI",
        "other_name": "THIÊN KIM TOÀN NĂNG ĐẠI TÀI",
        "status": 1,
        "content": "Ngày xưa đại lão doanh doanh tỉ...",
        "is_home": 0,
        "is_feature": 0,
        "author": "Đang cập nhật",
        "source_origin": "https://www.nettruyenin.com/truyen-tranh/thien-kim-toan-nang-dai-tai-67260",
        "is_update": "Đang tiến hành",
        "views": 218
    },
    "chapter": [
        "https://www.nettruyenme.com/truyen-tranh/thien-kim-toan-nang-dai-tai/chap-32/923529",
        "https://www.nettruyenme.com/truyen-tranh/thien-kim-toan-nang-dai-tai/chap-31/923524",
        ....
      ]
}
```

#### insert truyện vào database

```http
  POST /api/insert-story
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `url`      | `string` | **Required**. Url cào nội dung |
| `category_id`      | `int` | **Required**. category_id (Lấy bên api truyện chính) |

* Result example
```bash
{
    status : true,
    story_id : 412,  // ID truyện trả về
    messeges : '...'
}
```


#### insert chapter vào database

```http
  POST /api/insert-story
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `url`      | `string` | **Required**. Url cào nội dung |
| `category_id`      | `int` | **Required**. category_id (Lấy bên api truyện chính) |
| `update_chapter`      | `boolean` | *Optional*  update_chapter tham số tùy chọn nếu tồn tại sẽ cập nhật lại |

* Result example
```bash
{
    status : true,
    messeges : '...'
}
```


## 🔗 Social
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/minbv10121999/)
[![twitter](https://img.shields.io/github/followers/lilyrisa?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lilyrisa)

