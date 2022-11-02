const mysql = require("mysql2/promise");
var {config} = require('./env');

module.exports = class DB{
    static __connection = null;
    static instance = null;
    table = [];
    column = [];
    condition = [];
    order = [];
    limit_int = [];
    offset_int = [];
    sql = [];
    
    constructor(sql = null) {
      this.sql = sql;
    }

    async get(){
        let data = await this.exec();
        return data[0];
    }
    async first(){
        let data = await this.exec();
        return typeof data[0][0] == 'undefined' ? null : data[0][0];
    }

    async exec(){
        if(DB.__connection == null){
            const CONFIG_DB = {
                host: config('database.host'),
                user: config('database.username'),
                password: config('database.password'),
                database: config('database.database'),
                port: config('database.port'),
              }
            DB.__connection = await mysql.createConnection(CONFIG_DB);

            if(!DB.__connection){
                throw 'Khong the ket noi den co so du lieu';
            }
        }
        // COLUMN
        if(this.column.length == 0){
            this.column = '*';
        }else{
            let column = '';
            for(let i = 0; i < this.column.length; i++){
                if(i !== 0){
                    column += `,${this.column[i]}`;
                }else{
                    column += this.column[i];
                }
            }
            this.column = column;
        }

        // where condition
        if(this.condition.length == 0){
            this.condition = '';
        }else{
            let where = 'WHERE (';
            let whereand = this.condition.filter(item => item.type == 1);
            let whereor = this.condition.filter(item => item.type == 0);
            this.condition.sort((a,b) =>{
                return b.type - a.type;
            })
            for(let i = 0; i < whereand.length; i++){
                if(i == whereand.length - 1){
                    where += `${whereand[i].column} = ${Number.isInteger(whereand[i].condition) ?  whereand[i].condition : "'" +whereand[i].condition+ "'"})`;
                }else{
                    where += `${whereand[i].column} = ${Number.isInteger(whereand[i].condition) ?  whereand[i].condition : "'" +whereand[i].condition+ "'"} AND `;
                }
            }
            if(whereor.length != 0){ // check where or
                where += ' OR ';
                for(let i = 0; i < whereor.length; i++){
                    if(i == whereor.length - 1){
                        where += `${whereor[i].column} = ${Number.isInteger(whereor[i].condition) ?  whereor[i].condition : "'" +whereor[i].condition+ "'"}`;
                    }else{
                        where += `${whereor[i].column} = ${Number.isInteger(whereor[i].condition) ?  whereor[i].condition : "'" +whereor[i].condition+ "'"} OR `;
                    }
                }
            }
            this.condition = where;
            
        }
        

        // ORDER BY
        if(this.order.length == 0){
            this.order = '';
        }else{
            let orderby = 'ORDER BY ';
            for(let i = 0; i < this.order.length; i++){
                if(i == this.order.length - 1){
                    orderby += `${this.order[i].column} ${this.order[i].sort}`;
                }else{
                    orderby += `${this.order[i].column} ${this.order[i].sort},`;
                }
            }
            this.order = orderby;
        }
        

        // LIMIT
        this.limit_int = this.limit_int.length != 0 ? 'LIMIT '+this.limit_int : '';
        // OFFSET
        this.offset_int = this.offset_int.length != 0 ? 'OFFSET '+this.offset_int : '';

        this.sql = `SELECT ${this.column} FROM ${this.table} ${this.condition} ${this.order} ${this.limit_int} ${this.offset_int}`;

        let data = await DB.__connection.execute(this.sql);
        return data;
        
    }
  
    orderby(order, sort){
      this.order.push({
        'column' : order,
        'sort' : sort
      });
      return this;
    }

    limit(limit){
        this.limit_int = limit;
        return this;
    }

    offset(offset){
        this.offset_int = offset;
        return this;
    }

    where(...args){
        if(args.length == 1 && Array.isArray(args[0])){
            args[0].forEach((item)=>{
                let column = Object.getOwnPropertyNames(item)[0];
                let condition = item[column];
                this.condition.push({
                    'column' : column,
                    'condition' : condition,
                    'type' : 1,
                })
            });
            return this;
        }
        this.condition.push({
            'column' : args[0],
            'condition' : args[1],
            'type' : 1,
        });
        return this;
    }
    orWhere(...args){
        if(args.length == 1 && Array.isArray(args[0])){
            args[0].forEach((item)=>{
                let column = Object.getOwnPropertyNames(item)[0];
                let condition = item[column];
                this.condition.push({
                    'column' : column,
                    'condition' : condition,
                    'type' : 0,
                })
            });
            return this;
        }
        this.condition.push({
            'column' : args[0],
            'condition' : args[1],
            'type' : 0,
        })
        return this;
    }
    
    whereLike(column, parameter ,condition){
        this.condition.push({
            'column' : column,
            'condition' : condition,
            'parameter' : parameter,
            'type' : 1,
        });
        return this;
    }

    select(...args){
        for(let item of args){
            this.column.push(item);
        }
        return this;
    }
  
    static async execute(...sql){
        if(DB.__connection == null){
            const CONFIG_DB = {
                host: config('database.host'),
                user: config('database.username'),
                password: config('database.password'),
                database: config('database.database'),
                port: config('database.port'),
              }
            DB.__connection = await mysql.createConnection(CONFIG_DB);
            if(!DB.__connection){
                throw 'Khong the ket noi den co so du lieu';
            }
        }
      if(sql.length == 1 && !Array.isArray(sql[0])){
        let data = await DB.__connection.execute(sql[0]);
        return data;
      }
      let data = await DB.__connection.execute(sql[0], sql[1]);
      return data;
    }

    static table(table){
      DB.instance = new DB();
      DB.instance.table = table;
      return DB.instance;
    }

  }


