//connection query
var connection = require('../config/db_util');

module.exports = function User(id,first_name,last_name,username,email,password,phone_number,address,company_id) {
  this.id= id;
  this.first_name = first_name;
  this.last_name = last_name;
  this.username = username;
  this.email= email;
  this.password = password;
  this.phone_number = phone_number;
  this.address = address;
  this.company_id = company_id;
  this.toString=function toString(){
		return this.first_name+' '+this.last_name
  };
}