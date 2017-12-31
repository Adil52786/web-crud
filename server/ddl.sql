drop database if exists web_crud;
create database web_crud;

use web_crud;

create table contact (
  id int auto_increment primary key,
  name text,
  relationship text
);

insert into contact (id, name, relationship)
values (1, 'Tami Volkmann', 'spouse');
